"""
inference.py
============
Real-time ASL frame inference pipeline.

Uses the MediaPipe Tasks Vision API (HandLandmarker) compatible with
mediapipe >=0.10.30 and Python 3.13.

Pipeline per frame:
  1. Decode base64 JPEG → OpenCV BGR image
  2. MediaPipe HandLandmarker → detect hand landmarks
  3. Crop + resize to 64×64
  4. Normalise → PyTorch tensor
  5. ASLNet forward pass → 29-class softmax
  6. Temporal smoothing  → stable prediction

Prediction Smoothing:
  A deque of the last N raw predictions is maintained.
  A prediction is "confirmed" only when the same class appears
  in ≥ SMOOTH_MAJORITY of the window, preventing jitter.
"""

from __future__ import annotations

import base64
import logging
import time
from collections import deque
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

import cv2
import mediapipe as mp
import numpy as np
import torch
import torch.nn.functional as F
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision

from backend.model_loader import ASLNet, LABELS, IMAGE_SIZE

log = logging.getLogger("signa.inference")

# ── Config ────────────────────────────────────────────────────────────────────
SMOOTH_WINDOW     = 7      # frames to keep in smoothing buffer
SMOOTH_MAJORITY   = 5      # votes needed to confirm a prediction
CONFIDENCE_THRESH = 0.55   # minimum softmax confidence to emit
HAND_PADDING      = 0.25   # fractional padding around hand bounding box

# Pixel normalisation constants (ImageNet mean/std for pre-trained CNNs)
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

# Path to the MediaPipe HandLandmarker model file
_HAND_LANDMARKER_MODEL = Path(__file__).parent / "models" / "hand_landmarker.task"


# ── Data types ────────────────────────────────────────────────────────────────
@dataclass
class Prediction:
    """Single-frame inference result."""
    label:       str
    confidence:  float
    class_index: int
    top5:        list[dict]          # [{"label": str, "confidence": float}]
    hand_detected: bool
    smoothed:    bool = False        # True when confirmed by smoother
    emitted:     bool = False        # True when sent to client


@dataclass
class PredictionHistory:
    """Rolling history of the last N emitted predictions."""
    items: list[dict] = field(default_factory=list)
    maxlen: int = 20

    def add(self, label: str, confidence: float, ts: float) -> None:
        if len(self.items) >= self.maxlen:
            self.items.pop(0)
        self.items.append({"label": label, "confidence": confidence, "ts": ts})

    def to_list(self) -> list[dict]:
        return list(reversed(self.items))   # newest first


# ── MediaPipe Tasks HandLandmarker factory ────────────────────────────────────
def make_hand_landmarker(
    max_hands: int = 1,
    detect_conf: float = 0.6,
    presence_conf: float = 0.5,
    tracking_conf: float = 0.5,
) -> vision.HandLandmarker:
    """
    Create a HandLandmarker using the MediaPipe Tasks Vision API.
    Uses IMAGE running mode (synchronous, one frame at a time).
    """
    model_path = str(_HAND_LANDMARKER_MODEL)
    if not _HAND_LANDMARKER_MODEL.exists():
        raise FileNotFoundError(
            f"HandLandmarker model not found at '{model_path}'. "
            "Download it from: https://storage.googleapis.com/mediapipe-models/"
            "hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task"
        )

    options = vision.HandLandmarkerOptions(
        base_options=mp_python.BaseOptions(model_asset_path=model_path),
        running_mode=vision.RunningMode.IMAGE,
        num_hands=max_hands,
        min_hand_detection_confidence=detect_conf,
        min_hand_presence_confidence=presence_conf,
        min_tracking_confidence=tracking_conf,
    )
    return vision.HandLandmarker.create_from_options(options)


# ── Preprocessing helpers ─────────────────────────────────────────────────────
def decode_frame(b64_data: str) -> Optional[np.ndarray]:
    """Base64 JPEG/PNG → OpenCV BGR uint8 array."""
    try:
        if "," in b64_data:
            b64_data = b64_data.split(",", 1)[1]
        raw = base64.b64decode(b64_data)
        arr = np.frombuffer(raw, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        return img
    except Exception as exc:
        log.debug(f"decode_frame error: {exc}")
        return None


def crop_hand_roi(
    image: np.ndarray,
    landmarks: list,
    img_width: int,
    img_height: int,
    padding: float = HAND_PADDING,
) -> Optional[np.ndarray]:
    """
    Extract a padded, square bounding box around the detected hand.
    Returns a 64×64 RGB crop, or None if landmarks are invalid.

    `landmarks` is a list of NormalizedLandmark from the Tasks API.
    Each landmark has .x and .y in [0, 1] normalised coordinates.
    """
    h, w = image.shape[:2]

    xs = [lm.x * w for lm in landmarks]
    ys = [lm.y * h for lm in landmarks]

    x_min, x_max = min(xs), max(xs)
    y_min, y_max = min(ys), max(ys)

    bw = x_max - x_min
    bh = y_max - y_min
    side = max(bw, bh)

    # Centre + add padding
    cx, cy = (x_min + x_max) / 2, (y_min + y_max) / 2
    half = side * (1 + padding) / 2

    x1 = max(0, int(cx - half))
    y1 = max(0, int(cy - half))
    x2 = min(w, int(cx + half))
    y2 = min(h, int(cy + half))

    if x2 <= x1 or y2 <= y1:
        return None

    crop = image[y1:y2, x1:x2]

    # Make square by padding with black
    ch, cw = crop.shape[:2]
    sq = max(ch, cw)
    canvas = np.zeros((sq, sq, 3), dtype=np.uint8)
    y_off = (sq - ch) // 2
    x_off = (sq - cw) // 2
    canvas[y_off:y_off + ch, x_off:x_off + cw] = crop

    resized = cv2.resize(canvas, (IMAGE_SIZE, IMAGE_SIZE), interpolation=cv2.INTER_AREA)
    rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    return rgb


def preprocess(crop_rgb: np.ndarray) -> torch.Tensor:
    """
    Normalise 64×64 RGB uint8 → float32 tensor (1, 3, 64, 64).
    Uses ImageNet statistics for maximum compatibility.
    """
    img = crop_rgb.astype(np.float32) / 255.0
    img = (img - MEAN) / STD
    tensor = torch.from_numpy(img).permute(2, 0, 1).unsqueeze(0)  # (1,3,H,W)
    return tensor


def landmarks_to_dict(landmarks: list) -> list[dict]:
    """
    Convert a list of NormalizedLandmark objects to JSON-serialisable dicts.
    Returns a list of 21 landmark dicts with x, y, z coordinates.
    """
    return [
        {"x": round(lm.x, 6), "y": round(lm.y, 6), "z": round(lm.z, 6)}
        for lm in landmarks
    ]


# ── Inference engine ──────────────────────────────────────────────────────────
class InferenceEngine:
    """
    Per-connection inference engine.

    Each WebSocket client gets its own InferenceEngine so that
    the prediction smoother maintains per-user temporal state.
    """

    def __init__(self, model: ASLNet) -> None:
        self.model   = model
        self.hands   = make_hand_landmarker()
        self._smoother: deque[int] = deque(maxlen=SMOOTH_WINDOW)
        self.history = PredictionHistory()
        self._last_emitted_label: Optional[str] = None
        self._last_emit_ts: float = 0.0
        self.EMIT_COOLDOWN = 1.5   # seconds before same label can re-emit

    # ── Public API ─────────────────────────────────────────────────────────
    def process_frame(self, b64_data: str) -> dict:
        """
        Full pipeline: decode → hand detect → crop → infer → smooth.
        Returns a structured dict ready to JSON-serialise and send over WS.
        """
        t0 = time.perf_counter()

        # 1. Decode
        img = decode_frame(b64_data)
        if img is None:
            return self._error_response("Frame decode failed")

        # 2. MediaPipe HandLandmarker detection (Tasks API)
        rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        result = self.hands.detect(mp_image)

        if not result.hand_landmarks:
            self._smoother.clear()
            return {
                "type":         "no_hand",
                "hand_detected": False,
                "landmarks":    [],
                "latency_ms":   round((time.perf_counter() - t0) * 1000, 1),
            }

        # 3. Extract landmarks for the first detected hand
        hand_lms = result.hand_landmarks[0]  # list of NormalizedLandmark
        h, w = img.shape[:2]

        # Serialise landmarks for the frontend
        lm_data = landmarks_to_dict(hand_lms)

        # 4. Crop hand ROI
        crop = crop_hand_roi(img, hand_lms, w, h)
        if crop is None:
            return self._error_response("Hand crop failed")

        # 5. Preprocess + infer
        tensor = preprocess(crop)
        with torch.no_grad():
            logits = self.model(tensor)        # (1, 29)
            probs  = F.softmax(logits, dim=1)[0]  # (29,)

        probs_np  = probs.numpy()
        top5_idx  = np.argsort(probs_np)[::-1][:5]
        top5      = [
            {"label": LABELS[i], "confidence": round(float(probs_np[i]), 4)}
            for i in top5_idx
        ]
        best_idx  = int(np.argmax(probs_np))
        best_conf = float(probs_np[best_idx])
        best_label = LABELS[best_idx]

        # 6. Temporal smoothing
        self._smoother.append(best_idx)
        smoothed, confirmed_label = self._get_smoothed_prediction()

        # 7. Emit decision
        emitted   = False
        emit_label = confirmed_label or best_label

        now = time.perf_counter()
        can_emit = (
            smoothed
            and best_conf >= CONFIDENCE_THRESH
            and emit_label != "nothing"
            and (
                emit_label != self._last_emitted_label
                or now - self._last_emit_ts > self.EMIT_COOLDOWN
            )
        )
        if can_emit:
            emitted = True
            self._last_emitted_label = emit_label
            self._last_emit_ts = now
            self.history.add(emit_label, best_conf, now)

        return {
            "type":          "prediction",
            "prediction":    best_label,
            "label":         best_label,
            "confidence":    round(best_conf, 4),
            "class_index":   best_idx,
            "top5":          top5,
            "landmarks":     lm_data,
            "smoothed_label": confirmed_label,
            "smoothed":      smoothed,
            "emitted":       emitted,
            "hand_detected": True,
            "latency_ms":    round((time.perf_counter() - t0) * 1000, 1),
        }

    def get_history(self) -> list[dict]:
        return self.history.to_list()

    def close(self) -> None:
        if self.hands:
            self.hands.close()

    # ── Private ─────────────────────────────────────────────────────────────
    def _get_smoothed_prediction(self) -> tuple[bool, Optional[str]]:
        """
        Returns (is_stable, label_or_None).
        Stable = one class appears ≥ SMOOTH_MAJORITY times in the window.
        """
        if len(self._smoother) < SMOOTH_WINDOW:
            return False, None
        counts: dict[int, int] = {}
        for idx in self._smoother:
            counts[idx] = counts.get(idx, 0) + 1
        best_idx = max(counts, key=counts.__getitem__)
        if counts[best_idx] >= SMOOTH_MAJORITY:
            return True, LABELS[best_idx]
        return False, None

    @staticmethod
    def _error_response(msg: str) -> dict:
        return {"type": "error", "message": msg, "hand_detected": False}

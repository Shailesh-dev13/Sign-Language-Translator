"""
model_loader.py
===============
Reconstructs the ASL CNN architecture exactly from the state_dict
and loads the pretrained weights from asl_model.pth.

Architecture (reverse-engineered from state_dict shapes):
  Input  : (B, 3, 64, 64)  — RGB, 64×64

  features:
    [0]  Conv2d(3,  32, 3, padding=1)
    [1]  BatchNorm2d(32)
    [2]  ReLU
    [3]  Conv2d(32, 32, 3, padding=1)
    [4]  BatchNorm2d(32)
    [5]  ReLU
    [6]  MaxPool2d(2,2)            → (B, 32, 32, 32)

    [8]  Conv2d(32, 64, 3, padding=1)
    [9]  BatchNorm2d(64)
    [10] ReLU (inferred)
    [11] Conv2d(64, 64, 3, padding=1)
    [12] BatchNorm2d(64)
    [13] ReLU
    [14] MaxPool2d(2,2)            → (B, 64, 16, 16)

    [16] Conv2d(64,  128, 3, padding=1)
    [17] BatchNorm2d(128)
    [18] ReLU
    [19] Conv2d(128, 128, 3, padding=1)
    [20] BatchNorm2d(128)
    [21] ReLU
    [22] MaxPool2d(2,2)            → (B, 128, 8, 8)

  classifier:
    [0]  Flatten                   → (B, 8192)
    [1]  Linear(8192, 512)
    [2]  ReLU
    [3]  Dropout(0.5)
    [4]  Linear(512, 256)
    [5]  ReLU
    [6]  Dropout(0.5)
    [7]  Linear(256, 29)

  29 classes: A-Z + del, space, nothing
"""

from __future__ import annotations

import logging
import threading
from pathlib import Path

import torch
import torch.nn as nn

log = logging.getLogger("signa.model_loader")

# ── Labels ────────────────────────────────────────────────────────────────────
# 29 ASL classes: A-Z (0-25) + del (26) + nothing (27) + space (28)
LABELS: list[str] = [chr(i) for i in range(ord("A"), ord("Z") + 1)] + [
    "del",
    "nothing",
    "space",
]
NUM_CLASSES = len(LABELS)   # 29
IMAGE_SIZE  = 64             # pixels (h = w)


# ── Architecture ──────────────────────────────────────────────────────────────
class ASLNet(nn.Module):
    """
    Reconstructed ASL CNN.  Matches the pretrained asl_model.pth state_dict
    exactly — do not modify layer indices.
    """

    def __init__(self, num_classes: int = NUM_CLASSES) -> None:
        super().__init__()

        # Block 1: 3→32 (indices 0-6)
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, 3, padding=1),   # 0
            nn.BatchNorm2d(32),               # 1
            nn.ReLU(inplace=True),            # 2
            nn.Conv2d(32, 32, 3, padding=1),  # 3
            nn.BatchNorm2d(32),               # 4
            nn.ReLU(inplace=True),            # 5
            nn.MaxPool2d(2, 2),               # 6  → 32×32

            # Gap at index 7 — preserved for state_dict alignment
            nn.Identity(),                    # 7

            # Block 2: 32→64 (indices 8-14)
            nn.Conv2d(32, 64, 3, padding=1),  # 8
            nn.BatchNorm2d(64),               # 9
            nn.ReLU(inplace=True),            # 10
            nn.Conv2d(64, 64, 3, padding=1),  # 11
            nn.BatchNorm2d(64),               # 12
            nn.ReLU(inplace=True),            # 13
            nn.MaxPool2d(2, 2),               # 14  → 16×16

            # Gap at index 15
            nn.Identity(),                    # 15

            # Block 3: 64→128 (indices 16-22)
            nn.Conv2d(64, 128, 3, padding=1), # 16
            nn.BatchNorm2d(128),              # 17
            nn.ReLU(inplace=True),            # 18
            nn.Conv2d(128, 128, 3, padding=1),# 19
            nn.BatchNorm2d(128),              # 20
            nn.ReLU(inplace=True),            # 21
            nn.MaxPool2d(2, 2),               # 22  → 8×8
        )

        # Classifier: 128×8×8 = 8192 → 512 → 256 → 29
        self.classifier = nn.Sequential(
            nn.Flatten(),                     # 0
            nn.Linear(8192, 512),             # 1
            nn.ReLU(inplace=True),            # 2
            nn.Dropout(0.5),                  # 3
            nn.Linear(512, 256),              # 4
            nn.ReLU(inplace=True),            # 5
            nn.Dropout(0.5),                  # 6
            nn.Linear(256, num_classes),      # 7
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = self.classifier(x)
        return x


# ── Loader singleton ──────────────────────────────────────────────────────────
_model_instance: ASLNet | None = None
_load_lock = threading.Lock()


def load_model(model_path: str | Path) -> ASLNet:
    """
    Load (or return cached) ASLNet from asl_model.pth.
    Thread-safe singleton — safe to call from multiple async handlers.

    The .pth file is a PyTorch zip archive.  We load only the state_dict
    (weights_only=True) and inject it into the reconstructed ASLNet.
    """
    global _model_instance

    if _model_instance is not None:
        return _model_instance

    with _load_lock:
        # Double-checked locking
        if _model_instance is not None:
            return _model_instance

        path = Path(model_path)
        if not path.exists():
            raise FileNotFoundError(
                f"Model not found at '{path}'. "
                "Place asl_model.pth inside backend/models/"
            )

        log.info(f"Loading state_dict from {path} …")
        state_dict = torch.load(str(path), map_location="cpu", weights_only=True)

        model = ASLNet(num_classes=NUM_CLASSES)

        # Load weights — strict=False tolerates Identity() placeholders
        missing, unexpected = model.load_state_dict(state_dict, strict=False)
        if missing:
            log.warning(f"Missing keys in state_dict: {missing}")
        if unexpected:
            log.warning(f"Unexpected keys in state_dict: {unexpected}")

        model.eval()
        log.info(
            f"ASLNet loaded ✓  —  {NUM_CLASSES} classes, input {IMAGE_SIZE}×{IMAGE_SIZE}"
        )
        _model_instance = model
        return model


def get_model() -> ASLNet:
    """Return cached model (raises if not yet loaded)."""
    if _model_instance is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")
    return _model_instance

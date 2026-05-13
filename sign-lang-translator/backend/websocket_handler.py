"""
websocket_handler.py
====================
FastAPI WebSocket router for real-time ASL translation.

WebSocket Protocol (JSON over ws://):
──────────────────────────────────────
CLIENT → SERVER
  { "type": "frame",   "data": "<base64 JPEG>" }
  { "type": "history" }          # request prediction history
  { "type": "ping" }             # keep-alive

SERVER → CLIENT
  { "type": "ready",  "message": str, "classes": int }
  { "type": "prediction", "label": str, "confidence": float,
    "top5": [...], "smoothed": bool, "emitted": bool,
    "hand_detected": bool, "latency_ms": float }
  { "type": "no_hand", "hand_detected": false, "latency_ms": float }
  { "type": "history", "items": [...] }
  { "type": "pong" }
  { "type": "error",  "message": str }
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.inference import InferenceEngine
from backend.model_loader import NUM_CLASSES, get_model

log = logging.getLogger("signa.websocket")

router = APIRouter()


# ── Connection manager ────────────────────────────────────────────────────────
class ConnectionManager:
    """Tracks all active WebSocket connections."""

    def __init__(self) -> None:
        self._connections: dict[str, WebSocket] = {}

    def add(self, client_id: str, ws: WebSocket) -> None:
        self._connections[client_id] = ws
        log.info(f"[{client_id}] connected  (total: {len(self._connections)})")

    def remove(self, client_id: str) -> None:
        self._connections.pop(client_id, None)
        log.info(f"[{client_id}] disconnected  (total: {len(self._connections)})")

    @property
    def count(self) -> int:
        return len(self._connections)


manager = ConnectionManager()


# ── Helpers ───────────────────────────────────────────────────────────────────
async def send_json(ws: WebSocket, payload: dict[str, Any]) -> None:
    """Send JSON, swallowing errors on already-closed sockets."""
    try:
        await ws.send_json(payload)
    except Exception:
        pass


# ── WebSocket endpoint ────────────────────────────────────────────────────────
@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket) -> None:
    await ws.accept()

    client_id = f"{ws.client.host}:{ws.client.port}" if ws.client else str(time.time())
    manager.add(client_id, ws)

    # Greet client & confirm model ready
    await send_json(ws, {
        "type":    "ready",
        "message": "Signa AI backend connected. Send frames to begin.",
        "classes": NUM_CLASSES,
        "code":    "READY",
    })

    # Per-connection inference engine
    loop = asyncio.get_event_loop()
    model = get_model()
    engine = InferenceEngine(model)

    try:
        while True:
            # Wait for a message (30-second idle timeout)
            try:
                raw = await asyncio.wait_for(ws.receive_text(), timeout=30.0)
            except asyncio.TimeoutError:
                await send_json(ws, {"type": "idle"})
                continue

            # Parse
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await send_json(ws, {"type": "error", "message": "Invalid JSON"})
                continue

            msg_type = msg.get("type", "frame")

            # ── Ping / keep-alive ────────────────────────────────────────────
            if msg_type == "ping":
                await send_json(ws, {"type": "pong"})
                continue

            # ── History request ──────────────────────────────────────────────
            if msg_type == "history":
                await send_json(ws, {
                    "type":  "history",
                    "items": engine.get_history(),
                })
                continue

            # ── Frame inference ──────────────────────────────────────────────
            frame_data = msg.get("data") or msg.get("frame")
            if not frame_data:
                await send_json(ws, {"type": "error", "message": "No frame data"})
                continue

            # Run inference in thread pool (CPU-bound, keeps event loop free)
            result = await loop.run_in_executor(
                None, engine.process_frame, frame_data
            )
            await send_json(ws, result)

    except WebSocketDisconnect:
        log.info(f"[{client_id}] WebSocket disconnected normally")
    except Exception as exc:
        log.exception(f"[{client_id}] Unhandled error: {exc}")
        await send_json(ws, {"type": "error", "message": str(exc)})
    finally:
        engine.close()
        manager.remove(client_id)

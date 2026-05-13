"""
app.py
======
Signa AI — FastAPI application entrypoint.

Startup:
  1. Load ASLNet weights from models/asl_model.pth
  2. Mount WebSocket router (/ws)
  3. Expose REST health + labels endpoints

Run:
  python app.py
  — or —
  uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
"""

from __future__ import annotations

import asyncio
import logging
import os
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.model_loader import load_model, LABELS, NUM_CLASSES
from backend.websocket_handler import router as ws_router, manager

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("signa.app")

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).parent
MODEL_PATH = BASE_DIR / "models" / "asl_model.pth"

# ── CORS origins ──────────────────────────────────────────────────────────────
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",   # Vite preview
]

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="Signa AI — ASL Translation Backend",
    description=(
        "Real-time American Sign Language translation using a pretrained "
        "CNN (asl_model.pth) + MediaPipe Hands. "
        "Connect at ws://localhost:8000/ws"
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount WebSocket router
app.include_router(ws_router)


# ── Lifecycle ─────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_event() -> None:
    """Pre-load model so first connection is fast."""
    log.info("=" * 55)
    log.info("  Signa AI Backend  —  starting up")
    log.info("=" * 55)

    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, load_model, MODEL_PATH)
        log.info("✅  Model ready")
    except FileNotFoundError as exc:
        log.error(f"❌  {exc}")
        log.error("    Place asl_model.pth in backend/models/ and restart.")
    except Exception as exc:
        log.exception(f"❌  Model load failed: {exc}")

    log.info("🌐  WebSocket:  ws://localhost:8000/ws")
    log.info("📖  API docs:   http://localhost:8000/docs")
    log.info("=" * 55)


@app.on_event("shutdown")
async def shutdown_event() -> None:
    log.info("Signa AI backend shutting down …")


# ── REST endpoints ────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health() -> dict:
    """
    System health check.
    Returns model status, active connections, and class count.
    """
    from backend.model_loader import _model_instance
    return {
        "status":       "ok",
        "model_loaded": _model_instance is not None,
        "model_path":   str(MODEL_PATH),
        "model_exists": MODEL_PATH.exists(),
        "num_classes":  NUM_CLASSES,
        "connections":  manager.count,
        "version":      "2.0.0",
    }


@app.get("/labels", tags=["Model"])
async def get_labels() -> dict:
    """Return all 29 ASL sign labels with their class indices."""
    return {
        "labels":      LABELS,
        "count":       NUM_CLASSES,
        "index_map":   {str(i): label for i, label in enumerate(LABELS)},
    }


@app.get("/", tags=["System"])
async def root() -> dict:
    return {
        "name":      "Signa AI Backend",
        "version":   "2.0.0",
        "websocket": "ws://localhost:8000/ws",
        "docs":      "http://localhost:8000/docs",
    }


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(
        "backend.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )

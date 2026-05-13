"""
main.py
=======
Alternative entry point for the Signa AI backend.

Run from project root:
    python -m backend.main
    — or —
    uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "backend.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
<div align="center">

# 🤟 Signa AI

**Real-time ASL Sign Language Translator**

*Break communication barriers with edge-based, privacy-first neural recognition.*

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.1+-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-0.10.35-4285F4?logo=google&logoColor=white)](https://ai.google.dev/edge/mediapipe)

</div>

---

## ✨ Features

- **Real-time webcam inference** — Detects ASL hand signs at ~7 fps with <50ms latency
- **PyTorch CNN backbone** — Custom ASLNet classifier trained on 29 sign classes
- **MediaPipe Tasks API** — Hand landmark detection using the latest `HandLandmarker` vision API
- **WebSocket streaming** — Low-latency bidirectional communication between frontend and backend
- **Cinematic UI** — Dark-mode glassmorphism dashboard with live confidence bars and prediction history
- **Privacy-first** — All inference happens locally; no data leaves your machine

---

## 🏗️ Architecture

```
┌─────────────────┐     WebSocket (JSON)     ┌─────────────────────┐
│   React Frontend │ ◄──────────────────────► │   FastAPI Backend   │
│                  │    frames → predictions  │                     │
│  • Webcam capture│                          │  • MediaPipe Hands  │
│  • Live overlay  │                          │  • PyTorch ASLNet   │
│  • Confidence bar│                          │  • Prediction smooth│
│  • Translation   │                          │  • History tracking │
└─────────────────┘                          └─────────────────────┘
```

---

## 📁 Project Structure

```
signa-ai/
├── backend/                  # FastAPI + WebSocket server
│   ├── app.py                # Application entry point
│   ├── inference.py          # MediaPipe + PyTorch pipeline
│   ├── model_loader.py       # Model loading singleton
│   ├── websocket_handler.py  # WebSocket router
│   ├── config.toml           # Server & model configuration
│   ├── requirements.txt      # Python dependencies
│   └── models/               # ML model files (not in git)
│       ├── asl_model.pth     # Pretrained ASL CNN (~17MB)
│       └── hand_landmarker.task  # MediaPipe hand model (~8MB)
│
├── ml/                       # Training scripts (reference)
│   ├── collect_data.py       # Webcam data collection
│   ├── train_lstm.py         # Model training script
│   ├── holistic_utils.py     # Landmark extraction utilities
│   └── label_map.json        # Class index → label mapping
│
├── src/                      # React frontend
│   ├── App.jsx               # Root component + routing
│   ├── main.jsx              # React entry point
│   ├── index.css             # Global styles + design tokens
│   ├── hooks/                # Custom React hooks
│   │   └── useSignaWebSocket.js  # WebSocket management
│   ├── components/           # Reusable UI components
│   │   ├── TranslatorView.jsx
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── layout/           # Navbar, Footer
│   │   ├── sections/         # Landing page sections
│   │   └── ui/               # Generic UI primitives
│   └── pages/                # Route pages
│
├── public/                   # Static assets (favicon, icons)
├── docs/                     # Documentation
│   └── ARCHITECTURE.md       # System architecture details
│
├── index.html                # Vite entry point
├── package.json              # Node dependencies
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint flat config
├── .env.example              # Environment variables template
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x and **npm** ≥ 9.x
- **Python** ≥ 3.11 (tested with 3.13)
- A **webcam** for live inference

### 1. Clone the repository

```bash
git clone https://github.com/Shailesh-dev13/Sign-Language-Translator.git
cd Sign-Language-Translator
```

### 2. Set up the backend

```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Download model files into backend/models/
# asl_model.pth       → Your pretrained ASL CNN
# hand_landmarker.task → https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task
```

### 3. Start the backend server

```bash
# From the project root
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **Health check**: http://localhost:8000/health
- **API docs**: http://localhost:8000/docs
- **WebSocket**: ws://localhost:8000/ws

### 4. Set up the frontend

```bash
# Install Node dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the dev server
npm run dev
```

Open http://localhost:5173/dashboard to start translating!

---

## 🔧 Configuration

### Backend (`backend/config.toml`)

| Key | Default | Description |
|-----|---------|-------------|
| `server.port` | `8000` | Backend server port |
| `model.path` | `models/asl_model.pth` | Path to PyTorch model |
| `model.confidence_threshold` | `0.55` | Min confidence to emit prediction |
| `model.mp_detection_confidence` | `0.7` | MediaPipe hand detection threshold |

### Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_WS_URL` | `ws://localhost:8000/ws` | WebSocket endpoint URL |

---

## 🧪 API Reference

### WebSocket Protocol (`/ws`)

**Client → Server:**
```json
{ "type": "frame", "data": "<base64 JPEG>" }
{ "type": "ping" }
```

**Server → Client:**
```json
{ "type": "prediction", "prediction": "A", "confidence": 0.98, "landmarks": [...], "latency_ms": 15 }
{ "type": "no_hand", "hand_detected": false, "landmarks": [], "latency_ms": 12 }
{ "type": "ready", "message": "Backend connected", "classes": 29 }
```

### REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Server health + model status |
| `GET` | `/labels` | List of supported sign classes |
| `GET` | `/docs` | Interactive Swagger UI |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Tailwind CSS v4, Framer Motion, Vite |
| **Backend** | FastAPI, Starlette WebSockets, Uvicorn |
| **ML Inference** | PyTorch 2.x, MediaPipe Tasks Vision API |
| **Hand Detection** | MediaPipe HandLandmarker (float16) |
| **Classification** | Custom ASLNet CNN (29 classes, 64×64 input) |

---

## 📝 License

This project is for educational and portfolio purposes.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Shailesh-dev13">Shailesh</a></sub>
</div>

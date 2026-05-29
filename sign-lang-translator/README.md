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
- **3D Hand Experience** — Interactive hand model rendered with React Three Fiber on the landing page
- **ASL Dictionary** — Searchable reference library with alphabet, numbers, and common signs
- **Learning System** — Structured lessons with XP tracking, progress bars, and interactive quiz mode
- **Community Hub** — Curated resources, Deaf community organizations, and accessibility tools
- **Cinematic Loading Screen** — Terminal-style boot sequence shown once per browser session
- **Live Dashboard Metrics** — Real-time FPS, confidence, session timer, and AI pipeline visualization
- **Speech Synthesis** — Text-to-speech playback of translated sign sequences

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

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for detailed system architecture, data flow diagrams, and design decisions.

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
│   └── models/               # ML model files
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
│   ├── main.jsx              # React entry point + LoadingScreen
│   ├── index.css             # Global styles + design tokens
│   ├── animations/           # Framer Motion variants
│   │   └── variants.js
│   ├── hooks/                # Custom React hooks
│   │   ├── useSignaWebSocket.js  # WebSocket management
│   │   └── useSessionMetrics.js  # FPS + session tracking
│   ├── components/           # Reusable UI components
│   │   ├── LoadingScreen.jsx # Cinematic boot sequence
│   │   ├── TranslatorView.jsx# Webcam + prediction overlay
│   │   ├── dashboard/        # Dashboard-specific components
│   │   │   ├── AIPipeline.jsx
│   │   │   ├── ConfidenceBar.jsx
│   │   │   ├── ConnectionBadge.jsx
│   │   │   ├── LiveMetricsPanel.jsx
│   │   │   ├── PredictionHistory.jsx
│   │   │   └── TranslationPanel.jsx
│   │   ├── layout/           # Navbar, Footer
│   │   ├── sections/         # Landing page sections
│   │   └── ui/               # Generic UI primitives
│   │       ├── GlassCard.jsx
│   │       ├── GlowButton.jsx
│   │       ├── LessonCard.jsx
│   │       ├── Logo.jsx
│   │       ├── ParticleBackground.jsx
│   │       ├── QuizMode.jsx
│   │       ├── SignCard.jsx
│   │       └── StatusDot.jsx
│   ├── three/                # 3D components
│   │   └── HandModel.jsx     # Interactive hand (R3F)
│   ├── utils/
│   │   └── aslData.js        # ASL sign definitions & lessons
│   └── pages/                # Route pages
│       ├── LandingPage.jsx
│       ├── DashboardPage.jsx
│       ├── DictionaryPage.jsx
│       ├── LearningPage.jsx
│       ├── CommunityPage.jsx
│       └── PlaceholderPage.jsx
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
├── .gitattributes            # Line ending normalization
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
cd Sign-Language-Translator/sign-lang-translator
```

### 2. Set up the backend

```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Model files are included in the repo:
# backend/models/asl_model.pth       — Pretrained ASL CNN
# backend/models/hand_landmarker.task — MediaPipe hand model
#   (or download from https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task)
```

### 3. Start the backend server

```bash
# From the sign-lang-translator directory
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

Open http://localhost:5173 to see the landing page, or go directly to http://localhost:5173/dashboard to start translating!

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
|-------|-----------:|
| **Frontend** | React 19, Tailwind CSS v4, Framer Motion, Vite 8 |
| **3D Graphics** | Three.js, React Three Fiber, Drei |
| **Backend** | FastAPI, Starlette WebSockets, Uvicorn |
| **ML Inference** | PyTorch 2.x, MediaPipe Tasks Vision API |
| **Hand Detection** | MediaPipe HandLandmarker (float16) |
| **Classification** | Custom ASLNet CNN (29 classes, 64×64 input) |

---

## 📸 Screenshots

> Screenshots coming soon. Run the project locally to experience the full cinematic UI.

---

## 🚀 Future Goals

### AI & Model Improvements
- Improve ASL recognition accuracy through larger and more diverse datasets
- Add prediction smoothing and confidence stabilization
- Support dynamic gestures and continuous sign recognition
- Implement sentence-level translation

### User Experience
- Interactive onboarding experience
- Enhanced loading animations and AI status indicators
- Accessibility improvements
- Custom themes and user preferences

### Learning Platform
- Interactive ASL lessons
- Progress tracking system
- Practice quizzes and assessments
- Beginner-to-advanced learning paths

### Dictionary Expansion
- Complete ASL alphabet reference
- Common words and phrase library
- Animated gesture demonstrations
- Advanced search and filtering

### Community Features
- Community discussion forums
- Learning challenges and events
- User-generated educational content
- Collaboration features

### Deployment & Scalability
- Cloud deployment
- Mobile optimization
- API documentation
- Analytics and monitoring

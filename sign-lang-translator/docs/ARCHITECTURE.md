# Signa AI — System Architecture

## Overview

Signa AI is a real-time ASL (American Sign Language) translator with a React frontend and FastAPI backend. The system captures webcam frames, streams them over WebSocket to a Python backend, where MediaPipe extracts hand landmarks and a PyTorch CNN classifies the sign.

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│ FRONTEND (React + Vite)                                         │
│                                                                  │
│  Webcam ──► Canvas ──► JPEG base64 ──► WebSocket.send()          │
│                                                                  │
│  WebSocket.onmessage() ──► prediction state ──► UI overlay       │
│                           └──► landmarks ──► (future: draw)      │
│                           └──► confidence ──► bar + panel        │
└───────────────────────────────┬──────────────────────────────────┘
                                │ ws://localhost:8000/ws
                                ▼
┌──────────────────────────────────────────────────────────────────┐
│ BACKEND (FastAPI + Uvicorn)                                      │
│                                                                  │
│  websocket_handler.py                                            │
│    ├─ Receives JSON frame                                        │
│    ├─ Decodes base64 → numpy array                               │
│    └─ Calls InferenceEngine.predict(frame)                       │
│                                                                  │
│  inference.py  (InferenceEngine)                                 │
│    ├─ MediaPipe HandLandmarker.detect(frame)                     │
│    │    └─ Returns 21 hand landmarks (x, y, z)                   │
│    ├─ Crop hand ROI from landmarks                               │
│    ├─ Resize to 64×64, normalize                                 │
│    ├─ PyTorch ASLNet.forward(tensor)                             │
│    │    └─ Returns 29-class softmax probabilities                │
│    ├─ Prediction smoothing (5/7 frame majority vote)             │
│    └─ Returns { prediction, confidence, landmarks, latency_ms }  │
│                                                                  │
│  model_loader.py  (Singleton)                                    │
│    └─ Loads asl_model.pth once, serves to all WS connections     │
└──────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Server-side inference (not browser)
The PyTorch CNN model is loaded once in the backend process. This avoids shipping large model files to the browser, gives access to the full MediaPipe Tasks API, and enables GPU acceleration if available.

### 2. MediaPipe Tasks API (not legacy `mp.solutions`)
The legacy `mediapipe.solutions.hands` API was removed in MediaPipe 0.10.30+. We use the modern `mediapipe.tasks.python.vision.HandLandmarker` which is actively maintained and supports Python 3.13.

### 3. WebSocket (not HTTP polling)
WebSocket provides full-duplex, low-latency communication. A single persistent connection handles all frame streaming and prediction delivery, typically achieving <50ms round-trip latency.

### 4. Prediction smoothing
Raw per-frame predictions are noisy. The backend implements a sliding window majority vote (5 of 7 frames must agree) before emitting a prediction to the translation panel. The raw prediction is still displayed on the video overlay for responsiveness.

### 5. Frame throttling
The frontend sends frames at ~6.7 fps (150ms interval) rather than the webcam's full 30fps. This prevents overwhelming the backend while maintaining responsive detection.

## Model Architecture

### ASLNet (PyTorch CNN)
- **Input**: 64×64 RGB image (hand crop)
- **Architecture**: Convolutional blocks with batch normalization
- **Output**: 29 classes (A-Z + space, delete, nothing)
- **File**: `backend/models/asl_model.pth` (~17MB)

### MediaPipe HandLandmarker
- **Input**: Full camera frame
- **Output**: 21 hand landmarks with (x, y, z) coordinates
- **File**: `backend/models/hand_landmarker.task` (~8MB)
- **Mode**: `RunningMode.IMAGE` (synchronous per-frame)

## Frontend Component Tree

```
Root (main.jsx)
├── LoadingScreen          ← once-per-session cinematic boot sequence
└── App
    ├── ParticleBackground ← animated neural-net canvas (z-0)
    ├── Navbar             ← sliding active indicator, mobile drawer
    ├── Routes (AnimatePresence)
    │   ├── LandingPage
    │   │   ├── HeroSection      ← 3D HandModel (react-three-fiber)
    │   │   ├── FeaturesSection
    │   │   └── CTASection
    │   ├── DashboardPage
    │   │   ├── LiveMetricsPanel ← FPS, confidence, session timer
    │   │   ├── TranslatorView   ← uses useSignaWebSocket hook
    │   │   │   ├── ConnectionBadge
    │   │   │   ├── Top5Panel
    │   │   │   └── LatencyBadge
    │   │   ├── TranslationPanel
    │   │   │   ├── ConfidenceBar
    │   │   │   └── PredictionHistory
    │   │   └── AIPipeline       ← animated inference pipeline vis
    │   ├── DictionaryPage
    │   │   ├── SignCard          ← ASL sign reference cards
    │   │   └── Category tabs (Alphabet, Numbers, Common)
    │   ├── LearningPage
    │   │   ├── LessonCard        ← structured lessons with XP
    │   │   ├── LessonDetail      ← sign grid + progress tracker
    │   │   └── QuizMode          ← interactive sign identification
    │   ├── CommunityPage         ← resources, orgs, accessibility
    │   └── PlaceholderPage       ← catch-all for unbuilt routes
    └── Footer
```


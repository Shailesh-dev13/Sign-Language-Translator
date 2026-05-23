# Signa AI — ML Training Scripts

This folder contains reference scripts for training the ASL recognition model.

> **Note**: The production backend uses a pretrained PyTorch CNN (`asl_model.pth`). These scripts are provided for reproducibility and further experimentation.

## Contents

| File | Purpose |
|------|---------|
| `collect_data.py` | Webcam data collection with MediaPipe landmarks |
| `train_lstm.py` | LSTM model training script |
| `holistic_utils.py` | MediaPipe holistic landmark extraction utilities |
| `label_map.json` | Class index → label mapping (29 ASL classes) |

## Training Environment

**Recommended**: Python 3.11+ with PyTorch 2.x

```bash
pip install torch torchvision mediapipe opencv-python numpy
```

## Dataset

The model expects a labeled dataset organized as:

```
data/
├── train/
│   ├── A/
│   ├── B/
│   └── ...
└── test/
    ├── A/
    ├── B/
    └── ...
```

## Model Output

The trained model should be placed in:

```
backend/models/asl_model.pth
```

The backend will load it automatically on startup.

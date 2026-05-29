<div align="center">

# 🤟 Signa AI — ASL Sign Language Translator

**Real-time American Sign Language translator powered by PyTorch, MediaPipe, and React.**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.1+-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org)

</div>

---

All project code lives in the [`sign-lang-translator/`](./sign-lang-translator) directory.

👉 **See [sign-lang-translator/README.md](./sign-lang-translator/README.md) for full documentation, setup instructions, and architecture details.**

### Quick Start

```bash
cd sign-lang-translator

# Backend
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000

# Frontend (new terminal)
npm install
npm run dev
```

Open http://localhost:5173 and start translating!
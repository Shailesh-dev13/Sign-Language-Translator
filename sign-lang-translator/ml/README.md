# Mudra ML Training

This folder contains the training path for the ISL alphabet model.

## Input

Use the cleaned dataset folder:

```text
C:\Users\prath\Documents\Codex\2026-05-04\browser-plugin-browser-use-openai-bundled\cleaned_isl_dataset_python
```

It must contain:

```text
train/a ... train/z
test/a  ... test/z
```

## Recommended Training Environment

Your current local Python is 3.13, and TensorFlow may not be available for that version on Windows. The easiest path is Google Colab or a local Python 3.11/3.12 environment.

Install:

```bash
pip install -r ml/requirements.txt
```

Train:

```bash
python ml/train_isl_model.py --epochs 15
```

The script writes browser-ready TensorFlow.js files to:

```text
public/models/isl-alphabet/model.json
```

Once those files exist, the website will load the model automatically.

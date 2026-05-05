# Train the Mudra ISL Model in Google Colab

Your local Python is 3.13, which can be awkward for TensorFlow on Windows. Use Google Colab for the first training run.

## What You Need

Dataset archive:

```text
C:\Users\prath\Documents\Codex\2026-05-04\browser-plugin-browser-use-openai-bundled\cleaned_isl_dataset.tar
```

Training script:

```text
C:\translator project\sign-lang-translator\ml\train_isl_model.py
```

## Steps

1. Open [Google Colab](https://colab.research.google.com/).
2. Create a new notebook.
3. Upload these two files into Colab:
   - `cleaned_isl_dataset.tar`
   - `train_isl_model.py`
4. Run these cells one by one.

### Cell 1: Install Converter

```python
!pip install -q tensorflowjs
```

### Cell 2: Extract Dataset

```python
!mkdir -p /content/isl_data
!tar -xf /content/cleaned_isl_dataset.tar -C /content/isl_data
!find /content/isl_data/train -maxdepth 1 -type d | wc -l
```

You should see `27`, meaning 1 train folder plus 26 letter folders.

### Cell 3: Train and Export

```python
!python /content/train_isl_model.py \
  --data-dir /content/isl_data \
  --epochs 15 \
  --out-dir /content/trained_model \
  --tfjs-out /content/isl_tfjs_model
```

### Cell 4: Zip the Browser Model

```python
!cd /content/isl_tfjs_model && zip -r /content/isl_tfjs_model.zip .
```

### Cell 5: Download

```python
from google.colab import files
files.download("/content/isl_tfjs_model.zip")
```

## Add It to Your Website

After downloading `isl_tfjs_model.zip`:

1. Extract it.
2. Copy its contents into:

```text
C:\translator project\sign-lang-translator\public\models\isl-alphabet
```

That folder should contain:

```text
model.json
group1-shard*.bin
labels.json
```

If conversion fails with `file signature not found`, upload the latest `train_isl_model.py` from this project and rerun training. The script now saves `isl_alphabet.h5`, which TensorFlow.js converter can read.

Then reload:

```text
http://localhost:5173/#translate
```

The camera preview will start running predictions automatically.

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

# ── CPU optimisations ────────────────────────────────────────────────────────
# Use all 12 cores for inter/intra-op parallelism and dataset prefetching.
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "1"   # keep OneDNN (MKL) on
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"    # suppress verbose TF logs

import tensorflow as tf

NUM_CORES = os.cpu_count() or 4
tf.config.threading.set_intra_op_parallelism_threads(NUM_CORES)
tf.config.threading.set_inter_op_parallelism_threads(NUM_CORES)

# ── Constants ────────────────────────────────────────────────────────────────
LABELS     = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
IMAGE_SIZE = 96
BATCH_SIZE = 64    # larger batch → faster CPU throughput
SEED       = 42


# ── Model ────────────────────────────────────────────────────────────────────
def build_model(num_classes: int) -> tf.keras.Model:
    """
    Matches the architecture already in public/models/isl-alphabet/model.json
    exactly, so the TFJS layer names stay consistent.
    Online augmentation layers are included inside the model for simplicity.
    """
    inputs = tf.keras.Input(shape=(IMAGE_SIZE, IMAGE_SIZE, 3))

    # Augmentation (active only during training)
    x = tf.keras.layers.Rescaling(1.0 / 255)(inputs)
    x = tf.keras.layers.RandomFlip("horizontal")(x)
    x = tf.keras.layers.RandomRotation(0.08)(x)
    x = tf.keras.layers.RandomZoom(0.10)(x)
    x = tf.keras.layers.RandomBrightness(0.15)(x)
    x = tf.keras.layers.RandomContrast(0.15)(x)

    # Feature extraction — same as the placeholder model.json
    x = tf.keras.layers.Conv2D(32,  3, padding="same", activation="relu")(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    x = tf.keras.layers.Conv2D(64,  3, padding="same", activation="relu")(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    x = tf.keras.layers.Conv2D(128, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    x = tf.keras.layers.Conv2D(192, 3, padding="same", activation="relu")(x)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.35)(x)
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax")(x)

    model = tf.keras.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=5e-4),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


# ── Data pipeline ────────────────────────────────────────────────────────────
def make_dataset(path: Path, shuffle: bool) -> tf.data.Dataset:
    ds = tf.keras.utils.image_dataset_from_directory(
        path,
        labels="inferred",
        label_mode="int",
        class_names=[label.lower() for label in LABELS],
        image_size=(IMAGE_SIZE, IMAGE_SIZE),
        batch_size=BATCH_SIZE,
        shuffle=shuffle,
        seed=SEED,
    )
    # Parallel prefetch across all CPU cores
    return ds.prefetch(tf.data.AUTOTUNE)


# ── Main ─────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(description="Train ISL alphabet classifier")
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path(
            r"C:\Users\prath\Documents\Codex\2026-05-04"
            r"\browser-plugin-browser-use-openai-bundled"
            r"\cleaned_isl_dataset_python"
        ),
        help="Root dataset directory containing train/ and test/ sub-folders",
    )
    parser.add_argument("--epochs",  type=int,  default=25,
                        help="Maximum training epochs (early-stopping will cut this short)")
    parser.add_argument("--out-dir", type=Path, default=Path("trained_model"),
                        help="Where to save the Keras .keras file and metadata.json")
    parser.add_argument(
        "--tfjs-out",
        type=Path,
        default=Path("..") / "public" / "models" / "isl-alphabet",
        help="Where to write the browser-ready TensorFlow.js model files",
    )
    args = parser.parse_args()

    train_dir = args.data_dir / "train"
    test_dir  = args.data_dir / "test"
    if not train_dir.exists() or not test_dir.exists():
        raise SystemExit(
            f"❌  Expected train/ and test/ folders inside:\n    {args.data_dir}\n"
            f"   train/ exists: {train_dir.exists()}\n"
            f"   test/  exists: {test_dir.exists()}"
        )

    args.out_dir.mkdir(parents=True, exist_ok=True)
    args.tfjs_out.mkdir(parents=True, exist_ok=True)

    print(f"[DATA]  Dataset  : {args.data_dir}")
    print(f"[OUT]   Keras    : {args.out_dir}")
    print(f"[OUT]   TFJS     : {args.tfjs_out}")
    print(f"[INFO]  CPU cores: {NUM_CORES}")
    print()

    train_ds = make_dataset(train_dir, shuffle=True)
    test_ds  = make_dataset(test_dir,  shuffle=False)

    model = build_model(len(LABELS))
    model.summary()

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_accuracy",
            patience=5,
            restore_best_weights=True,
            verbose=1,
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.4,
            patience=3,
            min_lr=1e-6,
            verbose=1,
        ),
        tf.keras.callbacks.ModelCheckpoint(
            filepath=str(args.out_dir / "best_checkpoint.keras"),
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1,
        ),
    ]

    print("\n[START] Training started ...\n")
    history = model.fit(
        train_ds,
        validation_data=test_ds,
        epochs=args.epochs,
        callbacks=callbacks,
    )

    loss, accuracy = model.evaluate(test_ds, verbose=0)
    print(f"\n[RESULT] Test accuracy : {accuracy * 100:.2f}%")
    print(f"[RESULT] Test loss     : {loss:.4f}")

    # ── Save Keras model ──────────────────────────────────────────────────
    keras_path = args.out_dir / "isl_alphabet.keras"
    model.save(keras_path)
    print(f"\n[SAVED] Keras model saved -> {keras_path}")

    metadata = {
        "labels":       LABELS,
        "imageSize":    IMAGE_SIZE,
        "testLoss":     float(loss),
        "testAccuracy": float(accuracy),
        "history": {k: [float(v) for v in vals]
                    for k, vals in history.history.items()},
    }
    meta_path = args.out_dir / "metadata.json"
    meta_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    print(f"[SAVED] Metadata saved   -> {meta_path}")

    # ── Convert to TensorFlow.js ──────────────────────────────────────────
    print(f"\n[CONVERT] Converting to TensorFlow.js -> {args.tfjs_out} ...")
    subprocess.run(
        [
            sys.executable, "-m",
            "tensorflowjs.converters.converter",
            "--input_format=keras",
            str(keras_path),
            str(args.tfjs_out),
        ],
        check=True,
    )
    # Write labels.json alongside the model for the frontend
    (args.tfjs_out / "labels.json").write_text(
        json.dumps(LABELS, indent=2), encoding="utf-8"
    )

    print(f"\n[DONE] Training complete!")
    print(f"       model.json -> {args.tfjs_out / 'model.json'}")
    print(f"       Refresh the Mudra app in your browser to load the new model.")


if __name__ == "__main__":
    main()

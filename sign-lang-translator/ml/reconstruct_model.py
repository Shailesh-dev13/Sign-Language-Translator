import json
import struct
import numpy as np
import tensorflow as tf
import os
import subprocess

# 1. Read the deployed TFJS model.json and weights
model_dir = r'c:\translator project\sign-lang-translator\public\models\isl-alphabet'
with open(os.path.join(model_dir, 'model.json')) as f:
    m = json.load(f)

weights_info = m['weightsManifest'][0]['weights']
with open(os.path.join(model_dir, 'group1-shard1of1.bin'), 'rb') as f:
    bin_data = f.read()

# Parse weights
weights_dict = {}
offset = 0
for w in weights_info:
    name = w['name']
    shape = w['shape']
    size = np.prod(shape)
    # read floats
    floats = struct.unpack(f'{size}f', bin_data[offset:offset+size*4])
    weights_dict[name] = np.array(floats).reshape(shape)
    offset += size * 4

# 2. Build a clean Sequential model
clean_model = tf.keras.Sequential(name='clean_isl_model')
clean_model.add(tf.keras.Input(shape=(96, 96, 3), name='input_layer'))
clean_model.add(tf.keras.layers.Conv2D(32, 3, padding="same", activation="relu", name="conv2d"))
clean_model.add(tf.keras.layers.MaxPooling2D(name="max_pooling2d"))
clean_model.add(tf.keras.layers.Conv2D(64, 3, padding="same", activation="relu", name="conv2d_1"))
clean_model.add(tf.keras.layers.MaxPooling2D(name="max_pooling2d_1"))
clean_model.add(tf.keras.layers.Conv2D(128, 3, padding="same", activation="relu", name="conv2d_2"))
clean_model.add(tf.keras.layers.MaxPooling2D(name="max_pooling2d_2"))
clean_model.add(tf.keras.layers.Conv2D(192, 3, padding="same", activation="relu", name="conv2d_3"))
clean_model.add(tf.keras.layers.GlobalAveragePooling2D(name="global_average_pooling2d"))
clean_model.add(tf.keras.layers.Dropout(0.35, name="dropout"))
clean_model.add(tf.keras.layers.Dense(26, activation="softmax", name="dense"))

# 3. Set weights
for layer in clean_model.layers:
    if len(layer.weights) > 0:
        k_name = f"{layer.name}/kernel"
        b_name = f"{layer.name}/bias"
        layer.set_weights([weights_dict[k_name], weights_dict[b_name]])

# 4. Save and Convert to TFJS
clean_path = r'c:\translator project\sign-lang-translator\ml\trained_model\reconstructed.keras'
os.makedirs(os.path.dirname(clean_path), exist_ok=True)
clean_model.save(clean_path)
print('Reconstructed Keras model saved!')

subprocess.run([
    'python', '-m', 'tensorflowjs.converters.converter',
    '--input_format=keras',
    clean_path,
    model_dir
], check=True)
print('Clean model deployed to public/models/isl-alphabet!')

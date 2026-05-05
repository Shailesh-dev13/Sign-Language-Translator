import tensorflow as tf
import os
import subprocess

# 1. Load trained model
keras_path = r'c:\translator project\sign-lang-translator\ml\trained_model\isl_alphabet.keras'
model = tf.keras.models.load_model(keras_path)

# 2. Build a clean Sequential model
clean_model = tf.keras.Sequential(name='clean_isl_model')
clean_model.add(tf.keras.Input(shape=(96, 96, 3), name='input_layer'))

# 3. Add only the core layers
for layer in model.layers:
    name = layer.name
    if name.startswith('conv') or name.startswith('max_pooling') or name.startswith('global') or name.startswith('dropout') or name.startswith('dense'):
        clean_model.add(layer)

# 4. Save clean model
clean_path = r'c:\translator project\sign-lang-translator\ml\trained_model\clean_isl_alphabet.keras'
clean_model.save(clean_path)
print('Clean Keras model saved!')

# 5. Convert to TFJS
tfjs_out = r'c:\translator project\sign-lang-translator\public\models\isl-alphabet'
subprocess.run([
    'python', '-m', 'tensorflowjs.converters.converter',
    '--input_format=keras',
    clean_path,
    tfjs_out
], check=True)
print('Clean model exported to TFJS!')

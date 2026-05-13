import numpy as np

X = np.array(sequences)
y = to_categorical(labels).astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2
)

model = Sequential()

model.add(
    LSTM(
        128,
        return_sequences=True,
        activation='relu',
        input_shape=(30, 1662)
    )
)

model.add(Dropout(0.3))

model.add(
    LSTM(
        256,
        return_sequences=True,
        activation='relu'
    )
)

model.add(Dropout(0.3))

model.add(
    LSTM(
        128,
        activation='relu'
    )
)

model.add(Dense(128, activation='relu'))
model.add(Dropout(0.2))

model.add(Dense(actions.shape[0], activation='softmax'))

model.compile(
    optimizer='Adam',
    loss='categorical_crossentropy',
    metrics=['categorical_accuracy']
)

model.fit(
    X_train,
    y_train,
    epochs=100,
    validation_data=(X_test, y_test)
)

model.save('models/asl_lstm.keras')

print('Training complete')
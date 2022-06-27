from keras import layers
from keras.models import Sequential

no_lags = 24
no_features = 3
no_output = 1
no_layers = 40
learning_rate = 0.001

model = Sequential()
model.add(layers.Input(shape=(no_lags, no_features)))
model.add(layers.LSTM(no_layers))
model.add(layers.Dense(no_output, activation="linear"))

model.compile(optimizer="adam",
              loss="mse")

summary = model.summary()
print(summary)

model.save('../models/lstm_unweighted')

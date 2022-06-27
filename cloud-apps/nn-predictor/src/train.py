import os

import joblib
import numpy as np
import pandas as pd
from keras.models import load_model
from sklearn import preprocessing, model_selection


def create_X_Y(ts: np.array, lag=1, n_ahead=1) -> tuple:
    n_features = ts.shape[1]

    # Creating placeholder lists
    X, Y = [], []

    for i in range(len(ts) - lag - n_ahead):
        Y.append(ts[(i + lag):(i + lag + n_ahead)])
        X.append(ts[i:(i + lag)])


    X, Y = np.array(X), np.array(Y)

    # Reshaping the X array to an RNN input shape
    X = np.reshape(X, (X.shape[0], lag, n_features))

    return X, Y


os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
input_data = []

no_lags = 24
no_output = 1

df = pd.read_csv('../data/input.csv')
df["hour_cos"] = [np.cos(x * (2 * np.pi / 24)) for x in df["hour"]]
df["hour_sin"] = [np.sin(x * (2 * np.pi / 24)) for x in df["hour"]]
df = df.drop(columns=["hour"])
print(df)

train_data, test_data = model_selection.train_test_split(df, test_size=0.2, random_state=25)

# train on Training Data
scaler = preprocessing.MinMaxScaler()
scaler = scaler.fit(train_data)

# transform both
train_data = scaler.transform(train_data)
test_data = scaler.transform(test_data)

model = load_model('../models/lstm_unweighted')
(x_train, y_train) = create_X_Y(train_data, lag=no_lags, n_ahead=no_output)
(x_test, y_test) = create_X_Y(test_data, lag=no_lags, n_ahead=no_output)

history = model.fit(x_train, y_train, epochs=35, validation_split=0.1)

print('History: ', history.history)

model.save('../models/model_trained')
joblib.dump(scaler, '../models/scaler.gz')

results = model.evaluate(x_test, y_test)
print('Evaluation: ', results)

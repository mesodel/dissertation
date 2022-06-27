import sklearn
import pandas as pd
from keras.models import load_model
from flask import Flask, jsonify
from flask import request
import joblib
import numpy as np

app = Flask(__name__)
model = load_model("../models/model_trained")
scaler = joblib.load("../models/scaler.gz")


def perform_inference(data):
    df = pd.DataFrame(data, columns=["value", "hour"])
    df["hour_cos"] = [np.cos(x * (2 * np.pi / 24)) for x in df["hour"]]
    df["hour_sin"] = [np.sin(x * (2 * np.pi / 24)) for x in df["hour"]]
    df = df.drop(columns=["hour"])
    df = scaler.transform(df)
    x = np.array(df)
    x = np.reshape(x, (1, 24, 3))

    prediction = model.predict(x)
    response = np.zeros((1, 3), dtype=float)
    response[0][0] = prediction[0][0]
    response = scaler.inverse_transform(response)[:, [0]]
    print("Current response is ", response)

    return response.tolist()


@app.route("/predict", methods=["POST"])
def predict():
    request_data = request.json
    inference = perform_inference(request_data)

    return jsonify(inference)

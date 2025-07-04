import numpy as np
import joblib
from keras.models import load_model

model = load_model("model/model_ann.h5")
scaler = joblib.load("model/scaler.pkl")

def predict_status(data):
    try:
        features = np.array([[float(data['ph']), float(data['suhu']), float(data['amonia'])]])
        scaled = scaler.transform(features)
        result = model.predict(scaled)
        label_map = {0: "Bahaya", 1: "Waspada", 2: "Normal"}
        return label_map[np.argmax(result)]
    except Exception as e:
        return f"Error: {str(e)}"

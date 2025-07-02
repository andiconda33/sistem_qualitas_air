import numpy as np
from .load_model import get_model, get_scaler
from utils.preprocessing import normalize_data
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self): 
        self.model = get_model()
        self.scaler = get_scaler()
        self.label_map = {0: 'Normal', 1: 'Waspada', 2: 'Bahaya'}
    
    def preprocess_input(self, input_data):
        """Normalisasi input data"""
        try:
            # Konversi ke numpy array
            data = np.array([[
                float(input_data['pH']),
                float(input_data['temperature']),
                float(input_data['ammonia'])
            ]])
            
            # Normalisasi
            scaled_data = self.scaler.transform(data)
            return scaled_data
        except Exception as e:
            logger.error(f"Preprocessing error: {str(e)}")
            raise ValueError("Invalid input data format")

    def predict(self, input_data):
        """Lakukan prediksi"""
        try:
            # Preprocessing
            processed_data = self.preprocess_input(input_data)
            
            # Prediksi
            prediction = self.model.predict(processed_data)
            predicted_class = np.argmax(prediction, axis=1)[0]
            confidence = np.max(prediction) * 100
            
            return {
                'status': 'success',
                'prediction': self.label_map[predicted_class],
                'confidence': f"{confidence:.2f}%",
                'raw_prediction': prediction.tolist()
            }
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }

# Singleton instance
prediction_service = PredictionService()

def predict_water_quality(input_data):
    """Fungsi utama untuk prediksi dari API"""
    return prediction_service.predict(input_data)
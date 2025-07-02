import tensorflow as tf
import numpy as np
from utils.preprocessing import normalize_data
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelLoader:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance.init_model()
        return cls._instance
    
    def init_model(self):
        """Load model saat pertama kali inisialisasi"""
        try:
            self.model = tf.keras.models.load_model('models/ann_best_model.h5')
            logger.info("Model loaded successfully")
            
            # Contoh data untuk init scaler
            dummy_data = np.array([[7.0, 25.0, 0.05]])
            self.scaler = normalize_data(dummy_data, return_scaler=True)
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise

def get_model():
    """Factory function untuk mendapatkan model"""
    return ModelLoader().model

def get_scaler():
    """Factory function untuk mendapatkan scaler"""
    return ModelLoader().scaler
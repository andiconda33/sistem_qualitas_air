import os
from pathlib import Path

BASE_DIR = Path(__file__).parent

class Config:
    DEBUG = True
    HOST = '0.0.0.0'
    PORT = 5000
    MODEL_PATH = os.path.join(BASE_DIR, 'models/ann_water_model.h5')
    
    # Threshold parameter berdasarkan dataset
    PH_RANGE = (6.0, 9.0)
    TEMP_RANGE = (20.0, 35.0)
    AMMONIA_RANGE = (0.0, 0.1)
    
    # Logging
    LOG_FILE = 'water_quality.log'
    LOG_LEVEL = 'INFO'
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from app import routes

# Kosongkan atau hanya inisialisasi package
# Tidak perlu import get_model/get_scaler kalau tidak digunakan

# app/__init__.py
# optional: print("App package loaded")

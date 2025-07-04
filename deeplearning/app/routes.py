from flask import Blueprint, request, jsonify
from app.model_handler import predict_status
from app.db_handler import insert_sensor_data, get_latest_sensor_data

# Inisialisasi blueprint
bp = Blueprint('routes', __name__)

# ===============================
# POST /api/predict
# Kirim input dari frontend, dapatkan status hasil prediksi ANN
# ===============================
@bp.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not all(k in data for k in ("ph", "suhu", "amonia")):
            return jsonify({"error": "Input tidak lengkap. Butuh ph, suhu, amonia"}), 400

        status = predict_status(data)
        return jsonify({
            "status": status,
            "input": data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===============================
# POST /api/sensor
# Digunakan ESP32 kirim data → disimpan + prediksi
# ===============================
@bp.route('/api/sensor', methods=['POST'])
def sensor_input():
    try:
        data = request.get_json()
        if not all(k in data for k in ("ph", "suhu", "amonia")):
            return jsonify({"error": "Data tidak lengkap"}), 400

        status = predict_status(data)
        insert_sensor_data(data, status)

        return jsonify({
            "message": "Data berhasil disimpan",
            "status": status
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ===============================
# GET /api/live
# Diakses frontend → ambil data sensor terbaru
# ===============================
@bp.route('/api/live', methods=['GET'])
def live_data():
    try:
        latest = get_latest_sensor_data()
        if latest:
            return jsonify(latest)
        else:
            return jsonify({"message": "Belum ada data"}), 204
    except Exception as e:
        return jsonify({"error": str(e)}), 500

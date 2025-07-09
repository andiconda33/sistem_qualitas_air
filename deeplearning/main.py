from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Mengizinkan komunikasi dari frontend React (berbeda domain/port)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()  # Menerima data JSON dari frontend React
    pH = data.get('pH')
    temperature = data.get('temperature')
    ammonia = data.get('ammonia')

    # logika prediksi, ganti dengan model deep learning Anda
    if pH > 7 and temperature < 25 and ammonia < 0.5:
        status = 'Normal'
    elif pH < 7 or ammonia > 1:
        status = 'Bahaya'
    else:
        status = 'Waspada'

    return jsonify({"status": status})

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Menjalankan Flask di port 5000

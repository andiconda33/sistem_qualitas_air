# Sistem Pemantauan Kualitas Air Berbasis IoT untuk Budidaya Ikan

Sistem ini merupakan solusi pemantauan kualitas air secara real-time menggunakan perangkat IoT dan kecerdasan buatan (AI) untuk mendukung budidaya ikan yang sehat dan efisien.

## Fitur Utama

- **Pemantauan Sensor**: Mengukur suhu air, pH, dan kualitas udara (amonia) secara otomatis.
- **Tampilan LCD**: Menampilkan data sensor secara langsung pada perangkat.
- **Pengiriman Data**: Data sensor dapat dikirim ke backend untuk analisis lebih lanjut.
- **Prediksi AI**: Backend menggunakan model deep learning untuk memprediksi kualitas air dan memberikan rekomendasi.
- **Antarmuka Web**: Frontend untuk visualisasi data dan hasil prediksi.

## Struktur Proyek

## Cara Kerja Sistem

1. **Perangkat IoT** (ESP32) membaca data dari sensor suhu (DS18B20), sensor pH, dan sensor kualitas udara (MQ135).
2. Data ditampilkan pada LCD dan dikirim ke backend (opsional, jika terhubung).
3. **Backend** menerima data, melakukan preprocessing, dan memprediksi kualitas air menggunakan model AI.
4. **Frontend** menampilkan data sensor dan hasil prediksi secara real-time.

## Instalasi & Penggunaan

### 1. Perangkat IoT (ESP32)

- Upload kode dari [`iot/src/ujisemuasensor.cpp`](iot/src/ujisemuasensor.cpp) ke ESP32 menggunakan PlatformIO atau Arduino IDE.
- Pastikan sensor terhubung sesuai pin yang ada di kode.

### 2. Backend (Flask API)

- Masuk ke folder `deeplearning/`
- Install dependensi:
  ```sh
  pip install -r requirements.txt
  ```

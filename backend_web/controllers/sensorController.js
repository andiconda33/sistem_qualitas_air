// controllers/sensorController.js
const db = require('../db');

// Ambil semua data sensor (opsional: filter/urutkan di sini)
const getAllSensorData = (req, res) => {
  const sql = 'SELECT * FROM sensor_data ORDER BY waktu DESC'; // Urutkan berdasarkan waktu terbaru
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Gagal ambil data sensor:', err);
      return res.status(500).json({ error: 'Gagal ambil data sensor' });
    }
    res.json(results);
  });
};

// Simpan data sensor baru
const addSensorData = (req, res) => {
  const { suhu, ph, amonia } = req.body;

  if (!suhu || !ph || !amonia) {
    return res.status(400).json({ error: 'Semua data wajib diisi' });
  }

  const sql = 'INSERT INTO sensor_data (suhu, ph, amonia) VALUES (?, ?, ?)';
  db.query(sql, [suhu, ph, amonia], (err, result) => {
    if (err) {
      console.error('❌ Gagal simpan data sensor:', err);
      return res.status(500).json({ error: 'Gagal simpan data' });
    }
    res.status(201).json({ message: 'Data sensor berhasil ditambahkan', id: result.insertId });
  });
};

module.exports = {
  getAllSensorData,
  addSensorData,
};

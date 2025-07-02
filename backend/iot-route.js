const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 2518;

// ===== Middleware =====
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false }));

// ===== Koneksi MySQL =====
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DB_AIR'
});

// API TABEL DATA_SENSOR
// ===== ROUTE: GET kirim via URL-encoded =====
// contoh: GET /api/data-sensor/send?id_sensor=1&temperature=24.5&humidity=60&moisture=30&light=500
app.get('/api/data-sensor/send', (req, res) => {
  const { id_sensor, temperature, amonia, ph} = req.query;

  if ( !id_sensor || !temperature  || !amonia || !ph) {
    return res.status(400).send('Semua parameter (id_sensor, temperature, amonia, ph) wajib diisi.');
  }

  const sql = `
    INSERT INTO DATA_SENSOR (id_sensor, temperature, amonia, ph) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [id_sensor, temperature, amonia, ph], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal menyimpan data.');
    }
    console.log(`Data berhasil disimpan (GET): id_sensor=${id_sensor}, temperature=${temperature}, amonia=${amonia}, ph=${ph}`);
    res.send(`Data diterima via GET: 
      id_sensor=${id_sensor},
      temperature=${temperature}, 
      amonia=${amonia}, 
      ph=${ph}`);
  });
});
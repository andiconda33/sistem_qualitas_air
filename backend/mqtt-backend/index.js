// =======================
// IMPORT PACKAGE
// =======================
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mqtt = require('mqtt');
const db = require('./db'); // <- koneksi DB dipisah di db.js

// =======================
// INISIALISASI APP
// =======================
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// =======================
// KONEKSI KE MQTT BROKER
// =======================
const mqttClient = mqtt.connect('mqtt://localhost'); // atau broker lain

mqttClient.on('connect', () => {
  console.log('📡 Terhubung ke MQTT broker');
  mqttClient.subscribe('sensor/data', (err) => {
    if (err) console.error('❌ Gagal subscribe:', err);
    else console.log('📥 Subscribed ke topic sensor/data');
  });
});

mqttClient.on('message', (topic, message) => {
  if (topic === 'sensor/data') {
    try {
      const { suhu, ph, amonia } = JSON.parse(message.toString());
      const sql = 'INSERT INTO sensor_data (suhu, ph, amonia) VALUES (?, ?, ?)';
      db.query(sql, [suhu, ph, amonia], (err) => {
        if (err) console.error('❌ Gagal simpan data MQTT:', err);
        else console.log(`✅ MQTT ➜ Data disimpan: suhu=${suhu}, ph=${ph}, amonia=${amonia}`);
      });
    } catch (e) {
      console.error('❌ Format JSON tidak valid:', e);
    }
  }
});

// =======================
// API ROUTES
// =======================

// GET semua data sensor
app.get('/api/sensor', (req, res) => {
  db.query('SELECT * FROM sensor_data ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST data manual
app.post('/api/sensor', (req, res) => {
  const { suhu, ph, amonia } = req.body;
  if (!suhu || !ph || !amonia) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }
  const sql = 'INSERT INTO sensor_data (suhu, ph, amonia) VALUES (?, ?, ?)';
  db.query(sql, [suhu, ph, amonia], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Data ditambahkan', id: result.insertId });
  });
});

// UPDATE data sensor
app.put('/api/sensor/:id', (req, res) => {
  const { id } = req.params;
  const { suhu, ph, amonia } = req.body;
  if (!suhu || !ph || !amonia) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }
  const sql = 'UPDATE sensor_data SET suhu = ?, ph = ?, amonia = ? WHERE id = ?';
  db.query(sql, [suhu, ph, amonia, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Data diupdate', affectedRows: result.affectedRows });
  });
});

// DELETE data sensor
app.delete('/api/sensor/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM sensor_data WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Data dihapus', affectedRows: result.affectedRows });
  });
});

// LOGIN endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username & password wajib' });
  }

  const sql = 'SELECT * FROM user WHERE username = ? LIMIT 1'; // bisa diganti ke 'admin' jika hanya admin
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(401).json({ error: 'Akun tidak ditemukan' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Password salah' });

    res.json({ message: 'Login berhasil', user: { id: user.id, username: user.username } });
  });
});

// REGISTER endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  try {
    // Cek apakah username atau email sudah terdaftar
    db.query(
      'SELECT * FROM user WHERE username = ? OR email = ?',
      [username, email],
      async (err, results) => {
        if (err) {
          console.error('❌ Error saat cek user:', err);
          return res.status(500).json({ error: 'Terjadi kesalahan saat memeriksa data pengguna' });
        }

        if (results.length > 0) {
          return res.status(409).json({ error: 'Username atau email sudah digunakan' });
        }

        try {
          const hashedPassword = await bcrypt.hash(password, 10);

          db.query(
            'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            (err, result) => {
              if (err) {
                console.error('❌ Gagal menyimpan user baru:', err);
                return res.status(500).json({ error: 'Gagal menyimpan pengguna baru' });
              }

              res.status(201).json({ message: 'Registrasi berhasil', id: result.insertId });
            }
          );
        } catch (hashErr) {
          console.error('❌ Gagal hashing password:', hashErr);
          res.status(500).json({ error: 'Terjadi kesalahan saat mengenkripsi password' });
        }
      }
    );
  } catch (e) {
    console.error('❌ Error tak terduga:', e);
    res.status(500).json({ error: 'Terjadi kesalahan tak terduga' });
  }
});

// =======================
// JALANKAN SERVER
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Backend berjalan di http://localhost:${PORT}`);
});

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


// API TABEL PENGGUNA
// Endpoint signup (GET):
// Contoh: 
// http://localhost:2518/api/signup?username=namauser&password=katakunci

  app.get('/api/signup', (req, res) => {
    const { username, password } = req.query;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi.' });
    }

    // Cek apakah username sudah ada
    db.query(
      'SELECT id_pengguna FROM PENGGUNA WHERE username = ?',
      [username],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Terjadi kesalahan server.' });
        }
        if (results.length > 0) {
          return res.status(409).json({ message: 'Username sudah terdaftar.' });
        }

        // Simpan user baru
        db.query(
          'INSERT INTO PENGGUNA (username, password) VALUES (?, ?)',
          [username, password],
          (err2, result) => {
            if (err2) {
              console.error(err2);
              return res.status(500).json({ message: 'Gagal mendaftar.' });
            }
            res.status(201).json({ message: 'Pendaftaran berhasil.' });
          }
        );
      }
    );
  });

  

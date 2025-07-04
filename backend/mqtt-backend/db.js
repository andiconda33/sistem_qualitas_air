// db.js
const mysql = require('mysql2');
console.log('📦 db.js dimuat...');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sensor_db' // Pastikan ini sesuai
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal koneksi ke DB:', err.message);
  } else {
    console.log('✅ Terhubung ke MySQL');
  }
});

module.exports = db;

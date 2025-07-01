// tes-mysql.js
const mysql = require('mysql2');

// Konfigurasi koneksi ke database MySQL
const db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'sensor_data_iot',
	
}).promise();

async function testDatabase() {
	try {
		// const [now] = await db.query('SELECT NOW() AS now');
		// console.log('Current time form database:', now[0].now);

		const [rows] = await db.query('SELECT * FROM sensor_data ORDER BY timestamp DESC');
		console.log('Recent sensor data:', rows);
	} catch (err) {
		console.log('Database error:', err);
	}
}

testDatabase();
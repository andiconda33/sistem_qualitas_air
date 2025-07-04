// ===== IMPORT MODULE =====
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const mysql = require('mysql2');

// ===== KONEKSI DATABASE =====
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DB_AIR',
}).promise();

// ===== INISIALISASI APP =====
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// ===== KONFIGURASI MQTT =====
const mqttOptions = { reconnectPeriod: 1000 };
const broker = 'mqtt://broker.emqx.io';
const topicSensor = 'sensor/data/345267189287';
const mqttClient = mqtt.connect(broker, mqttOptions);

let lastSensorData = null;

// ===== MIDDLEWARE =====
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== ROUTING =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'data.html'));
});

app.get('/test', (req, res) => {
    res.json({ message: 'Test route works!' });
});

// ===== API: Ambil data terbaru =====
app.get('/api/sensor-data', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM data_sensor ORDER BY created_at DESC LIMIT 10');
        res.json(rows);
    } catch (err) {
        console.log('Database error:', err);
        res.status(500).send('Internal Server Error');
    }
});

// ===== SOCKET.IO =====
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('sensorData', {
        data: lastSensorData,
        timestamp: new Date().toISOString(),
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// ===== MQTT HANDLER =====
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(topicSensor, (err) => {
        if (err) {
            console.error('Subscription error:', err);
        } else {
            console.log(`Subscribed to ${topicSensor}`);
        }
    });
});

mqttClient.on('message', async (topic, message) => {
    if (topic === topicSensor) {
        const msgString = message.toString();
        console.log('Received MQTT message:', msgString);

        try {
            const parsed = JSON.parse(msgString);

            const { sensor_id, temperature, amonia, ph } = parsed;

            // Validasi
            if (!sensor_id || isNaN(temperature) || isNaN(amonia) || isNaN(ph)) {
                console.log('Data tidak valid, skip insert.');
                return;
            }

            // Simpan ke DB
            await db.query(
                'INSERT INTO sensor_data (sensor_id, temperature, amonia, ph) VALUES (?, ?, ?, ?)',
                [sensor_id, temperature, amonia, ph]
            );

            console.log('Data berhasil disimpan ke DB.');

            // Kirim ke client via Socket.IO
            lastSensorData = parsed;
            io.emit('sensorData', {
                data: parsed,
                timestamp: new Date().toISOString(),
            });

        } catch (err) {
            console.log('Gagal parsing JSON MQTT:', err);
        }
    }
});

// ===== ROUTE: Terima Data dari IoT (POST) =====
// app.post('/api/data-sensor', async (req, res) => {
//     const { sensor_id, temperature, amonia, ph } = req.body;
  
//     // Validasi input
//     if (!sensor_id || temperature == null || amonia == null || ph == null) {
//       return res.status(400).json({ message: 'Semua data wajib diisi.' });
//     }
  
//     try {
//       // Simpan ke database
//       await db.query(
//         'INSERT INTO data_sensor (sensor_id, temperature, amonia, ph) VALUES (?, ?, ?, ?)',
//         [sensor_id, temperature, amonia, ph]
//       );
  
//       res.status(201).json({ message: 'Data berhasil disimpan' });
//     } catch (err) {
//       console.error('Database error:', err.message);
//       res.status(500).json({ message: 'Gagal menyimpan data' });
//     }
//   });
  

// MQTT status logs
mqttClient.on('reconnect', () => {
    console.log('Reconnecting to MQTT broker...');
});
mqttClient.on('offline', () => {
    console.log('MQTT client offline');
});
mqttClient.on('error', (err) => {
    console.log('MQTT error:', err);
});

// ===== JALANKAN SERVER =====
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});

 // Require Express

const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const mysql = require('mysql2');
const { timeStamp } = require('console');

let lastSensorData = null;

const app = express();
const server = http.createServer(app);
const io = socketIo(server)

// Require MQTT
const mqttOptions = { reconnectPeriod: 1000 };
const broker = 'mqtt://broker.emqx.io';
const topicSensor = 'sensor/data/345267189287'
const mqttClient = mqtt.connect(broker, mqttOptions);


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'data.html'));
});

// Rute API
app.get('/api/sensor-data', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 10');
        res.json(rows);
	} catch (err) {
		console.log('Database error:', err);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/test', (req, res) => {
    res.json({message: 'Test route works!'});
});

// Konfigurasi SOcket.io
io.on('connection', (socket) => {
    console.log('New client connected');

    // socket.emit('message', 'Welcome to the Socket.IO server!');

    io.emit('sensorData', JSON.stringify({
        data: lastSensorData,
        timestamp: new Date().toISOString(),
    }));
    

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Konfigurasi MQTT
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
	if (topic === topicSensor){
		const newSensorData = message.toString();

       lastSensorData = newSensorData;

        io.emit('sensorData', JSON.stringify({
            data: newSensorData,
            timestamp: new Date().toISOString(),
        }));

        // io.emit('message', newSensorData);
		console.log('Received:', newSensorData);

        // Simpan Data Sensor ke database
        try {
            await db.query('INSERT INTO sensor_data (data) VALUES (?)', [newSensorData]);
            console.log('Data saved to database');
        } catch (err) {
            console.log('Database error:', err);
        }
	}
});

mqttClient.on('reconnect', () => {
	console.log('Reconnecting to MQTT broker....');
});

mqttClient.on('offline', () => {
	console.log('MQTT client offline');
});

mqttClient.on('error', (err) => {
	console.log('MQTT error:', err);
});

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

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});
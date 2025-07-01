// tes-express.js

const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server)

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/test', (req, res) => {
	res.json({message: 'Test route works!'});
});

io.on('connection', (socket) => {
	console.log('New client connected');

	socket.emit('message', 'Welcome to the Socket.IO server!');

	socket.on('disconnect', () => {
		console.log('Client disconnected');
    });
});

const PORT = 8080;
server.listen(PORT, () => {
	console.log(`Express server running on port ${PORT}`);
});
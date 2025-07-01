// tes-socket.js

const http = require('http');
const socket = require('socket.io');
const server = http.createServer();
const io = socket(server)

io.on('connection', (socket) => {
	console.log('New client connected');

	socket.emit('message', 'Welcome to the Socket.IO server!');

	socket.on('disconnect', () => {
		console.log('Client disconnected');
});
});

const PORT = 8080;
server.listen(PORT, () => {
	console.log(`Socket.io server running on port ${PORT}`);
});
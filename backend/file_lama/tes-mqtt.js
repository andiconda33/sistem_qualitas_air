const mqtt = require('mqtt');
const mqttOptions = { reconnectPeriod: 1000 };
const broker = 'mqtt://broker.emqx.io';
const topicSensor = 'sensor/data/345267189287'


const mqttClient = mqtt.connect(broker, mqttOptions);

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

mqttClient.on('message', (topic, message) => {
	if (topic === topicSensor){
		const newSensorData = message.toString();
		console.log('Received:', newSensorData);
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
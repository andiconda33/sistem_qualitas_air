// routers/sensor.js
const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');

router.get('/', sensorController.getAllSensorData);    // GET semua data sensor
router.post('/', sensorController.addSensorData);      // POST data sensor baru

module.exports = router;

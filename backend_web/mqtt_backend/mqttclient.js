console.log('✅ mqttclient.js aktif...');

const mqtt = require('mqtt');
const db = require('./db');

const brokerUrl = 'mqtt://test.mosquitto.org';
const topic = 'sensor/data/lele';

const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('🟢 MQTT Connected');

  client.subscribe(topic, (err) => {
    if (err) {
      console.error('❌ Gagal subscribe:', err.message);
    } else {
      console.log(`📡 Subscribed ke topik: ${topic}`);
    }
  });
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log(`📩 Pesan dari [${topic}]:`, data);

    const { ph, suhu, amonia } = data;

    if (ph !== undefined && suhu !== undefined && amonia !== undefined) {
      console.log('➡️ Siap menyimpan ke DB...');
      const sql = 'INSERT INTO sensor_data (ph, suhu, amonia) VALUES (?, ?, ?)';
      console.log('➡️ Query:', sql);
      console.log('➡️ Values:', [ph, suhu, amonia]);

      db.query(sql, [ph, suhu, amonia], (err, result) => {
        if (err) {
          console.error('❌ Gagal simpan ke DB:', err.message);
        } else {
          console.log(`💾 Data berhasil disimpan ke DB (ID: ${result.insertId})`);
        }
      });
    } else {
      console.warn('⚠️ Data tidak lengkap, tidak disimpan:', data);
    }
  } catch (err) {
    console.error('❌ Gagal parsing pesan:', err.message);
  }
});

#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <PubSubClient.h>

// --- Konfigurasi WiFi dan MQTT ---
const char* ssid = "AndiHome";
const char* password = "12345678";
const char* mqtt_server = "broker.emqx.io";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;

// --- Inisialisasi DS18B20 ---
#define ONE_WIRE_BUS 5
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensorDallas(&oneWire);

// --- Inisialisasi MQ135 ---
#define MQ135_PIN 35  // Pin analog

// --- Inisialisasi sensor pH ---
#define PH_SENSOR_PIN 34
float calibration_value = 22.84; // Sudah ditambahkan +1.5
int buffer_arr[10];
float ph_act;

// --- Inisialisasi lcdTampil ---
LiquidCrystal_I2C lcdTampil(0x27, 16, 2);  // Ubah alamat jika perlu

// --- Fungsi koneksi WiFi ---
void setup_wifi() {
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

// --- Callback saat menerima pesan MQTT ---
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

// --- Reconnect MQTT jika terputus ---
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "IoT-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.publish("upb/data/345267189287", "Connected");
      client.subscribe("upb/data/345267189287");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

// --- Setup awal ---
void setup() {
  Serial.begin(115200);
  sensorDallas.begin();
  lcdTampil.init();
  lcdTampil.backlight();

  lcdTampil.setCursor(0, 0);
  lcdTampil.print("Suhu AQ pH Ready");
  delay(2000);
  lcdTampil.clear();

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);  
}

// --- Loop utama ---
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // mengatur data setiap detik
  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;

    // --- Baca suhu ---
    sensorDallas.requestTemperatures();
    float tempC = sensorDallas.getTempCByIndex(0);

    // --- Baca kualitas udara dari MQ135 ---
    int mq135Value = analogRead(MQ135_PIN);

    // --- Baca pH sensor ---
    for (int i = 0; i < 10; i++) {
      buffer_arr[i] = analogRead(PH_SENSOR_PIN);
      delay(30);
    }

    // Urutkan data
    for (int i = 0; i < 9; i++) {
      for (int j = i + 1; j < 10; j++) {
        if (buffer_arr[i] > buffer_arr[j]) {
          int temp = buffer_arr[i];
          buffer_arr[i] = buffer_arr[j];
          buffer_arr[j] = temp;
        }
      }
    }

    // Hitung rata-rata nilai tengah
    unsigned long avgval = 0;
    for (int i = 2; i < 8; i++) avgval += buffer_arr[i];

    float volt = (float)avgval * 3.3 / 4095.0 / 6.0;
    ph_act = -5.70 * volt + calibration_value;

    // --- Tampilkan di Serial Monitor ---
    Serial.print("Temp: ");
    Serial.print(tempC);
    Serial.println(" *C");

    Serial.print("MQ135: ");
    Serial.println(mq135Value);

    Serial.print("pH: ");
    Serial.println(ph_act, 2);

    // --- Tampilkan di lcdTampil ---
    lcdTampil.clear();
    lcdTampil.setCursor(0, 0);
    lcdTampil.print("T:");
    lcdTampil.print(tempC, 1);
    lcdTampil.print((char)223); // simbol derajat
    lcdTampil.print(" AQ:");
    lcdTampil.print(mq135Value);

    lcdTampil.setCursor(0, 1);
    lcdTampil.print("pH: ");
    lcdTampil.print(ph_act, 2);

    // --- Kirim data ke MQTT ---
String tempStr = String(tempC, 2);
String phStr = String(ph_act, 2);
String aqStr = String(mq135Value); // nilai integer, tidak perlu desimal

client.publish("upb/data/345267189287/temp", tempStr.c_str(), true);
client.publish("upb/data/345267189287/ph", phStr.c_str(), true);
client.publish("upb/data/345267189287/aq", aqStr.c_str(), true);

  }
}

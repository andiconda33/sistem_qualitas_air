#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Pin untuk DS18B20
#define ONE_WIRE_BUS 5

// Pin analog untuk MQ135
#define MQ135_PIN 4  // Gunakan pin analog pada ESP32

// Instance untuk DS18B20
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// Instance untuk LCD I2C
LiquidCrystal_I2C lcd(0x27, 16, 2); // Ubah alamat jika diperlukan

void setup() {
  Serial.begin(115200);
  sensors.begin();
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("Temp & Air Qual");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");
  delay(2000);
  lcd.clear();
}

void loop() {
  // --- Baca suhu dari DS18B20 ---
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  // --- Baca kualitas udara dari MQ135 ---
  int mq135Value = analogRead(MQ135_PIN);  // Nilai dari 0 - 4095 (untuk ESP32)

  // --- Tampilkan di Serial Monitor ---
  Serial.print("Temperature: ");
  Serial.print(tempC);
  Serial.println(" *C");

  Serial.print("MQ135 Analog: ");
  Serial.println(mq135Value);

  // --- Tampilkan di LCD ---
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(tempC, 1); // 1 digit di belakang koma
  lcd.print((char)223); // Simbol derajat
  lcd.print("C  ");

  lcd.setCursor(0, 1);
  lcd.print("AQ:");
  lcd.print(mq135Value);
  lcd.print("   "); // Membersihkan sisa karakter lama

  delay(1000);
}

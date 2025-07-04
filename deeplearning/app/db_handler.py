import mysql.connector
from datetime import datetime

# TODO: Ganti dengan kredensial database Anda
DB_CONFIG = {
    'user': 'root',
    'password': '',
    'host': '127.0.0.1',
    'database': 'sensor_data'
}

def insert_sensor_data(data, status):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    # Membuat tabel jika belum ada
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS data_olah (
            id INT AUTO_INCREMENT PRIMARY KEY,
            pH DECIMAL(10, 2),
            temperature DECIMAL(10, 2),
            ammonia DECIMAL(10, 2),
            status VARCHAR(255),
            timestamp DATETIME
        )
    """)

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Memasukkan data baru
    cursor.execute("""
        INSERT INTO data_olah (pH, temperature, ammonia, status, timestamp)
        VALUES (%s, %s, %s, %s, %s)
    """, (data["ph"], data["suhu"], data["amonia"], status, timestamp))
    
    conn.commit()
    cursor.close()
    conn.close()

def get_latest_sensor_data():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Mengambil data terbaru
        cursor.execute("SELECT * FROM data_olah ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
    except mysql.connector.errors.ProgrammingError as e:
        if e.errno == 1146:  # Tabel tidak ada
            row = None
        else:
            raise
            
    cursor.close()
    conn.close()
    
    return row if row else {}

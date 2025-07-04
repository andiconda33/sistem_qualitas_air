import 
from datetime import datetime

DB_PATH = "database/sipeka.db"

def insert_sensor_data(data, status):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ph REAL,
            suhu REAL,
            amonia REAL,
            status TEXT,
            timestamp TEXT
        )
    """)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
        INSERT INTO sensor_data (ph, suhu, amonia, status, timestamp)
        VALUES (?, ?, ?, ?, ?)
    """, (data["ph"], data["suhu"], data["amonia"], status, timestamp))
    conn.commit()
    conn.close()

def get_latest_sensor_data():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT ph, suhu, amonia, status, timestamp FROM sensor_data ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return {
            "ph": row[0],
            "suhu": row[1],
            "amonia": row[2],
            "status": row[3],
            "timestamp": row[4]
        }
    else:
        return {}

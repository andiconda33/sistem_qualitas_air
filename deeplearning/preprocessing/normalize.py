import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split

# Load data
data = pd.read_csv('Data Sensor Tanpa Label.csv')

# Konversi timestamp ke fitur numerik
data['date'] = pd.to_datetime(data['date'])
data['hour'] = data['date'].dt.hour
data['day_of_week'] = data['date'].dt.dayofweek
data['day_of_month'] = data['date'].dt.day

# Drop kolom date asli
data = data.drop(columns=['date'])

# Normalisasi data
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(data)

# Pisahkan fitur dan target (contoh: prediksi ammonia)
X = scaled_data[:, :-1]  # Semua kolom kecuali ammonia
y = scaled_data[:, -1]   # Kolom ammonia

# Split data training dan testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
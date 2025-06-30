import tensorflow as tf
import pandas as pd
import numpy as np
from utils.metrics import evaluate_model, plot_confusion_matrix
from utils.preprocessing import preprocess_input_data
import matplotlib.pyplot as plt

def evaluate_saved_model():
    # 1. Load data test
    test_df = pd.read_csv(r"C:\Users\NITRO\Python\deeplearning\data\split\Data Sensor _test.csv")
    X_test = test_df[['pH', 'temperature', 'ammonia']].values
    y_test = test_df['Label'].values
    
    # 2. Preprocessing
    X_test_scaled, y_test_encoded, label_map = preprocess_input_data(X_test, y_test)
    
    # 3. Load model terbaik
    model = tf.keras.models.load_model('models/best_model.h5')
    
    # 4. Evaluasi
    print("\n=== Evaluasi Model ===")
    label_names = list(label_map.keys())
    evaluate_model(model, X_test_scaled, y_test_encoded, label_names)
    
    # 5. Visualisasi tambahan
    y_pred = model.predict(X_test_scaled)
    y_true = np.argmax(y_test_encoded, axis=1)
    y_pred_classes = np.argmax(y_pred, axis=1)
    
    # Plot distribusi prediksi
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.hist(y_true, bins=3, alpha=0.5, label='Actual')
    plt.hist(y_pred_classes, bins=3, alpha=0.5, label='Predicted')
    plt.xticks([0, 1, 2], label_names)
    plt.title('Distribusi Prediksi vs Aktual')
    plt.legend()
    
    # Plot contoh prediksi salah
    wrong_preds = np.where(y_true != y_pred_classes)[0]
    if len(wrong_preds) > 0:
        sample_idx = np.random.choice(wrong_preds, min(3, len(wrong_preds)), replace=False)
        plt.subplot(1, 2, 2)
        for i, idx in enumerate(sample_idx):
            plt.scatter(X_test[idx, 0], X_test[idx, 1], 
                        label=f'True: {label_names[y_true[idx]]}\nPred: {label_names[y_pred_classes[idx]]}')
        plt.xlabel('pH')
        plt.ylabel('Temperature')
        plt.title('Contoh Prediksi Salah')
        plt.legend()
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    evaluate_saved_model()
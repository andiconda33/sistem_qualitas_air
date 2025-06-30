import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report
)

def evaluate_model(model, X_test: np.ndarray, y_test: np.ndarray, label_names: list = None) -> None:
    """Evaluasi model dan tampilkan metrik utama.
    
    Args:
        model: Model yang telah dilatih.
        X_test (np.ndarray): Data fitur untuk pengujian.
        y_test (np.ndarray): Data label yang benar untuk pengujian.
        label_names (list, optional): Daftar nama label untuk klasifikasi. Defaults to None.
    """
    # Prediksi
    y_pred = model.predict(X_test)
    y_pred_classes = np.argmax(y_pred, axis=1)
    y_true = np.argmax(y_test, axis=1)
    
    # Hitung akurasi
    accuracy = accuracy_score(y_true, y_pred_classes)
    print(f"\nAccuracy: {accuracy:.4f}")
    
    # Classification report
    print("\nClassification Report:")
    print(classification_report(
        y_true, y_pred_classes, 
        target_names=label_names if label_names else None
    ))
    
    # Confusion matrix
    plot_confusion_matrix(y_true, y_pred_classes, label_names)

def plot_confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray, class_names: list = None) -> None:
    """Visualisasi confusion matrix.
    
    Args:
        y_true (np.ndarray): Data label yang benar.
        y_pred (np.ndarray): Data label yang diprediksi.
        class_names (list, optional): Daftar nama kelas untuk label. Defaults to None.
    """
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=class_names,
                yticklabels=class_names)
    plt.title('Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.show()

def plot_predictions_sample(X_test: np.ndarray, y_true: np.ndarray, y_pred: np.ndarray, samples: int = 5) -> None:
    """Tampilkan sampel prediksi dengan label benar/salah.
    
    Args:
        X_test (np.ndarray): Data fitur untuk pengujian.
        y_true (np.ndarray): Data label yang benar untuk pengujian.
        y_pred (np.ndarray): Data label yang diprediksi.
        samples (int, optional): Jumlah sampel yang akan ditampilkan. Defaults to 5.
    """
    y_true_classes = np.argmax(y_true, axis=1)
    y_pred_classes = np.argmax(y_pred, axis=1)
    
    plt.figure(figsize=(15, 3))
    for i in range(samples):
        idx = np.random.randint(0, len(X_test))
        is_correct = y_true_classes[idx] == y_pred_classes[idx]
        
        plt.subplot(1, samples, i + 1)
        plt.imshow(X_test[idx].reshape(28, 28), cmap='gray')  # Adjust shape if necessary
        plt.title(f"True: {y_true_classes[idx]}\nPred: {y_pred_classes[idx]}", 
                  color='green' if is_correct else 'red')
        plt.axis('off')
    plt.tight_layout()
    plt.show()

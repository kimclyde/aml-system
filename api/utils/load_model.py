import joblib
import os

def load_trained_model():
    # Build an absolute path to the model
    base_dir = os.path.dirname(os.path.abspath(__file__))  # <--- path of load_model.py
    model_path = os.path.join(base_dir, '..', 'models', 'best_random_forest_model.joblib')

    try:
        model = joblib.load(model_path)
        print("Model loaded successfully!")
        return model
    except FileNotFoundError:
        print(f"Model file not found at {model_path}")
        return None
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

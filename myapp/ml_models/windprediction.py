import pandas as pd
import pickle
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, 'myapp', 'ml_models', 'pipewin.pkl')

model = pickle.load(open(MODEL_PATH, 'rb'))

def pred_win(features):
    try:
        df = pd.DataFrame([features])
        prediction = model.predict(df)
        return prediction
    except Exception as e:
        print(f"Error predicting win: {str(e)}")
        return [0]  # fallback prediction
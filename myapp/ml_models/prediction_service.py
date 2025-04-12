# prediction_service.py
import pickle
import pandas as pd

model = pickle.load(open('myapp\ml_models\pipe.pkl', 'rb'))
def predict_score(features):
    return model.predict(pd.DataFrame([features]))

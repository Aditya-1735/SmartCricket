# prediction_service.py
import pickle
import pandas as pd
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, 'myapp', 'ml_models', 'pipe.pkl')

model = pickle.load(open(MODEL_PATH, 'rb'))

# Stadium to city mapping
STADIUM_TO_CITY = {
    'M.Chinnaswamy Stadium': 'Bangalore',
    'Wankhede Stadium': 'Mumbai',
    'MA Chidambaram Stadium': 'Chennai',
    'Eden Gardens': 'Kolkata',
    'Arun Jaitley Stadium': 'Delhi',
    'Punjab Cricket Association Stadium': 'Chandigarh',
    'Rajiv Gandhi International Stadium': 'Hyderabad',
    'Sawai Mansingh Stadium': 'Jaipur',
    'Narendra Modi Stadium': 'Ahmedabad',
    'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium': 'Lucknow',
    'Maharashtra Cricket Association Stadium': 'Pune',
    # Fallback for unknown stadiums
    'default': 'Mumbai'
}

def get_city_from_venue(venue):
    """Convert stadium name to corresponding city name"""
    # First try exact match
    if venue in STADIUM_TO_CITY:
        return STADIUM_TO_CITY[venue]
    
    # Try partial match
    for stadium, city in STADIUM_TO_CITY.items():
        if stadium.lower() in venue.lower():
            return city
            
    # Return default city if no match found
    return STADIUM_TO_CITY['default']

def predict_score(features):
    try:
        # Convert venue to city if needed
        if 'city' in features and features['city']:
            features['city'] = get_city_from_venue(features['city'])
            
        df = pd.DataFrame([features])
        prediction = model.predict(df)
        return prediction
    except Exception as e:
        print(f"Error predicting score: {str(e)}")
        return [0]  # fallback prediction

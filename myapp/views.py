from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import requests
from dotenv import load_dotenv
from myapp.ml_models.prediction_service import predict_score
from myapp.utils.commentary_generator import generate_commentary
from myapp.utils.fetch_match_id import get_ongoing_matches
load_dotenv()

# Basic template views
def Home(request):
    context={
        'title':'Welcome to Smart-cricket',
        'message':'This is dynamic message'
    }
    return render(request,'myapp/home.html',context)

def about(request):
    return render(request,'myapp/about.html')

# API configuration
api_key = os.getenv("API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Match data fetching views
@api_view(['GET'])
def get_matches(request):
    """Get all ongoing matches for a specific series or all series"""
    series_id = request.GET.get('series_id', "d5a498c8-7596-4b93-8ab0-e0efc3345312")
    try:
        matches = get_ongoing_matches(api_key, series_id=series_id)
        return Response({'matches': matches})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def fetch_live_score(request):
    """Fetch ball-by-ball details for a specific match"""
    match_id = request.GET.get('match_id')
    if not match_id:
        return Response({'error': 'match_id is required'}, status=400)
        
    url = f"https://api.cricapi.com/v1/match_bbb?apikey={api_key}&id={match_id}"
    response = requests.get(url)
    return Response(response.json())

@api_view(['GET'])
def fetch_match_details(request):
    """Fetch detailed information about a specific match"""
    match_id = request.GET.get('match_id')
    if not match_id:
        return Response({'error': 'match_id is required'}, status=400)
        
    url = f"https://api.cricapi.com/v1/match_info?apikey={api_key}&id={match_id}"
    response = requests.get(url)
    return Response(response.json())

# ML model integration views
@api_view(['POST'])
def predict_score_view(request):
    """Predict final score based on current match situation"""
    try:
        features = request.data
        prediction = predict_score(features)
        return Response({'predicted_score': prediction[0]})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def generate_commentary_view(request):
    """Generate AI commentary for a specific ball"""
    try:
        ball_data = {
            "ball_number": request.data.get("ball_number", "0.0"),
            "batsman": request.data.get("batsman", ""),
            "bowler": request.data.get("bowler", ""),
            "runs_scored": int(request.data.get("runs_scored", 0)),
            "extras": {
                "wides": int(request.data.get("wides", 0)),
                "no_balls": int(request.data.get("no_balls", 0)),
                "byes": int(request.data.get("byes", 0)),
                "leg_byes": int(request.data.get("leg_byes", 0))
            },
            "wicket": {"is_wicket": request.data.get("is_wicket", False)},
            "match_context": {
                "current_score": {
                    "runs": int(request.data.get("current_runs", 0)),
                    "wickets": int(request.data.get("current_wickets", 0))
                },
                "overs": float(request.data.get("overs", 0.0)),
                "target": request.data.get("target")
            }
        }
        
        additional_context = request.data.get("additional_context", "")
        commentary = generate_commentary(ball_data, additional_context)
        return Response({'commentary': commentary})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def live_commentary(request):
    """Generate commentary for the latest ball in a match"""
    try:
        match_id = request.GET.get('match_id')
        if not match_id:
            return Response({'error': 'match_id is required'}, status=400)
            
        # Fetch the latest ball data from the API
        url = f"https://api.cricapi.com/v1/match_bbb?apikey={api_key}&id={match_id}"
        response = requests.get(url)
        data = response.json()
        
        if 'data' in data and len(data['data']) > 0:
            latest_ball = data['data'][0]  # Assuming the most recent ball is first
            
            # Format the ball data for the commentary generator
            ball_data = {
                "ball_number": latest_ball.get("ballNumber", "0.0"),
                "batsman": latest_ball.get("batsman", ""),
                "bowler": latest_ball.get("bowler", ""),
                "runs_scored": int(latest_ball.get("runs", 0)),
                "extras": {
                    "wides": 1 if latest_ball.get("wides", 0) > 0 else 0,
                    "no_balls": 1 if latest_ball.get("noballs", 0) > 0 else 0,
                    "byes": 0,
                    "leg_byes": 0
                },
                "wicket": {"is_wicket": latest_ball.get("isWicket", False)},
                "match_context": {
                    "current_score": {
                        "runs": int(latest_ball.get("totalRuns", 0)),
                        "wickets": int(latest_ball.get("totalWickets", 0))
                    },
                    "overs": float(latest_ball.get("over", 0.0)),
                    "target": None
                }
            }
            
            # Generate commentary
            commentary = generate_commentary(ball_data)
            return Response({'commentary': commentary, 'ball_data': ball_data})
        else:
            return Response({'error': 'No ball data available'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

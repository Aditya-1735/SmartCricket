from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
import requests
from dotenv import load_dotenv
from myapp.ml_models.prediction_service import predict_score
from myapp.ml_models.windprediction import pred_win
from myapp.utils.commentary_generator import generate_commentary
from myapp.utils.fetch_match_id import get_ongoing_matches
from myapp.utils.get_short_name import get_short_name
from datetime import datetime
import re

load_dotenv()


# Basic template views


def Home(request):
    context = {
        'title': 'Welcome to Smart-cricket',
        'message': 'This is dynamic message'
    }
    return render(request, 'myapp/home.html', context)


def about(request):
    return render(request, 'myapp/about.html')


# API configuration
api_key = os.getenv("API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def extract_score_details(score_str):
    match = re.match(r"(\d+)/(\d+)\s+\(([\d.]+)\)", score_str)
    if match:
        runs = int(match.group(1))
        wickets = int(match.group(2))
        overs = float(match.group(3))
        return runs, wickets, overs
    return None, None, None


@api_view(['GET'])
def get_match_details(request):
    """
    Fetch upcoming and past matches from CricAPI.
    """
    try:
        current_date = datetime.now().strftime("%Y-%m-%d")

        # Fetch matches from CricAPI
        url = f"https://api.cricapi.com/v1/cricScore?apikey={api_key}"
        response = requests.get(url)
        data = response.json()

        past_matches = []

        if 'data' in data:
            for match in data['data']:
                # Check if it's an IPL match and date has passed
                # match_date = match.get('dateTimeGMT', '')
                date_time_str = match.get("dateTimeGMT", '')
                date_time_obj = datetime.fromisoformat(date_time_str)
                match_date = date_time_obj.strftime("%Y-%m-%d")
                # print(match_date)
                is_ipl = 'IPL' in match.get(
                    'series', '') or 'Indian Premier League' in match.get('series', '')
                if is_ipl and match_date < current_date:
                    # Format to match your required structure
                    t1_runs, t1_wickets, t1_overs = extract_score_details(
                        match.get("t1s"))
                    t2_runs, t2_wickets, t2_overs = extract_score_details(
                        match.get("t2s"))
                    formatted_match = {
                        'id': match.get('id'),
                        'team1': {
                            'name': match.get('t1', ""),
                            # 'shortName': match.get('teamInfo', [{}])[0].get('shortname', 'UNK'),
                            'runs': t1_runs,
                            'wickets': t1_wickets,
                            'overs': t1_overs
                        },
                        'team2': {
                            'name': match.get('t2', 'Unknown'),
                            # 'shortName': match.get('teamInfo', [{}, {}])[1].get('shortname', 'UNK') if len(match.get('teamInfo', [])) > 1 else 'UNK',
                            'runs': t2_runs,
                            'wickets': t2_wickets,
                            'overs': t2_overs
                        },
                        'status': 'completed',
                        'venue': match_date,
                        'time': '',
                        'series': 'IPL 2025',
                        'result': match.get('status')
                    }
                    past_matches.append(formatted_match)
        # print(past_matches)
        return JsonResponse({'pastMatches': past_matches})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Match data fetching views


@api_view(['GET'])
def get_matches(request):
    """Get all ongoing matches for a specific series or all series"""
    series_id = request.GET.get(
        'series_id', "d5a498c8-7596-4b93-8ab0-e0efc3345312")
    try:
        matches = get_ongoing_matches(api_key, series_id=series_id)
        return Response({'matches': matches})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def fetch_live_score():
    """Fetch ball-by-ball details for a specific match"""
    match_id = get_matches.get('matches')
    if not match_id:
        return Response({'error': 'match_id is required'}, status=400)

    url = "https://api.cricapi.com/v1/match_bbb"
    params = {
        "apikey": api_key,
        "id": match_id
    }

    response = requests.get(url, params=params)
    return JsonResponse(response.json())

match_id=''
@api_view(['GET'])
def fetch_match_details(request):
    global match_id

    if len(match_id)==0 : 
        match_d = get_ongoing_matches(
        api_key=api_key, series_id="d5a498c8-7596-4b93-8ab0-e0efc3345312")
        if match_d and isinstance(match_d, list):
            match_id = match_d[0]['id']
        else:
            return Response({'error': 'No ongoing matches found'})

    url = f"https://api.cricapi.com/v1/match_bbb?apikey={api_key}&id={match_id}"
    response = requests.get(url)
    data = response.json()
    print(data)
    if 'data' not in data:
        return JsonResponse({'error': 'Invalid API response'}, status=400)

    match = data['data']

    teams = match.get("teams", ["Team A", "Team B"])
    team1_name, team2_name = teams[0], teams[1]
    team1_short = get_short_name(team1_name)
    team2_short = get_short_name(team2_name)

    score_data = match.get("score", [])
    t1 = {'runs': '-', 'wickets': '-', 'overs': '-'}
    t2 = {'runs': '-', 'wickets': '-', 'overs': '-'}

    batting_team = None
    for s in score_data:
        inning = s.get("inning", "").lower()
        if team1_name.lower() in inning:
            t1.update({
                'runs': s.get("r", "-"),
                'wickets': s.get("w", "-"),
                'overs': s.get("o", "-")
            })
            print(t1)
            batting_team = "team1"
        elif team2_name.lower() in inning:
            t2.update({
                'runs': s.get("r", "-"),
                'wickets': s.get("w", "-"),
                'overs': s.get("o", "-")
            })
            print(t2)
            batting_team = "team2"
            

    formatted_match = {
        'id': match.get('id'),
        'team1': {
            'name': team1_name,
            'shortName': team1_short,
            'runs': t1['runs'],
            'wickets': t1['wickets'],
            'overs': t1['overs']
        },
        'team2': {
            'name': team2_name,
            'shortName': team2_short,
            'runs': t2['runs'],
            'wickets': t2['wickets'],
            'overs': t2['overs']
        },
        'status': "live" if not match.get("matchEnded", False) else "completed",
        'venue': match.get('venue', 'Unknown'),
        'time': match.get('dateTimeGMT', ''),
        'series': 'IPL 2025',
        'result': match.get('status', ''),
        'battingTeam': batting_team
    }
    print(formatted_match)

    return JsonResponse({'livematches': [formatted_match]})
    # except Exception as e:
    #     return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
def get_single_match(request, match_id):
    """Fetch details for a specific match by ID"""
    try:
        if not api_key:
            # Mock data for development
            mock_match = {
                'id': match_id,
                'team1': {
                    'name': 'Mumbai Indians',
                    'shortName': 'MI',
                    'runs': '180',
                    'wickets': '4',
                    'overs': '20.0'
                },
                'team2': {
                    'name': 'Chennai Super Kings',
                    'shortName': 'CSK',
                    'runs': '176',
                    'wickets': '6',
                    'overs': '20.0'
                },
                'status': "completed",
                'venue': 'Wankhede Stadium, Mumbai',
                'time': '2025-04-18T14:00:00.000Z',
                'series': 'Indian Premier League 2025',
                'result': 'Mumbai Indians won by 4 wickets',
                'toss': 'Mumbai Indians won the toss and elected to bowl first'
            }
            return JsonResponse({'match': mock_match})

        print(f"Fetching match details for ID: {match_id}")
        url = f"https://api.cricapi.com/v1/match_info?apikey={api_key}&id={match_id}"
        response = requests.get(url)
        print(f"API Response Status: {response.status_code}")
        data = response.json()
        print(f"API Response Data: {data}")

        if 'data' not in data:
            return JsonResponse({'error': 'Invalid API response'}, status=400)

        match = data['data']
        teams = match.get('teams', ['Team A', 'Team B'])
        team1_name = teams[0]
        team2_name = teams[1]
        team1_short = get_short_name(team1_name)
        team2_short = get_short_name(team2_name)

        score_data = match.get("score", [])
        t1 = {'runs': '-', 'wickets': '-', 'overs': '-'}
        t2 = {'runs': '-', 'wickets': '-', 'overs': '-'}
        
        for score in score_data:
            inning = score.get('inning', '').lower()
            if team1_name.lower() in inning:
                t1.update({
                    'runs': score.get('r', '-'),
                    'wickets': score.get('w', '-'),
                    'overs': score.get('o', '-')
                })
            elif team2_name.lower() in inning:
                t2.update({
                    'runs': score.get('r', '-'),
                    'wickets': score.get('w', '-'),
                    'overs': score.get('o', '-')
                })

        formatted_match = {
            'id': match.get('id'),
            'team1': {
                'name': team1_name,
                'shortName': team1_short,
                'runs': t1['runs'],
                'wickets': t1['wickets'],
                'overs': t1['overs']
            },
            'team2': {
                'name': team2_name,
                'shortName': team2_short,
                'runs': t2['runs'],
                'wickets': t2['wickets'],
                'overs': t2['overs']
            },
            'status': "live" if not match.get("matchEnded", False) else "completed",
            'venue': match.get('venue', 'Unknown'),
            'time': match.get('dateTimeGMT', ''),
            'series': match.get('series', 'Indian Premier League 2025'),
            'result': match.get('status', ''),
            'toss': f"{match.get('tossWinner', 'Unknown')} won the toss and elected to {match.get('tossChoice', 'bat')} first",
            'matchWinner': match.get('matchWinner', '')
        }

        print("Formatted match data:", formatted_match)
        return JsonResponse({'match': formatted_match})
    except Exception as e:
        import traceback
        print("Error in get_single_match:", str(e))
        print(traceback.format_exc())
        return JsonResponse({'error': str(e)}, status=500)

# ML model integration views


@api_view(['POST'])
def predict_score_view(request):
    """Predict final score based on current match situation"""
    try:
        features = request.data
        required_fields = ['batting_team', 'bowling_team', 'city', 'current_runs', 'overs', 'wickets', 'last_five']
        
        # Validate required fields
        missing_fields = [field for field in required_fields if field not in features]
        if missing_fields:
            return Response({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=400)
        # Validate numeric fields
        try:
            features['current_runs'] = int(features['current_runs'])
            features['wickets'] = int(features['wickets'])
            features['overs'] = float(features['overs'])
            features['last_five'] = int(features['last_five']) if features['last_five'] is not None else 0
        except (ValueError, TypeError):
            return Response({
                'error': 'Invalid numeric values for runs, wickets, overs, or last_five'
            }, status=400)
            
        # Calculate additional features
        features['balls_left'] = max(0, 120 - int(features['overs'] * 6))
        features['wickets_left'] = max(0, 10 - features['wickets'])
        features['crr'] = features['current_runs'] / features['overs'] if features['overs'] > 0 else 0
        
        prediction = predict_score(features)
        predicted_score = int(round(prediction[0]))  # Round to nearest integer
        
        return Response({
            'predicted_score': predicted_score,
            'current_score': features['current_runs'],
            'projected_runs': predicted_score - features['current_runs']
        })
    except Exception as e:
        print(f"Error in predict_score_view: {str(e)}")
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def predict_win_view(request):
    """
    Predict the win probability for a match based on provided features.
    """
    try:
        features = request.data
        prediction = pred_win(features)
        return Response({'win_prediction': prediction[0]})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['POST'])
def generate_commentary_view(request):
    """Generate AI commentary for a specific ball"""
    try:
        # print("lessgooo")
        print(request.data)
        # print( request.data.get("wicket"))
        wicket = request.data.get("wicket")
        is_wicket = wicket.get("is_wicket") if wicket else False
        print(is_wicket)
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
            "wicket": {"is_wicket": is_wicket},
            "match_context": {
                "current_score": {
                    "runs": int(request.data.get("current_runs", 0)),
                    "wickets": int(request.data.get("current_wickets", 0))
                },
                "overs": float(request.data.get("overs", 0.0)),
                "target": request.data.get("target")
            }
        }

        additional_context = request.data.get(
            "additional_context", "Navjoot singh Sidhu  commentary and remove name of commentator")
        commentary = generate_commentary(ball_data, additional_context)
        # return JsonResponse({'commentary': commentary})
        current_time = datetime.now().strftime('%H:%M')

        # Return a properly structured response
        response_data = {
            'commentary': commentary,
            'ball_data': ball_data,
            'timestamp': current_time
        }

        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


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
            # Assuming the most recent ball is first
            latest_ball = data['data'][0]

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
            print(commentary)
            current_time = datetime.now().strftime('%H:%M')

            # Return a properly structured response
            response_data = {
                'commentary': commentary,
                'ball_data': ball_data,
                'timestamp': current_time
            }

            return Response(response_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

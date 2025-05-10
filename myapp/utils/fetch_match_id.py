api_key = "1a0eae78-ad94-4d8a-9066-4b2bd9c55996"
series_id = "d5a498c8-7596-4b93-8ab0-e0efc3345312"
import requests

def get_ongoing_matches(api_key, series_id=series_id):
    url = f"https://api.cricapi.com/v1/currentMatches?apikey={api_key}&offset=0"
    
    response = requests.get(url)
    if response.status_code != 200:
        return f"Error: {response.status_code}, {response.text}"
    
    data = response.json()
    if data['status'] != 'success':
        return "Failed to fetch matches"
    
    ongoing_matches = []
    for match in data.get('data', []):
        # Filter matches by series ID and ongoing status
        if (
            match.get('series_id') == series_id 
            and match.get('matchStarted') 
            and not match.get('matchEnded')
        ):
            ongoing_matches.append({
                'id': match['id'],
                'name': match['name'],
                'status': match['status'],
                'venue': match['venue'],
                'teams': match['teams'],
                'score': match.get('score', [])
            })
    
    if ongoing_matches:
        return ongoing_matches
    else:
        return "No ongoing matches found in the given series."

# Example usage
matches = get_ongoing_matches(api_key, series_id)

if isinstance(matches, str):  # If no matches found or error occurred
    print(matches)
else:
    for match in matches:
        print(f"Match ID: {match['id']}")
        print(f"Match Name: {match['name']}")
        print(f"Status: {match['status']}")
        print(f"Venue: {match['venue']}")
        print(f"Teams: {', '.join(match['teams'])}")
        print(f"Score: {match['score']}")
        print("-" * 40)

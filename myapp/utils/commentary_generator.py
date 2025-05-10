from google import genai
import re
import os
from dotenv import load_dotenv
load_dotenv()

# Set your Gemini API key
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
client = genai.Client(api_key=GEMINI_API_KEY)  # Replace with your actual API key

def generate_commentary(ball_data, additional_context=""):
    """
    Generate professional cricket commentary using the Gemini API.
    """
    try:
        # Determine ball outcome for focused prompting
        if ball_data['wicket']['is_wicket']:
            outcome = "OUT"
        elif ball_data['runs_scored'] == 4:
            outcome = "FOUR"
        elif ball_data['runs_scored'] == 6:
            outcome = "SIX"
        elif ball_data['runs_scored'] == 0:
            outcome = "no run"
        else:
            outcome = f"{ball_data['runs_scored']} runs"

        # Create a detailed prompt for the model
        prompt = f"""Generate a detailed cricket commentary for a single delivery which is short (under 50 words) and realistic:

Ball {ball_data['ball_number']}: {ball_data['bowler']} bowling to {ball_data['batsman']}
Result: {outcome}

Commentary should include:
1. {ball_data['batsman']} played the shot.
2. Details about timing.
3. The crowd's reaction and impact on the match situation.
4. Focus only on this single delivery.

Additional context: {additional_context}

Commentary:"""

        # Call Gemini API to generate commentary
        response = client.models.generate_content(
            model="gemini-2.0-flash",  # Use appropriate Gemini model
            contents=[prompt]
        )

        # Extract and clean the generated text
        raw_commentary = response.text.strip()
        processed_commentary = clean_commentary(raw_commentary)
        
        # Format the final output
        final_commentary = f"{ball_data['ball_number']} {ball_data['bowler']} to {ball_data['batsman']}, {outcome}, {processed_commentary}"
        return final_commentary

    except Exception as e:
        print(f"Error generating commentary: {str(e)}")
        return template_commentary(ball_data)

def clean_commentary(text):
    """
    Clean and format the generated commentary.
    """
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = re.sub(r'[^\w\s.,!?]', '', text)  # Remove special characters
    return text.strip()

def template_commentary(ball_data):
    """
    Fallback template-based commentary.
    """
    if ball_data['wicket']['is_wicket']:
        return f"{ball_data['ball_number']} {ball_data['bowler']} to {ball_data['batsman']}, OUT! A perfect delivery that crashes into the stumps."
    elif ball_data['runs_scored'] == 4:
        return f"{ball_data['ball_number']} {ball_data['bowler']} to {ball_data['batsman']}, FOUR! An elegant cover drive that races past mid-off."
    elif ball_data['runs_scored'] == 6:
        return f"{ball_data['ball_number']} {ball_data['bowler']} to {ball_data['batsman']}, SIX! A massive hit over long-on into the stands!"
    elif ball_data['runs_scored'] == 0:
        return f"{ball_data['ball_number']} {ball_data['bowler']} to {ball_data['batsman']}, no run, defended solidly."
    else:
        return f"{ball_data['ball_number']} {ball_data['bowler']} to {ball_data['batsman']}, pushed into the gap for {ball_data['runs_scored']} runs."

if __name__ == "__main__":
    # Example ball data
    ball_data = {
        "ball_number": 4.3,
        "batsman": "Virat Kohli",
        "bowler": "Pat Cummins",
        "runs_scored": 0,
        "extras": {"wides": 0, "no_balls": 0, "byes": 0, "leg_byes": 0},
        "wicket": {"is_wicket": True},
        "match_context": {
            "current_score": {"runs": 45, "wickets": 1},
            "overs": 4.3,
            "target": None
        }
    }

    # Generate and print commentary with additional context
    commentary = generate_commentary(ball_data,"Attractive English commentary without shot name")
    print("Generated Commentary:")
    print(commentary)

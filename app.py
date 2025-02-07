from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_gifts_from_openai(prompt: str):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": "You are an AI that suggests personalized gift ideas."},
                  {"role": "user", "content": prompt}],
        max_tokens=150
    )

    suggestions = response.choices[0].message.content.strip().split("\n")
    return suggestions

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.get_json()

        lover_name = data.get('partnerName')
        interests = data.get('interests')
        hobbies = data.get('hobbies')
        budget = data.get('budget')

        if not all([lover_name, interests, hobbies, budget]):
            return jsonify({"error": "Missing required fields"}), 400

        # OpenAI Prompt
        prompt = f"""
        Generate 3 personalized Valentine's Day gift suggestions based on:
        - Partner Name: {lover_name}
        - Interests: {interests}
        - Hobbies: {hobbies}
        - Budget: {budget}

        Return JSON format with the structure:
        {{
            "gifts": [
                {{"title": "Gift 1", "description": "Description of Gift 1", "price": "$50", "link": "http://example.com", "retailer": "Amazon"}},
                {{"title": "Gift 2", "description": "Description of Gift 2", "price": "$30", "link": "http://example.com", "retailer": "Etsy"}},
                {{"title": "Gift 3", "description": "Description of Gift 3", "price": "$20", "link": "http://example.com", "retailer": "Local Store"}}
            ]
        }}
        """

        # Call OpenAI
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300
        )

        # Extract and log AI response for debugging
        ai_response_text = response.choices[0].message.content.strip()
        print("AI Response:", ai_response_text)

        # Sanitize AI response to ensure valid JSON
        ai_response_text = ai_response_text.replace('```json', '').replace('```', '').strip()

        try:
            ai_response_json = json.loads(ai_response_text)
        except json.JSONDecodeError:
            return jsonify({"error": "AI response not valid JSON", "response_text": ai_response_text}), 500

        return jsonify(ai_response_json)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=5000)

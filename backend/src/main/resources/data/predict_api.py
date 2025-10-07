from flask import Flask, request, jsonify
import joblib
import os
from collections import Counter

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Model file configuration for each quiz category
model_files = {
    'techquiz': (
        os.path.join(BASE_DIR, 'techquiz_model.pkl'),
        os.path.join(BASE_DIR, 'techquiz_label_encoder.pkl'),
        70
    ),
    'scenario': (
        os.path.join(BASE_DIR, 'scenario_model.pkl'),
        os.path.join(BASE_DIR, 'scenario_label_encoder.pkl'),
        50
    ),
    'personality': (
        os.path.join(BASE_DIR, 'personality_model.pkl'),
        os.path.join(BASE_DIR, 'personality_label_encoder.pkl'),
        50
    ),
    'interest': (
        os.path.join(BASE_DIR, 'interest_profile_model.pkl'),
        os.path.join(BASE_DIR, 'interest_profile_label_encoder.pkl'),
        50
    ),
    'codechallenge': (
        os.path.join(BASE_DIR, 'codechallenge_model.pkl'),
        os.path.join(BASE_DIR, 'codechallenge_label_encoder.pkl'),
        60
    )
}


def predict_career(answers, model_path, encoder_path, expected_len=60):
    """Run prediction for a single category."""
    try:
        # Pad or trim answers to match model input size
        if len(answers) < expected_len:
            answers = answers + [0] * (expected_len - len(answers))
        elif len(answers) > expected_len:
            answers = answers[:expected_len]

        model = joblib.load(model_path)
        le = joblib.load(encoder_path)

        prediction = model.predict([answers])
        career = le.inverse_transform(prediction)[0]
        return career

    except Exception as e:
        print(f"Prediction error: {e}")
        return "Unknown"


@app.route('/predict/<category>', methods=['POST'])
def predict(category):
    """Predict career for an individual quiz category."""
    print(f"Received prediction request for category: {category}")
    data = request.json
    if not data or 'answers' not in data:
        return jsonify({'error': 'Missing answers'}), 400

    answers = data['answers']

    if category not in model_files:
        print(f"Invalid category requested: {category}")
        return jsonify({'error': 'Invalid category'}), 404

    model_path, encoder_path, expected_len = model_files[category]
    career = predict_career(answers, model_path, encoder_path, expected_len)

    print(f"Predicted career for {category}: {career}")
    return jsonify({'career': career})


@app.route('/predict/overall', methods=['POST'])
def predict_overall():
    print("Received prediction request for category: overall")
    data = request.json

    if not data or 'answers' not in data:
        return jsonify({'error': 'Missing data'}), 400

    grouped_answers = data['answers']
    predictions = []

    for category, (model_path, encoder_path, expected_len) in model_files.items():
        answers = grouped_answers.get(category, [])
        if not isinstance(answers, list):
            print(f"Invalid or missing answers for {category}")
            continue

        career = predict_career(answers, model_path, encoder_path, expected_len)
        predictions.append(career)
        print(f"{category} -> {career}")

    # Get top 3 most common predictions
    most_common = Counter(predictions).most_common(3)
    top_careers = [item[0] for item in most_common]

    print(f"Top 3 predicted careers: {top_careers}")

    return jsonify({
        'top_careers': top_careers,
        'all_predictions': predictions
    })


if __name__ == '__main__':
    app.run(port=5000)

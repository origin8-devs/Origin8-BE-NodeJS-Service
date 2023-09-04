import joblib
import sys
import json

def main():
    # Load the model
    model = joblib.load('path/to/your/model.pkl')

    # Read input data from Node.js
    input_data = sys.stdin.read()
    input_data = json.loads(input_data)

    # Make predictions
    predictions = model.predict(input_data)

    # Send predictions to Node.js
    sys.stdout.write(json.dumps(predictions))
    sys.stdout.flush()

if __name__ == "__main__":
    main()

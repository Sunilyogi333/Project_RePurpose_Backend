import sys
import pandas as pd
import pickle
import os
import json

# Print the current working directory for debugging
print("Current working directory:", os.getcwd())

model_file_path = 'AI_MODEL/model.pkl'
if os.path.exists(model_file_path):
    with open(model_file_path, 'rb') as file:
        model = pickle.load(file)
else:
    print(json.dumps({"error": "Model file not found"}))
    sys.exit(1)

# Parse input arguments
try:
    input_data = json.loads(sys.argv[1])
except (IndexError, json.JSONDecodeError):
    print(json.dumps({"error": "Invalid input data"}))
    sys.exit(1)

# Create DataFrame from input
data = pd.DataFrame([input_data])

# Predict reward points
reward_point = model.predict(data)[0]
positive_reward_point = abs(reward_point)  # Ensure reward points are positive

# Return the result as JSON
print(json.dumps({"reward_points": positive_reward_point}))
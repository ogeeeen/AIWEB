from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import os

app = Flask(__name__)
CORS(app)

knn = KNeighborsClassifier(n_neighbors=3)
training_data = []
labels = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/learn", methods=["POST"])
def learn():
    try:
        data = request.json["data"]
        class_id = request.json["classId"]  # キー名を修正
        training_data.append(data)
        labels.append(class_id)
        knn.fit(training_data, labels)
        return jsonify({"status": "ok"})

    except Exception as e:
        print(str(e))
        response = {
            "success": False,
            "message": "An error occurred during processing",
        }
        return jsonify(response), 500

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json["data"]
        probabilities = knn.predict_proba([data])[0]
        return jsonify({"probabilities": probabilities.tolist()})

    except Exception as e:
        print(str(e))
        response = {
            "success": False,
            "message": "An error occurred during processing",
        }
        return jsonify(response), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000))

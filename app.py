from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import os  # 追加

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
    data = request.json["data"]
    class_id = request.json["class_id"]
    training_data.append(data)
    labels.append(class_id)
    knn.fit(training_data, labels)
    return jsonify({"status": "ok"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["data"]
    probabilities = knn.predict_proba([data])[0]
    return jsonify({"probabilities": probabilities.tolist()})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000))
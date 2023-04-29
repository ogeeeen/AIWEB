from flask import Flask, render_template, request, jsonify
import cv2
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

app = Flask(__name__)
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
    app.run(debug=True)

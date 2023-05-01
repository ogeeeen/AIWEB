from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

app = Flask(__name__)
CORS(app)

knn = KNeighborsClassifier(n_neighbors=3)

@app.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    input_data = np.array(data['inputData']).reshape(1, -1)
    prediction = knn.predict(input_data)
    return jsonify({'prediction': int(prediction[0])})

@app.route('/learn', methods=['POST'])
def learn():
    data = request.get_json()
    training_data = np.array(data['trainingData']).reshape(-1, 1)
    labels = np.array(data['labels'])
    knn.fit(training_data, labels)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run()

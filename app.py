from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.neighbors import KNeighborsClassifier
import numpy as np

app = Flask(__name__)
CORS(app)

knn = KNeighborsClassifier(n_neighbors=3)

@app.route('/learn', methods=['POST'])
def learn():
    data = request.json
    training_data = [list(d.values()) for d in data['training_data']]
    labels = data['labels']
    knn.fit(training_data, labels)
    return jsonify({"status": "success"})
#️　変更
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_data = np.array(data['input']).reshape(1, -1)
    result = knn.predict(input_data)
    return jsonify({"result": int(result[0])})

if __name__ == '__main__':
    app.run()

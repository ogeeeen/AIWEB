import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.neighbors import KNeighborsClassifier
import numpy as np

app = Flask(__name__)
CORS(app)

logging.basicConfig(filename='app.log', level=logging.DEBUG, format='%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

knn = KNeighborsClassifier(n_neighbors=3)

@app.route('/learn', methods=['POST'])
def learn():
    app.logger.info('Learn route has been accessed')
    data = request.json
    training_data = [list(d.values()) for d in data['training_data']]
    labels = data['labels']
    knn.fit(training_data, labels)
    return jsonify({"status": "success"})

@app.route('/predict', methods=['POST'])
def predict():
    app.logger.info('Predict route has been accessed')
    data = request.json
    input_data = np.array(data['input']).reshape(1, -1)
    result = knn.predict(input_data)
    return jsonify({"result": int(result[0])})

if __name__ == '__main__':
    app.run()

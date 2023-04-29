const video = document.getElementById("camera");
const prediction = document.getElementById("prediction");

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    });

function capture() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    return Array.from(data);
}

function learn(class_id) {
    const data = capture();
    fetch("/learn", {
        method: "POST",
        body: JSON.stringify({ data, class_id }),
        headers: { "Content-Type": "application/json" }
    });
}

function predict() {
    const data = capture();
    fetch("/predict", {
        method: "POST",
        body: JSON.stringify({ data }),
        headers: { "Content-Type": "application/json" }
    }).then(response => response.json())
        .then(result => {
            const probabilities = result.prob            .then(result => {
                const probabilities = result.probabilities;
                const maxIndex = probabilities.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                const percent = (probabilities[maxIndex] * 100).toFixed(2);
                prediction.textContent = `Class ${maxIndex + 1}: ${percent}%`;
            });
}

video.addEventListener("loadedmetadata", () => {
    setInterval(predict, 1000);
});

const video = document.getElementById("video");
const buttons = document.querySelectorAll(".class-btn");
const predictButton = document.getElementById("predict");
const output = document.getElementById("output");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error("Error: " + err);
  }
}

startCamera();

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const classId = parseInt(button.dataset.classId);
    const data = await captureData();
    postData("/learn", { data, class_id: classId }).then((res) => {
      console.log(res);
    });
  });
});

predictButton.addEventListener("click", async () => {
  const data = await captureData();
  postData("/predict", { data }).then((res) => {
    const probabilities = res.probabilities;
    const maxIndex = probabilities.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0);
    output.innerText = `Class ${maxIndex + 1}: ${(probabilities[maxIndex] * 100).toFixed(2)}%`;
  });
});

async function captureData() {
  const imageCapture = new ImageCapture(video.srcObject.getVideoTracks()[0]);
  const bitmap = await imageCapture.grabFrame();
  const imageData = new ImageData(bitmap.width, bitmap.height);
  imageData.data.set(bitmap.data);
  const data = Array.from(imageData.data);
  return data;
}

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

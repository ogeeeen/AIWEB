const video = document.getElementById("video");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

function getCameraDevices() {
  return navigator.mediaDevices.enumerateDevices().then((devices) => {
    return devices.filter((device) => device.kind === "videoinput");
  });
}

function startCameraStream(deviceId) {
  const constraints = {
    video: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
    },
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (err) {
      console.error("An error occurred: " + err);
    });
}

getCameraDevices().then((devices) => {
  if (devices.length > 0) {
    startCameraStream(devices[0].deviceId);
  } else {
    console.error("No cameras found.");
  }
});

async function captureData() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  return imageData.data;
}

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  });

  return await response.json();
}

function processButtonClick(label) {
  const imageData = captureData(); // 修正
  postData("/learn", { data: imageData, class_id: label })
    .then((result) => {
      console.log(result);
      const prediction = result.prediction;
      const confidence = (prediction.confidence * 100).toFixed(2);
      document.getElementById("result").innerHTML =
        "Prediction: " + prediction.label + " (" + confidence + "%)";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const buttons = document.querySelectorAll(".class-btn");
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    buttons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");
    processButtonClick(event.target.id);
  });
});

video.addEventListener("click", () => {
  const activeButton = document.querySelector(".class-btn.active");
  if (activeButton) {
    processButtonClick(activeButton.id);
  }
});

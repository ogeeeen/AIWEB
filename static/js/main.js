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

function captureImage() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  return canvas.toDataURL("image/jpeg", 0.8);
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
  const imageData = captureImage();
  postData("/classify", { image: imageData, label: label })
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

const buttons
= document.querySelectorAll(".class-btn");
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
// 既存のコードの後に以下を追加

let currentCameraIndex = 0;

async function getDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === "videoinput");
}

async function changeCamera() {
  const videoElement = document.getElementById("video");
  const stream = videoElement.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  const devices = await getDevices();
  const nextCamera = devices[currentCameraIndex % devices.length];
  currentCameraIndex++;

  const constraints = {
    video: {
      deviceId: { exact: nextCamera.deviceId },
      width: { ideal: 480 },
      height: { ideal: 360 },
    },
  };

  try {
    const newStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = newStream;
  } catch (err) {
    console.error("Error: ", err);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "c" || event.key === "C") {
    changeCamera();
  }
});
// クラスごとの学習枚数を格納する変数
const counts = [0, 0, 0, 0, 0];

// クラスボタンがクリックされたときに学習枚数を更新する関数
function updateCount(classIndex) {
  counts[classIndex]++;
  document.getElementById(`count${classIndex + 1}`).innerText = `学習枚数: ${counts[classIndex]}`;
}

// 各クラスボタンにクリックイベントを追加
for (let i = 1; i <= 5; i++) {
  document.getElementById(`class${i}`).addEventListener("click", () => {
    updateCount(i - 1);
  });
}

// 確率表示を "クラス分類アプリケーション" に繋げる
function displayResult(result) {
  const appTitle = document.getElementById("app-title");
  appTitle.innerText = `クラス分類アプリケーション - 確率: ${result}%`;
}

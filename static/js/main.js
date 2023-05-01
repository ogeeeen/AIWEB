const video = document.getElementById("video");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 360;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    });
}

const buttons = document.querySelectorAll(".class-btn");

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const response = await postData("/learn", {
      classId: button.id,
      data: Array.from(imageData.data),
    });
    if (response.success) {
      document.getElementById(`count${button.id.slice(-1)}`).textContent =
        `学習枚数: ${response.count}`;
    } else {
      console.error("Error during learning");
    }
  });
});

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: data }), // 修正後のコード
  });

  return response.json();
}

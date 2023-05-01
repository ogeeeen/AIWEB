const learnButtons = document.querySelectorAll(".learn-button");
const predictButton = document.querySelector("#predict-button");
const resultElement = document.querySelector("#result");

learnButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const classId = parseInt(button.dataset.classId, 10);
    const canvas = document.querySelector("#canvas");
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const sample = preprocess(imageData);

    const response = await fetch("/learn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: sample, class_id: classId }),
    });

    if (response.ok) {
      console.log(`Learned class ${classId}`);
    } else {
      console.error("Error during learning");
    }
  });
});

predictButton.addEventListener("click", async () => {
  const canvas = document.querySelector("#canvas");
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const sample = preprocess(imageData);

  // 修正前: '/classify'
  const response = await fetch("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: sample }),
  });

  if (response.ok) {
    const { probabilities } = await response.json();
    displayProbabilities(probabilities);
  } else {
    console.error("Error during prediction");
  }
});

function preprocess(imageData) {
  // ...（前処理コードは変更されていません）
}

function displayProbabilities(probabilities) {
  // ...（結果表示コードは変更されていません）
}

window.onload = function () {
  const classButtons = document.querySelectorAll(".class-btn");
  const resultElement = document.querySelector("#result");

  classButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const classId = parseInt(button.id.replace('class', ''), 10);
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

  function preprocess(imageData) {
    // ...（前処理コードは変更されていません）
  }

  function displayProbabilities(probabilities) {
    // ...（結果表示コードは変更されていません）
  }
};

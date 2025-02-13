function saveName() {
  let nameInput = document.getElementById("name-input").value;
  localStorage.setItem("savedText", nameInput);
}

document
  .getElementById("name-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // save name input when user presses enter
      saveName();
    }
  });

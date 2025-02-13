// name input
document
  .getElementById("name-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      let nameInput = document.getElementById("name-input").value;
      localStorage.setItem("savedName", nameInput);
    }
  });

// calendar ID input
document
  .getElementById("calendar-ID-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      let calendarIDInput = document.getElementById("calendar-ID-input").value;
      localStorage.setItem("savedCalendarID", calendarIDInput);
    }
  });

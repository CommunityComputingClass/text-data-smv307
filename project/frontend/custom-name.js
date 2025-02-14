// name input
document
  .getElementById("name-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      let nameInput = document.getElementById("name-input").value;
      localStorage.setItem("savedName", nameInput);
      console.log(nameInput);
    }
  });

// calendar ID input
document
  .getElementById("calendar-ID-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      let calendarIDInput = document.getElementById("calendar-ID-input").value;
      localStorage.setItem("savedCalendarID", calendarIDInput);
      console.log(calendarIDInput);
    }
  });

// make a function for these later 
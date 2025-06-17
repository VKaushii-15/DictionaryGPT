var { ipcRenderer } = require("electron");
var ipc = ipcRenderer;

// Toggle drop-down popup
function toggleDropPopup() {
  const popup = document.getElementById("dropPopup");
  popup.classList.toggle("show");
}

// Close popup when clicking outside
function handleClickOutside(event) {
  const popup = document.getElementById("dropPopup");
  const dropButton = document.getElementById("Drop-Down");

  if (
    !popup.contains(event.target) &&
    event.target !== dropButton &&
    !dropButton.contains(event.target)
  ) {
    popup.classList.remove("show");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const Close = document.getElementById("Close");
  const Minus = document.getElementById("Minus");
  const Drop = document.getElementById("Drop-Down");
  const History = document.getElementById("History");
  const form = document.getElementById("WordSearch");
  const Body = document.querySelector(".BodyText");
  const searchBar = document.querySelector(".search-bar");
  const Border = document.querySelector(".border");
  const Einstein = document.getElementById("Einstein");

  // Add click event for drop-down button
  Drop.addEventListener("click", () => {
    toggleDropPopup();
    ipc.send("drop");
  });

  // Add click outside listener
  document.addEventListener("click", handleClickOutside);

  Close.addEventListener("click", () => {
    ipc.send("close");
  });

  Minus.addEventListener("click", () => {
    ipc.send("minimize");
  });

  History.addEventListener("click", () => {
    ipc.send("history");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formdata = new FormData(form);
    const word = formdata.get("Word");
    ipc.send("Searched", word);
    location.reload();
  });

  ipc.on("output", (event, data) => {
    console.log(data);
    Body.classList.add("passive");
    Border.classList.remove("passive");
    Border.classList.add("fade-in");
    searchBar.classList.add("moved");
    Border.insertAdjacentHTML("afterbegin", data);
  });

  Einstein.addEventListener("click", () => {
    const formdata = new FormData(form);
    const word = formdata.get("Word");
    if (Einstein.checked) {
      ipc.send("Einstein", word);
    }
    console.log("Einstein clicked", word);
  });
});

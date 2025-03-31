var { ipcRenderer } = require("electron");
var ipc = ipcRenderer;

document.addEventListener("DOMContentLoaded", () => {
  const Close = document.getElementById("Close");
  const Minus = document.getElementById("Minus");
  const Drop = document.getElementById("Drop-Down");
  const History = document.getElementById("History");
  const form = document.getElementById("WordSearch");
  const Body = document.querySelector(".BodyText");
  const searchBar = document.querySelector(".search-bar");
  const Border = document.querySelector(".border");

  Close.addEventListener("click", () => {
    ipc.send("close");
  });

  Minus.addEventListener("click", () => {
    ipc.send("minimize");
  });

  Drop.addEventListener("click", () => {
    ipc.send("drop");
  });

  History.addEventListener("click", () => {
    ipc.send("history");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formdata = new FormData(form);
    const word = formdata.get("Word");
    ipc.send("Searched", word);
  });

  ipc.on("output", (event, data) => {
    console.log(data);
    Body.classList.add("passive");
    Border.classList.remove("passive");
    Border.classList.add("fade-in");
    searchBar.classList.add("moved");
    Border.insertAdjacentHTML("afterbegin", data);
  });
});

var { ipcRenderer } = require("electron");
var ipc = ipcRenderer;

document.addEventListener("DOMContentLoaded", () => {
  const Close = document.getElementById("Close");
  const Minus = document.getElementById("Minus");
  const Drop = document.getElementById("Drop-Down");
  const History = document.getElementById("History");
  const form = document.getElementById("WordSearch");
  const Body = document.getElementById("BodyText");
  const searchBar = document.getElementById("search-bar");

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
    searchBar.classList.add("moved");
  });
});

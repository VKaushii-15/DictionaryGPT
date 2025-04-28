const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const axios = require("axios");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 700,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "side.js"),
    },
    maximizable: false,
    resizable: false,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("did-finish-load", () => {
    const currentURL = mainWindow.webContents.getURL();
    console.log("Current URL:", currentURL);
  });

  ipcMain.on("close", () => {
    console.log("Close");
    app.quit();
  });

  ipcMain.on("minimize", () => {
    console.log("Minimize");
    mainWindow.minimize();
  });

  ipcMain.on("drop", () => {
    console.log("Drop");
  });

  ipcMain.on("history", () => {
    console.log("History");
    mainWindow.reload();
  });

  ipcMain.on("Searched", async (event, word) => {
    try {
      const data = await axios.post("http://localhost:5500/user", {
        word: word,
      });
      const output = JSON.stringify(data.data);
      console.log(JSON.parse(output));
      event.reply("output", returnDefinition(JSON.parse(output)));
    } catch (error) {
      console.error(error);
      alert("Error");
    }
  });

  ipcMain.on("Einstein", async (event, word) => {
    console.log(data);
    const data = await axios.post("http://localhost:5500/user", {
      word: word,
      Einstein: "Yes",
    });
    const output = JSON.stringify(data.data);
    console.log(JSON.parse(output));
    event.reply("output", returnDefinition(JSON.parse(output)));
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// the export HTML tag part

function returnDefinition(data) {
  const word = data.word;
  const pronunciation = data.pronunciation;
  const splitup = data.splitup;
  const root = data.root;
  const synonyms = data.synonyms;
  const meaning = data.meaning;

  let html = `
      <div class="word" id="word">
        <span class="word" id="word">${word}</span>
      </div>
      <div class="pronunciation">
        <span id="pronunciation">Pronunciation: ${pronunciation}</span>
      </div>
      <div class="split-up"> 
        <span class="split-up" id="split">Split-up: ${splitup}</span>
      </div>
      <div class="root">
        <span class="root" id="root">Root: ${root}</span>
      </div>
      <div class="synonyms">
        <ul class="synonym-list" id="synonyms">
          Synonyms: ${synonyms
            .map((synonym) => `<li>${synonym}</li>`)
            .join(",")}
        </ul>
      </div>
      <div class="meaning">
        <span id="meaning">Meaning:</span>
        <div id="meaning">
        <ul id = "meaning">
          ${Object.entries(meaning)
            .map(
              ([partOfSpeech, definition]) =>
                `<li><span id="POS">${partOfSpeech}</span>: ${definition}</li>`
            )
            .join("")}
        </ul>
        </div>
      <div class="sentence">
        <span id="sentencetitle">Sentence:</span>
        <span id="sentence">${data.sentence.replace(
          new RegExp(`\\b${word}\\b`, "gi"),
          `<b>${word}</b>`
        )}</span>
      </div>
      </div>`;
  return html;
}

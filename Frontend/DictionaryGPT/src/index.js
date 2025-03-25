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
    width: 500,
    height: 500,
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
  });

  ipcMain.on("Searched", async (_event, word) => {
    try {
      const data = await axios.post("http://localhost:5500/user", {
        word: word,
      });
      const output = JSON.stringify(data.data);
      console.log(JSON.parse(output));
    } catch (error) {
      console.error(error);
      alert("Error");
    }
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

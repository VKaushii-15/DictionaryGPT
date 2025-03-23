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
const ans = async (req) => {
  try {
    // Ensure `req` is defined and valid
    if (!req) {
      throw new Error("Invalid or missing 'req' value");
    }

    // Construct the URL
    const url = `http://localhost:5500/user/${req}`;
    console.log("Request URL:", url); // Debug the URL

    // Send the GET request
    const response = await axios.get(url);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

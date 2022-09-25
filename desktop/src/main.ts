import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as fs from "fs";

import "./game";

const {token, shifter} = JSON.parse(fs.readFileSync(path.join(app.getAppPath(), "config.json"), "utf-8"));

function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 1280,
    show: false,
    autoHideMenuBar: true
  });

  mainWindow.maximize();
  mainWindow.show();
  mainWindow.loadURL(`https://truckershub.kaanlikescoding.me/auth/login/${token}?shifter=${shifter}`);
}
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
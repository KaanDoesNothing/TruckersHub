import { app, BrowserWindow } from "electron";
import * as path from "path";

import { configExists, getConfig, makeSureInstalled, setConfig } from "./utils";

let isRunning = false;

async function createWindow() {
  console.time("Downloading dll");
  await makeSureInstalled().catch(err => console.log("Game running"));
  console.timeEnd("Downloading dll");

  let url = "https://truckershub.kaanlikescoding.me";
  const version = "0.1";

  if(configExists()) {
    const config = getConfig();
    url+= `/auth/login/${config.token}`;
  }

  url+= `?version=${version}`;

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
  mainWindow.loadURL(url);

  try {
    mainWindow.webContents.debugger.attach('1.3');
  } catch (err) {
    console.log('Debugger attach failed: ', err);
  }
  
  mainWindow.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to: ', reason);
  });
  
  mainWindow.webContents.debugger.on('message', (event, method, params) => {
    if (method === 'Network.responseReceived') {
      mainWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(function(response) {
        try {
          const res = JSON.parse(response.body);
          const exists = configExists();
          if(!exists) {
            if(res?.data?.user?.token) {
              setConfig(JSON.stringify({token: res.data.user.token, shifter: false, api: "https://socket.truckershub.kaanlikescoding.me/api"}));
              if(!isRunning) {
                import("./game");
                isRunning = true
              }
            }
          }else {
            if(!isRunning) {
              import("./game");
              isRunning = true
            }
          }
        }catch(err) {
          // console.log(err);
        }
      });
    }
  })
    
  mainWindow.webContents.debugger.sendCommand('Network.enable');
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
import { app, BrowserWindow, nativeTheme } from "electron";
import * as path from "path";

import { configExists, getConfig, makeSureInstalled, setConfig } from "./utils";

let isRunning = false;

// let url = "https://truckershub.kaanlikescoding.me";
let url = "http://localhost:3000";
const version = "0.1";

if(configExists()) {
  const config = getConfig();
  console.log(config);
  url+= `/auth/login?token=${config.token}`;
}

// url+= `?version=${version}`;

console.log(url);

async function createWindow() {
  console.time("Downloading dll");
  try {
    // await makeSureInstalled().catch(err => console.log("Game running"));
  }catch(err) {
    console.log(err);
  }
  console.timeEnd("Downloading dll");
  const mainWindow = new BrowserWindow({
    height: 720,
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      // sandbox: true
    },
    width: 1280,
    show: false,
    autoHideMenuBar: true
  });

  mainWindow.maximize();
  mainWindow.show();
  mainWindow.loadURL(url);

  nativeTheme.themeSource = "dark";

  try {
    mainWindow.webContents.debugger.attach('1.3');
  } catch (err) {
    console.log('Debugger attach failed: ', err);
  }
  
  mainWindow.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to: ', reason);
  });

  mainWindow.webContents.debugger.sendCommand('Network.enable').catch(err => {
    
  });
  
  mainWindow.webContents.debugger.on('message', (event, method, params) => {
    if (method === 'Network.responseReceived') {
      mainWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(async (response) => {
        try {
          if(isRunning) return;

          let res;

          try {
            res = JSON.parse(response.body);
          }catch(err) {
            
          }

          
          console.log(typeof response.body);
          // const res = JSON.parse(response.body);
          if(!res?.data?.user) return;
          console.log("User detected");
          const exists = configExists();
          setConfig(JSON.stringify({token: res.data.user.token, shifter: res.data.user.settings?.shifter, api: "http://localhost:7998/api"}));
          // setConfig(JSON.stringify({token: res.data.user.token, shifter: res.data.user.settings?.shifter, api: "https://socket.truckershub.kaanlikescoding.me/api"}));
          console.log("Importing game");
          await import("./game").catch(err => console.log(err));
          isRunning = true
          // if(!exists) {
          //   if(res?.data?.user?.token) {
          //     setConfig(JSON.stringify({token: res.data.user.token, shifter: false, api: "https://socket.truckershub.kaanlikescoding.me/api"}));
          //     if(!isRunning) {
          //       import("./game").catch(err => console.log(err));
          //       isRunning = true
          //     }
          //   }
          // }else {
          //   if(!isRunning) {
          //     import("./game").catch(err => console.log(err));
          //     isRunning = true
          //   }
          // }
        }catch(err) {
          console.log(err);
        }
      });
    }
  })
    
  // mainWindow.webContents.debugger.sendCommand('Network.enable');
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
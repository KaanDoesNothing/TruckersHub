import SocketIO from "socket.io";
import {presetHandler} from "./presets";
import { GearPreset, GearPresetResult } from "./types";

const game_data = new Map();
const handling = new Map();
const sockets = new Map();

let server: SocketIO.Server;

const sleep = (time: number) => new Promise(r => setTimeout(r, time));;

function getHandling({id}: {id: string}) {
    return handling.get(id) || false;
}

function setHandling({id, value}: {id: string, value: boolean}) {
    return handling.set(id, value);
}

function getGameData({id}: {id: string}) {
    return game_data.get(id) || false;
}

function setGameData({id, value}: {id: string, value: boolean}) {
    return game_data.set(id, value);
}
function waitForShift({id}: {id: string}) {
    return new Promise((resolve, reject) => {
        const client = sockets.get(id);

        const callback = (msg: any) => {
            if(msg.type === "gear_change") {
                client.removeListener("message", callback);
                resolve("Received");
            }
        }
    
        client.on("message", callback);
    });
}

async function ensureGear({id, gear}: {id: string, gear: number}) {
    const gameData = getGameData({id});

    const currentGear = gameData.truck.transmission.gear.displayed;
    const pitch = gameData.truck.orientation.pitch;

    const gearsToShift = currentGear - gear;
    const fixedNumber = parseInt(gearsToShift.toString().replace("-", ""));

    if(fixedNumber === 0) return;
    if(gearsToShift === 0) return;

    server.sockets.to(id).emit("message", {type: "log", content: `Shifting ${fixedNumber} Gears.`});

    if(gearsToShift > 0) {
        for (let i = 0; i < gearsToShift; i++) {
            server.sockets.to(id).emit("message", {type: "log", content: `Shifting Down to ${currentGear - i - 1}th gear.`});
            server.sockets.to(id).emit("message", {type: "shift_down"});
        }
    }else {
        for (let i = 0; i < fixedNumber; i++) {
            if(pitch > 0.018 || gameData.controls.input.throttle < 75) {
                return;
            }
            server.sockets.to(id).emit("message", {type: "log", content: `Shifting Up to ${currentGear + i - 1}th gear.`});
            server.sockets.to(id).emit("message", {type: "shift_up"});
        }
    }

    await Promise.race([waitForShift({id}), sleep(2000)]);
}

async function handle({id}: {id: string}) {
    const gameData = getGameData({id});
    if(!gameData) return;

    const isPaused = gameData.game.paused;
    if(isPaused) return;

    const truckData = gameData.truck;
    const gear = truckData.transmission.gear.displayed;
    const speed = truckData.speed.kph;

    if(gear < 0) return;

    const preset: GearPreset = presetHandler(gameData);
    const gearToShift: GearPresetResult = preset(speed);

    if(gearToShift) {
        await ensureGear({id, gear: gearToShift});
        server.sockets.to(id).emit("message", {type: "preset_current", content: preset.name});
    }
}

export const launchShifter = (socketServer: SocketIO.Server) => {
    server = socketServer;
    
    server.on("connection", (client) => {
        const id = client.id;

        sockets.set(id, client);

        client.on("message", async (msg) => {
            if(msg.type === "game_data") {
                if(getHandling({id})) return;
        
                setGameData({id, value: msg.content});
                setHandling({id, value: true});
        
                await handle({id});
        
                setHandling({id, value: false});
            }
        });
        
        console.log("Connected");
    });
}
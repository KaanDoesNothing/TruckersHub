import SocketIO from "socket.io";
import { Event } from "../entities/event";
import { User } from "../entities/user";
import {presetHandler} from "./presets";
import { GearPreset, GearPresetResult, GetMap, SetBooleanMap } from "./types";

export const game_data = new Map();
export const handling = new Map();
export const sockets = new Map();
export const lastGear = new Map();

let server: SocketIO.Namespace;

const sleep = (time: number) => new Promise(r => setTimeout(r, time));;

export function getSocketByName({username}: {username: string}) {
    const keys = sockets.entries();

    for (let [key, value] of keys) {
        if(value.username === username) return value;
    }
}

export function getHandling({id}: GetMap) {
    return handling.get(id) || false;
}

export function setHandling({id, value}: SetBooleanMap) {
    return handling.set(id, value);
}

export function getLastGear({id}: GetMap) {
    return lastGear.get(id) || false;
}

export function setLastGear({id, value}: SetBooleanMap) {
    return lastGear.set(id, value);
}

function getGameData({id}: GetMap) {
    return game_data.get(id) || false;
}

function setGameData({id, value}: {id: string, value: any}) {
    return game_data.set(id, value);
}

function waitForShift({id}: {id: string}) {
    return new Promise((resolve, reject) => {
        const client = sockets.get(id).client;

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
    const socketSettings = sockets.get(id).settings;

    const currentGear = gameData.truck.transmission.gear.displayed;
    const pitch = gameData.truck.orientation.pitch;

    const gearsToShift = currentGear - gear;
    const fixedNumber = parseInt(gearsToShift.toString().replace("-", ""));

    if(fixedNumber === 0 || gearsToShift === 0) return;

    server.sockets.get(id)?.emit("message", {type: "log", content: `Shifting ${fixedNumber} Gears.`});

    console.log(gearsToShift, fixedNumber);

    if(gearsToShift > 0) {
        server.sockets.get(id)?.emit("message", {type: "shift_down", amount: gearsToShift});
    }else {
        if(pitch > 0.018 && socketSettings.hill_detection || gameData.controls.input.throttle < 0.75 && socketSettings.hold_gear) {
            return;
        }
        
        server.sockets.get(id)?.emit("message", {type: "shift_up", amount: fixedNumber});
    }

    await Promise.race([waitForShift({id}), sleep(2000)]);
}

async function handle({id}: {id: string}) {
    const gameData = getGameData({id});
    if(!gameData) return;

    const isPaused = gameData.game.paused;
    const isSocketPaused = sockets.get(id).settings.paused;

    if(isPaused || isSocketPaused) return;

    const truckData = gameData.truck;
    const gear = truckData.transmission.gear.displayed;
    const speed = truckData.speed.kph;

    if(gear < 0) return;

    const preset: GearPreset = presetHandler(gameData);
    const gearToShift: GearPresetResult = preset(speed);

    if(gearToShift) {
        await ensureGear({id, gear: gearToShift});
        server.sockets.get(id)?.emit("message", {type: "preset_current", content: preset.name});
    }
}

export const launchShifter = (socketServer: SocketIO.Server) => {
    server = socketServer.of("/client");
    
    server.on("connection", async (client) => {
        const username: User["username"] = await new Promise((resolve) => {
            client.once("authenticate", async (msg) => {
                const user = await User.findOne({where: {token: msg.content}});

                if(!user) return;

                client.emit("authenticated", {content: true});

                console.log(`${user.username} connected via client`);

                resolve(user.username);
            });
        });

        const id = client.id;

        sockets.set(id, {client, username, settings: {paused: false, hill_detection: true, hold_gear: true}});

        client.on("message", async (msg) => {
            if(msg.type === "game_data") {
                if(getHandling({id})) return;
        
                setGameData({id, value: msg.content});
                setHandling({id, value: true});
        
                await handle({id});
        
                setHandling({id, value: false});
            }
        });

        client.on("event_create", async (data) => {
            const {event} = data;
        
            const author = await User.findOne({where: {username}, relations: {events: true}});
            if(!author) {
                return;
            }
        
            const newEvent = Event.create({type: event.type, data: event.data});
        
            await newEvent.save();
        
            author.events.push(newEvent);
        
            await author.save();
        
            client.emit("message", {type: "log", content: "Event was saved to the database!"});
        });

        client.on("disconnect", () => {
            game_data.delete(id);
            handling.delete(id);
            sockets.delete(id);
        });
    });
}
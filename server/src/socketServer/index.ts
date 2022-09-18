import SocketIO from "socket.io";
import { Event } from "../entities/event";
import { User } from "../entities/user";
import {presetHandler} from "./presets";
import { GearPreset, GearPresetResult } from "./types";

export const game_data = new Map();
export const handling = new Map();
export const sockets = new Map();

let server: SocketIO.Server;

const sleep = (time: number) => new Promise(r => setTimeout(r, time));;

export function getSocketByName({username}: {username: string}) {
    const keys = sockets.entries();

    for (let [key, value] of keys) {
        if(value.username === username) return value;
    }
}

export function getHandling({id}: {id: string}) {
    return handling.get(id) || false;
}

export function setHandling({id, value}: {id: string, value: boolean}) {
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
            if(pitch > 0.018 || gameData.controls.input.throttle < 0.75) {
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
    const isSocketPaused = sockets.get(id).paused;

    if(isPaused || isSocketPaused) return;

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
    
    server.on("connection", async (client) => {
        const username: User["username"] = await new Promise((resolve) => {
            client.once("authenticate", async (msg) => {
                const user = await User.findOne({where: {token: msg.content}});

                if(!user) return;

                client.emit("authenticated", {content: true});

                console.log(`${user.username} connected`);

                resolve(user.username);
            });
        });

        const id = client.id;

        sockets.set(id, {client, username, paused: false});

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
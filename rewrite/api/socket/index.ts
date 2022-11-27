import { Namespace, Server, Socket } from "https://deno.land/x/socket_io/mod.ts";
import { CacheExpireDate } from "../constants.ts";
import { cacheInstance } from "../lib/cache.ts";
import { Event, User } from "../lib/db.ts";
import {presetHandler} from "./presets.ts";
import { GearPreset, GearPresetResult, GetMap, SetBooleanMap } from "./types.ts";

cacheInstance.flushall();

export const game_data = new Map();
export const handling = new Map();
export const sockets = new Map();

let server: Namespace;

const sleep = (time: number) => new Promise(r => setTimeout(r, time));;

export function getSocketByName({username}: {username: string}) {
    const keys = sockets.entries();

    for (let [key, value] of keys) {
        if(value.user.username === username) return value;
    }
}

export function getHandling({id}: GetMap) {
    return handling.get(id) || false;
}

export function setHandling({id, value}: SetBooleanMap) {
    return handling.set(id, value);
}

async function getGameData({id}: GetMap) {
    const data = await cacheInstance.get(`gamedata_${sockets.get(id).user.username}`);
    if(data) return JSON.parse(data as string);
}

async function setGameData({id, value}: {id: string, value: any}) {
    const keyname = `gamedata_${sockets.get(id).user.username}`;
    await cacheInstance.set(keyname, JSON.stringify(value));
    await cacheInstance.expireat(`gamedata_${sockets.get(id).user.username}`, (Date.now() + CacheExpireDate).toString());
}

function waitForShift({id}: {id: string}) {
    return new Promise((resolve, reject) => {
        const client: Socket = sockets.get(id).client;

        const callback = (msg: any) => {
            if(msg.type === "gear_change") {
                client.once("message", callback);
                resolve("Received");
            }
        }
    
        client.on("message", callback);
    });
}

async function ensureGear({id, gear}: {id: string, gear: number}) {
    const gameData = await getGameData({id});
    if(!gameData) return;
    
    const socketSettings = sockets.get(id).settings;

    const currentGear = gameData.truck.transmission.gear.displayed;
    const pitch = gameData.truck.orientation.pitch;

    const gearsToShift = currentGear - gear;
    const fixedNumber = parseInt(gearsToShift.toString().replace("-", ""));

    if(fixedNumber === 0 || gearsToShift === 0) return;

    server.sockets.get(id)?.emit("message", {type: "log", content: `Shifting ${fixedNumber} Gears.`});

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
    const gameData = await getGameData({id});
    if(!gameData) return;

    const isPaused = gameData.game.paused;
    const isSocketPaused = sockets.get(id).settings.paused;

    if(isPaused || isSocketPaused) return;

    const truckData = gameData.truck;
    const gear = truckData.transmission.gear.displayed;
    const speed = truckData.speed.kph;

    // if(gameData.controls.input.throttle === 1 && gameData.truck.brakes.parking && gear < 0) {
    //     let socket = sockets.get(id);

    //     socket.settings.rpm_shift = !socket.settings.rpm_shift;

    //     sockets.set(id, socket);

    //     await sleep(2000);

    //     console.log(socket.settings.rpm_shift);
    // } 

    if(gear < 0) return;

    let socket = sockets.get(id);

    // if(socket.settings.rpm_shift) {
    //     let gearToShift;

    //     if(truckData.engine.rpm.value < 1000) {
    //         gearToShift = gear - 1;
    //     }else if(truckData.engine.rpm.value > 1600) {
    //         gearToShift = gear + 1;
    //     }

    //     if(gearToShift) {
    //         await ensureGear({id, gear: gearToShift});
    //         server.sockets.get(id)?.emit("message", {type: "preset_current", content: "RPM SHIFT"});
    //     }
        
    //     return;
    // }

    const preset: GearPreset = presetHandler(gameData);
    const gearToShift: GearPresetResult = preset(speed);

    if(gearToShift) {
        await ensureGear({id, gear: gearToShift});
        server.sockets.get(id)?.emit("message", {type: "preset_current", content: preset.name});
    }
}

export const launchSocket = (socketServer: Server) => {
    server = socketServer.of("/client");
    
    server.on("connection", async (client) => {
        const userData: any = await new Promise((resolve) => {
            client.once("authenticate", async (msg) => {
                const user = await User.findOne({token: msg.content});

                if(!user) return;

                client.emit("authenticated", {content: true});

                console.log(`${user.username} connected via client`);

                resolve(user);
            });
        });

        const id = client.id;

        sockets.set(id, {client, user: userData, settings: {paused: false, hill_detection: true, hold_gear: true, rpm_shift: false}});

        client.on("message", async (msg) => {
            if(msg.type === "game_data") {
                if(getHandling({id})) return;
        
                setHandling({id, value: true});
    
                await setGameData({id, value: msg.content});
                await handle({id});
        
                setHandling({id, value: false});
            }
        });

        client.on("event_create", async (data) => {
            const {event} = data;
        
            await Event.create({author: userData.username, type: event.type, data: event.data});
        
            client.emit("message", {type: "log", content: "Event was saved to the database!"});
        });

        client.on("disconnect", () => {
            game_data.delete(id);
            handling.delete(id);
            sockets.delete(id);
        });
    });
}
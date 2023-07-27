import { EventEmitter } from "https://deno.land/std@0.90.0/node/events.ts";
import { Socket } from "socketIO/mod.ts";
import { setGameData } from "./cache.ts";
import { presetHandler } from "./presets.ts";
import { GearPreset, GearPresetResult } from "./types.ts";
import { log } from "../lib/logger.ts";
import { sleep } from "./index.ts";
import { iUser } from "../lib/schemas.ts";
import { Event, convertEvent, processedEvent } from "../lib/db.ts";
import { tst } from "../deps.ts";

interface socketConfig {
    paused: boolean;
    hill_detection: boolean;
    hold_gear: boolean;
    rpm_shift: boolean;
}

export class playerHandler extends EventEmitter {
    socket: Socket;
    config: socketConfig;
    userData: iUser;
    gameData: tst.TelemetryData;
    timers: any;
    handling: boolean;

    constructor({socket, userData}: {socket: Socket, userData: iUser}) {
        super();
        this.userData = userData;

        this.socket = socket;
        // this.gameData = {};
        this.config = {paused: false, hill_detection: true, hold_gear: true, rpm_shift: false};

        this.handling = false;

        this.socket.on("game_data", (msg) => this.eventGameData(msg));
        this.socket.on("event_create", (data) => this.createEventData(data));

        this.timers = {};
    }

    waitForShift({gearToShift}: {gearToShift: number}) {
        return new Promise((resolve) => {
            const callback = (msg: {selected: number}) => {
                if(gearToShift === msg.selected) {
                    resolve("Received");
                    this.removeListener("gear_change", callback);
                }
            }
        
            this.on("gear_change", callback);
        });
    }

    async ensureGear({gear}: {gear: number}) {
        const currentGear = this.gameData.truck.transmission.gear.displayed;
        const pitch = this.gameData.truck.orientation.pitch;
    
        const gearsToShift = currentGear - gear;
        const fixedNumber = parseInt(gearsToShift.toString().replace("-", ""));
    
        if(fixedNumber === 0 || gearsToShift === 0) return;
    
        this.socket.emit("message", {type: "log", content: `Shifting ${fixedNumber} Gears.`});
    
        if(gearsToShift > 0) {
            this.socket.emit("key", {key: "down", amount: gearsToShift});
        }else {
            if(pitch > 0.018 && this.config.hill_detection || this.gameData.controls.input.throttle < 0.75 && this.config.hold_gear) {
                return;
            }
            
            this.socket.emit("key", {key: "up", amount: fixedNumber});
        }
    
        await Promise.race([this.waitForShift({gearToShift: fixedNumber}), sleep(2000)]);
    }

    isPaused(): boolean {
        const isPaused = this.gameData.game.paused;
        const isSocketPaused = this.config.paused;
    
    
        if(isPaused || isSocketPaused) return true;
        return false;
    }

    getHandling() {
        return this.handling;
    }

    setHandling(val: boolean) {
        this.handling = val;
    }

    async handle() {
        if(this.isPaused() || !this.gameData) return;
    
        const truckData = this.gameData.truck;
        const gear = truckData.transmission.gear.displayed;
        const speed = truckData.speed.kph;
        const roundSpeed = Math.round(speed);
        const brakePower = this.gameData.controls.input.brake;
        const _throttlePower = this.gameData.controls.input.throttle;
    
        if(gear < 0) return;
    
        const airRefil = false;
    
        if(brakePower > 0.2 && roundSpeed === 0 && truckData.engine.enabled && !truckData.brakes.parking.enabled) {
            if(!this.timers["brakeEnginePower"]) {
                this.timers["brakeEnginePower"] = setTimeout(() => {
                    this.socket.emit("key", {key: "e", amount: 1});
                }, 500);
            }
        }else {
            if(this.timers["brakeEnginePower"]) {
                clearTimeout(this.timers["brakeEnginePower"]);
                delete this.timers["brakeEnginePower"];
            }
        }
    
        const preset: GearPreset = presetHandler(this.gameData);
        const gearToShift: GearPresetResult = airRefil ? 1 : preset(speed);
    
        if(gearToShift) {
            log("message", `Shifting Gear for ${this.userData.username}, preset: ${preset.name}, Gear: ${gearToShift}`);
            await this.ensureGear({gear: gearToShift});
            this.socket.emit("message", {type: "preset_current", content: preset.name});
        }
    }

    async eventGameData(msg: any) {
        if(this.gameData?.truck) {
            if(this.gameData.truck.transmission.gear.selected !== msg.content.truck.transmission.gear.selected) {
                this.emit("gear_change", msg.content.truck.transmission.gear);
            }
        }

        if(this.handling || !this.userData.username) return;

        this.handling = true;

        await setGameData({username: this.userData.username, value: msg.content});
        this.gameData = msg.content;

        await this.handle();

        this.handling = false;
    }

    async createEventData(data: any) {
        const {event} = data;
        
        const eventRes = await Event.create({author: this.userData.username, type: event.type, data: event.data});
        const converted = convertEvent(eventRes);
        if(converted) await processedEvent.create({author: this.userData.username, type: event.type, data: converted});
    
        this.socket.emit("message", {type: "log", content: "Event was saved to the database!"});
    }
}
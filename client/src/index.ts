import fs from "fs";
import axios from "axios";
import SocketIO from "socket.io-client";
import tst, {EventFerry, EventsFine, EventsJobDeliveredVerbose, EventsRefuelPaid, EventTollgate, EventTrain, Trailer, TruckDamage} from "trucksim-telemetry";
import robotjs from "robotjs";
import blessed from "blessed";
import contrib from "blessed-contrib";

const {api, token, shifter} = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
if(!api || !token) console.log("Invalid config file.");

let cache = {
    preset_current: "Unknown"
}

let gameData: any = undefined;

const screen = blessed.screen({title: "Client", smartCSR: true});
const client = SocketIO(api.replace("/api", ""));
const tsclient = tst();

function handleEvent({type, data}: {type: string, data: any}) {
    client.emit("event_create", {token, event: {type, data: {event: data, game: tsclient.getData()}}});
}

tsclient.job.on("delivered", (data: EventsJobDeliveredVerbose) => {
    handleEvent({type: "delivered", data});
});

tsclient.game.on("refuel-paid", (data: EventsRefuelPaid) => {
    handleEvent({type: "refuel-paid", data});
});

tsclient.game.on("ferry", (data: EventFerry) => {
    handleEvent({type: "ferry", data});
});

tsclient.game.on("train", (data: EventTrain) => {
    handleEvent({type: "train", data});
});

tsclient.game.on("fine", (data: EventsFine) => {
    handleEvent({type: "fine", data});
});

tsclient.game.on("tollgate", (data: EventTollgate) => {
    handleEvent({type: "tollgate", data});
});

tsclient.truck.on("damage", (current: TruckDamage, previous: TruckDamage) => {
    handleEvent({type: "truck_damage", data: {current, previous}});
});

tsclient.trailer.on("damage", (current: TruckDamage, previous: TruckDamage) => {
    handleEvent({type: "trailer_damage", data: {current, previous}});
});

const statistics = blessed.box({
    label: "Statistics",
    fg: "cyan",
    border: {type: "line"},
    content: ``
});

const log = contrib.log({
    label: "Log",
    fg: "cyan",
    top: 40,
    border: {type: "line"}
});

screen.append(statistics);
screen.append(log);
screen.render();

function renderStats() {
    statistics.setContent(`Engine: ${gameData.truck.engine.enabled ? "On" : "Off"}\nSpeed: ${gameData.truck.speed.kph}\nRPM: ${gameData.truck.engine.rpm.value.toFixed()}\nCurrent Pitch: ${gameData.truck.orientation.pitch}\nCurrent Gear: ${gameData.truck.transmission.gear.displayed}\nThrottle: ${gameData.controls.input.throttle}\nPreset: ${cache.preset_current}\nClimbing: ${gameData.truck.orientation.pitch > 0.018}`);
    screen.render();
}

tsclient.watch({interval: 10}, (data) => {
    if(shifter) {
        client.emit("message", {type: "game_data", content: data});
    }

    gameData = data;

    renderStats();
});

if(shifter) {
    tsclient.truck.on("gear-change", (current: number) => {
        client.emit("message", {type: "gear_change", content: current});
    
        log.log("Finished shifting");
    });
    
    client.on("message", (msg) => {
        if(msg.type === "log") {
            log.log(msg.content)
        }else if(msg.type === "shift_up") {
            log.log("Has to shift up");
            for (let i = 0; i < msg.amount; i++) {
                robotjs.keyTap("down");
            }
        }else if(msg.type === "shift_down") {
            log.log("Has to shift down");
            for (let i = 0; i < msg.amount; i++) {
                robotjs.keyTap("down");
            }
        }else if(msg.type === "preset_current") {
            cache.preset_current = msg.content;
        }
    });
}

client.on("connect", () => {
    client.emit("authenticate", {content: token});

    log.log("Connecting to TruckersHub");
});

client.on("authenticated", (msg) => {
    if(msg.content) {
        log.log("Connected to TruckersHub");
    }
});
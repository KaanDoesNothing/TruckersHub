import fs from "fs";
import axios from "axios";
import SocketIO from "socket.io-client";
import tst, {EventsJobDeliveredVerbose} from "trucksim-telemetry";
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

tsclient.job.on("delivered", (data: EventsJobDeliveredVerbose) => {
    console.log(data);
    axios.post(`${api}/event/create`, {token, event: {type: "delivered", data}}).then(res => console.log(res.data));
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
    statistics.setContent(`Engine: ${gameData.truck.engine.enabled ? "On" : "Off"}\nSpeed: ${gameData.truck.speed.kph}\nRPM: ${gameData.truck.engine.rpm.value.toFixed()}\nCurrent Pitch: ${gameData.truck.orientation.pitch}\nCurrent Gear: ${gameData.truck.transmission.gear.displayed}\nPreset: ${cache.preset_current}\nClimbing: ${gameData.truck.orientation.pitch > 0.018}`);
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
            robotjs.keyTap("up");
        }else if(msg.type === "shift_down") {
            log.log("Has to shift down");
            robotjs.keyTap("down");
        }else if(msg.type === "preset_current") {
            cache.preset_current = msg.content;
        }
    });
}

client.on("connect", () => {
    log.log("Connected to TruckersHub");
});
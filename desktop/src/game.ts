import SocketIO from "socket.io-client";
import tst, {EventFerry, EventsFine, EventsJobDeliveredVerbose, EventsRefuelPaid, EventTollgate, EventTrain, TruckDamage} from "trucksim-telemetry";
import * as robotjs from "robotjs";
import { getConfig } from "./utils";

const {api, token, shifter} = getConfig();
console.log(api);
if(!api || !token) console.log("Invalid config file.");

let cache = {
    preset_current: "Unknown"
}

let gameData: any = undefined;

const client = SocketIO(api.replace("/api", "/client"));
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

tsclient.watch({interval: 10}, (data) => {
    if(shifter) {
        client.emit("message", {type: "game_data", content: data});
    }

    gameData = data;
});

if(shifter) {
    tsclient.truck.on("gear-change", (current: number) => {
        client.emit("message", {type: "gear_change", content: current});
    });
    
    client.on("message", (msg) => {
        if(msg.type === "log") {
            
        }else if(msg.type === "shift_up") {
            for (let i = 0; i < msg.amount; i++) {
                robotjs.keyTap("up");
            }
        }else if(msg.type === "shift_down") {
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
});

client.on("authenticated", (msg) => {
    if(msg.content) {
    }
});
import tst, { EventsJobDeliveredVerbose } from "trucksim-telemetry";
import fs from "fs";
import axios from "axios";

const {api, token} = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
if(!api || !token) console.log("Invalid config file.");

console.log("Running!");

const client = tst();

client.watch();

client.job.on("delivered", (data: EventsJobDeliveredVerbose) => {
    console.log(data);
    axios.post(`${api}/event/create`, {token, event: {type: "delivered", data}}).then(res => console.log(res.data));
});
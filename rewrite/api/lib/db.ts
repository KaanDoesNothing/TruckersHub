import mongoose from "npm:mongoose";
import config from "../config.ts";

//@ts-ignore
mongoose.connect(config.api.mongodb, {dbName: "TruckersHub"}, () => {
    console.log("Ready");
})

const UserSchema = new mongoose.Schema({
    token: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    linked: {
        steam: {
            id: {type: String, required: false},
        },
        truckersmp: {}
    }
}, {timestamps: true});

const EventSchema = new mongoose.Schema({
    author: {type: String, required: true},
    type: {type: String, required: true},
    data: {}
}, {timestamps: true});

export const User = mongoose.model("User", UserSchema);
export const Event = mongoose.model("Event", EventSchema);
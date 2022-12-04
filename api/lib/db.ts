import mongoose from "npm:mongoose";
import {applySpeedGooseCacheLayer, SpeedGooseCacheAutoCleaner} from "npm:speedgoose";
import config from "../config.ts";

await applySpeedGooseCacheLayer(mongoose, {redisUri: "localhost:6379"});

//@ts-ignore
mongoose.connect(config.api.mongodb, {dbName: "TruckersHub"}, () => {
    console.log("Ready");
});

export interface iUser {
    token: string;
    username: string;
    password: string;
    linked: {
        steam?: {
            id?: string;
        },
        truckersmp? :any;
    },
    createdAt: Date;
    updatedAt: Date;
}

export interface iEvent {
    author: iUser["username"];
    type: string;
    data: any;
}

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

UserSchema.plugin(SpeedGooseCacheAutoCleaner);

// EventSchema.index({author: 1, type: 1});

export const User = mongoose.model<iUser>("User", UserSchema);
export const Event = mongoose.model<iEvent>("Event", EventSchema);
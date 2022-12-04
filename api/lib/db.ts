import mongoose from "npm:mongoose";
import {applySpeedGooseCacheLayer, SpeedGooseCacheAutoCleaner} from "npm:speedgoose";
import config from "../config.ts";
import type {APICompany, APICompanyMembers} from "npm:@truckersmp_official/api-types";

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

export interface iVTC {
    info: APICompany,
    members: APICompanyMembers["members"],
    setings: {hidden: boolean};
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

const VTCSchema = new mongoose.Schema({
    info: {},
    members: {},
    settings: {
        hidden: Boolean
    }
}, {timestamps: true});

UserSchema.plugin(SpeedGooseCacheAutoCleaner);

// EventSchema.index({author: 1, type: 1});

export const User = mongoose.model<iUser>("User", UserSchema);
export const Event = mongoose.model<iEvent>("Event", EventSchema);
export const VTC = mongoose.model<iVTC>("VTC", VTCSchema);
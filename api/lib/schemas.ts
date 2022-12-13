import type {APICompany, APICompanyMembers} from "npm:@truckersmp_official/api-types";
import mongoose from "npm:mongoose";

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
    createdAt: Date;
    updatedAt: Date;
}

export interface iVTC {
    info: APICompany,
    members: APICompanyMembers["members"],
    setings: {hidden: boolean};
}

export const UserSchema = new mongoose.Schema({
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

export const EventSchema = new mongoose.Schema({
    author: {type: String, required: true},
    type: {type: String, required: true},
    data: {}
}, {timestamps: true});

export const VTCSchema = new mongoose.Schema({
    info: {},
    members: {},
    settings: {
        hidden: Boolean
    }
}, {timestamps: true});
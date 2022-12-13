import mongoose from "npm:mongoose";
import {applySpeedGooseCacheLayer, SpeedGooseCacheAutoCleaner, SharedCacheStrategies} from "npm:speedgoose";

import { config } from "https://deno.land/x/dotenv/mod.ts";

import type {APICompany, APICompanyMembers} from "npm:@truckersmp_official/api-types";
import { iEventDelivered, iEventFine, iEventFuel, iEventTollgate } from "../../frontend/types.ts";

await applySpeedGooseCacheLayer(mongoose, {sharedCacheStrategy: SharedCacheStrategies.IN_MEMORY});

//@ts-ignore
mongoose.connect(config().MONGODB, {dbName: "TruckersHub"}, () => {
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
    createdAt: Date;
    updatedAt: Date;
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
export const processedEvent = mongoose.model<iEvent>("processedEvent", EventSchema);
export const VTC = mongoose.model<iVTC>("VTC", VTCSchema);

export const convertEvent = (row: iEvent) => {
    if(!row.data.game) return;
    const type = row.type;

    if(type === "delivered") {
        const data: iEventDelivered = {
            revenue: row.data.event.revenue,
            distance: row.data.event.distance.km,
            cargo: row.data.event.cargo.name,
            from: {
                city: row.data.event.source.city.name,
                company: row.data.event.source.company.name
            },
            to: {
                city: row.data.event.destination.city.name,
                company: row.data.event.destination.company.name
            }
        }
        
        return data;
    }else if(type === "fine") {
        const data: iEventFine = {
            reason: row.data.event.offence.name,
            location: row.data.game.truck.position,
            price: row.data.event.amount
        }

        return data;
    }else if(type === "refuel-paid") {
        const data: iEventFuel = {
            location: row.data.game.truck.position,
            amount: Math.round(row.data.event.amount),
            price: Math.round(row.data.event.amount)
        }

        return data;
    }else if(type === "tollgate") {
        const data: iEventTollgate = {
            location: row.data.game.truck.position,
            price: row.data.event.amount
        }

        return data;
    }
}

// console.time("test");
// const rows = await Event.find();
// console.timeEnd("test");
// const rows = await Event.find();

// await Promise.all(rows.map(async row => {
//     const converted = convertEvent(row);

//     if(converted) await processedEvent.create({author: row.author, type: row.type, createdAt: row.createdAt, data: converted});
// }));

// console.log("Done");
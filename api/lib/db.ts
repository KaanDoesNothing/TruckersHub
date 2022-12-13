import {mongoose, config} from "../deps.ts";

import { iEventDelivered, iEventFine, iEventFuel, iEventTollgate } from "../../frontend/types.ts";
import { EventSchema, iEvent, iUser, iVTC, UserSchema, VTCSchema } from "./schemas.ts";

//@ts-ignore
mongoose.connect(config().MONGODB, {dbName: "TruckersHub"}, () => {
    console.log("Ready");
});

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
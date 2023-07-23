import { Router } from "oak/mod.ts";
import { getQuery } from "oak/helpers.ts";
import { User, VTC, processedEvent } from "../lib/db.ts";
import { getPlayerServer, getVTC } from "../utils/game.ts";

export const VTCRouter = new Router();

VTCRouter.post("/vtc", async (ctx) => {
    const {name} = await ctx.request.body({type: "json"}).value;

    if(!name) return ctx.response.body = {error: "No vtc id provided!"};

    const fetched = await getVTC(undefined, name);

    if(!fetched) return ctx.response.body = {error: "Error fetching vtc!"};

    const fetchedVTC = fetched.info;
    const fetchedMembers = fetched.members;
    const members: any = [];

    await Promise.all(fetchedMembers.map(async (member: any) => {
        const storedUser = await User.findOne({"linked.truckersmp.steamID64": member.steam_id});
        if(!storedUser) return;
        
        const storedEvents = await processedEvent.find({author: storedUser.username, type: "delivered"});

        member.registeredName = storedUser.username;
        
        if(storedUser) {
            let distance = 0;

            for (let i in storedEvents) {
                const event = storedEvents[i];

                distance += event.data.distance;
                // if(event.data.game) {
                //     distance += event.data.event.distance.km;
                // }else {
                //     distance += event.data.distance.km;
                // }
            }

            try {
                member.online = await getPlayerServer(storedUser.linked.truckersmp.name);
            }catch(err) {
                member.online = {error: "Unable to fetch"};
            }

            members.push({...member, deliveryCount: storedEvents.length, distanceTraveled: distance.toFixed(0)});
        }
    }));

    const response = {data: {vtc: fetchedVTC, members: members}};

    return ctx.response.body = response;
});

VTCRouter.get("/vtc/list", async (ctx) => {
    const {q} = getQuery(ctx);
    
    let VTCs = await VTC.find();
    
    if(q) VTCs = VTCs.filter(vtc => vtc.info.name.includes(q));

    const list = await Promise.all(VTCs.map((vtc) => {
        return {
            name: vtc.info.name,
            memberCount: vtc.info.members_count
        }
    }));

    ctx.response.body = {data: {list}};

    VTCs.forEach(async vtc => {
        await getVTC(vtc.info.id);
    })
});
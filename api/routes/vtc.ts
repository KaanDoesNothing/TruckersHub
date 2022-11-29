import { Router } from "https://deno.land/x/oak/mod.ts";
import { TRUCKERSMP_API } from "../constants.ts";
import { User, Event } from "../lib/db.ts";
import { getPlayerServer } from "../utils/game.ts";

export const VTCRouter = new Router();

VTCRouter.post("/vtc", async (ctx) => {
    const {name} = await ctx.request.body({type: "json"}).value;

    if(!name) return ctx.response.body = {error: "No vtc id provided!"};

    const storedVTC = await User.findOne({"linked.truckersmp.vtc.name": name});

    const fetched = await Promise.all([await (await (await fetch(`${TRUCKERSMP_API}/vtc/${storedVTC?.linked.truckersmp?.vtc.id}`)).json()).response, (await (await (await fetch(`${TRUCKERSMP_API}/vtc/${storedVTC?.linked.truckersmp.vtc.id}/members`)).json())).response.members]);
    const fetchedVTC = fetched[0];
    const fetchedMembers = fetched[1];
    const members: any = [];

    await Promise.all(fetchedMembers.map(async (member: any) => {
        const storedUser = await User.findOne({"linked.truckersmp.steamID64": member.steam_id});
        if(!storedUser) return;
        const storedEvents = await Event.find({author: storedUser?.username, type: "delivered"});

        member.registeredName = storedUser.username;
        
        if(storedUser) {
            let distance = 0;

            for (let i in storedEvents) {
                const event = storedEvents[i];

                if(event.data.game) {
                    distance += event.data.event.distance.km;
                }else {
                    distance += event.data.distance.km;
                }
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
    const names: string[] = (await User.distinct("linked.truckersmp.vtc.name")).filter(vtc => vtc.length > 0);

    const list = await Promise.all(names.map(async (name) => {
        return {
            name,
            memberCount: await User.count({"linked.truckersmp.vtc.name": name})
        }
    }));

    return ctx.response.body = {data: {list}};
});
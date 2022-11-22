import { Next } from "koa";
import koaRouter, { RouterContext } from "koa-router";
import { TRUCKERSMP_API } from "../constants";
import { mpProfile } from "../db/entities/mpProfile";
import { User } from "../db/entities/user";
import { closestCity } from "../game";

export const main = new koaRouter();

export const isUser = async (ctx: RouterContext, next: Next) => {
    const {token} = ctx.request.body as {token?: string};
    if(!token) return ctx.body = {error: "No token was provided!"};
    await next();
}

main.post("/token_valid", isUser, async (ctx) => {
    const {token} = ctx.request.body as {token: string};

    const user = await User.findOne({where: {token}, relations: {truckersmp: true}});

    if(!user) return ctx.body = {error: "Invalid token!"};

    ctx.body = {data: true};
});

main.post("/user", isUser, async (ctx) => {
    const {token} = ctx.request.body as {token: string};

    const user = await User.findOne({where: {token}, relations: {truckersmp: true}});

    if(!user) return ctx.body = {error: "Invalid token!"};

    ctx.body = {data: user};
});

main.post("/events", isUser, async (ctx) => {
    const {token, type} = ctx.request.body as {token: string, type: string};

    const user = await User.findOne({where: {token, events: {type}}, relations: {events: true}, order: {events: {createdAt: "DESC"}}});

    if(!user) return ctx.body = {error: "Invalid token!"};

    const events = user.events.map((row: any) => {
        if(!row.data.game) return row;

        row.data.location = closestCity(row.data.game.truck.position).realName;

        if(row.data.event.trailerID) {
            const clone = Object.assign({}, row);
            row.data.event.previous = clone.data.event.current;
            row.data.event.current = clone.data.event.trailerID;
        }

        return row;
    }).filter(row => row);

    ctx.body = {data: events};
});

main.post("/vtc", async (ctx) => {
    const {id} = ctx.request.body as {id?: string};
    if(!id) return ctx.body = {error: "No vtc id provided!"};

    const rawVTC = await mpProfile.createQueryBuilder("profile").where(`JSON_EXTRACT(profile.data, '$.vtc.name') = '${id}'`).getOne();
    if(!rawVTC) return;

    const fetched = await Promise.all([await (await (await fetch(`${TRUCKERSMP_API}/vtc/${rawVTC.data.vtc.id}`)).json()).response, (await (await (await fetch(`${TRUCKERSMP_API}/vtc/${rawVTC.data.vtc.id}/members`)).json())).response.members]);
    const fetchedVTC = fetched[0];
    const fetchedMembers = fetched[1];
    const members: any = [];

    await Promise.all(fetchedMembers.map(async (member: any) => {
        const user = await User.findOne({where: {steam_id: member.steam_id, events: {type: "delivered"}}, relations: {events: true}});

        if(user) {
            let distance = 0;

            for (let i in user.events) {
                const event = user.events[i];

                //@ts-ignore
                if(event.data.game) {
                    //@ts-ignore
                    distance += event.data.event.distance.km;
                }else {
                    //@ts-ignore
                    distance += event.data.distance.km
                }
            }

            members.push({...member, deliveryCount: user.events.length, distanceTraveled: distance});
        }
    }));

    return ctx.body = {data: {vtc: fetchedVTC, members: members}};
});

main.get("/vtc/list", async (ctx) => {
    const rawlist = await mpProfile.createQueryBuilder("profile").where("JSON_EXTRACT(profile.data, '$.vtc.inVTC') = 'true'").select(`DISTINCT TRIM(BOTH '"' FROM JSON_EXTRACT(profile.data, '$.vtc.name')) as vtc_name`).getRawMany();
    const list = await Promise.all(rawlist.map(async row => {
        row.memberCount = await mpProfile.createQueryBuilder("profile").where(`JSON_EXTRACT(profile.data, '$.vtc.name') = '${row.vtc_name}'`).getCount();

        return row;
    }));

    return ctx.body = {data: list};
});
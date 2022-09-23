import Axios from "axios";
import { Application } from "express";
import { mpProfile } from "../entities/mpProfile";
import { User } from "../entities/user";
import { isAuthenticated, requiresUser } from "../middleware";
import { getSocketByName } from "../socketServer";

export const routes = (app: Application) => {
    app.get("/api/session", requiresUser, async (req, res) => {
        if(res.locals.user) {
            return res.json(res.locals.user);
        }else {
            return res.json({error: true});
        }
    });

    app.get("/api/socket/settings", requiresUser, async (req, res) => {
        if(res.locals.user) {
            const socket = getSocketByName({username: res.locals.user.username});

            if(socket) return res.json({data: socket.settings});

            return res.json({error: "Client isn't connected."});
        }else {
            return res.json({error: true});
        }
    });

    app.get("/api/vtc/list", async (req, res) => {
        const rawlist = await mpProfile.createQueryBuilder("profile").where("JSON_EXTRACT(profile.data, '$.vtc.inVTC') = 'true'").select(`DISTINCT TRIM(BOTH '"' FROM JSON_EXTRACT(profile.data, '$.vtc.name')) as vtc_name`).getRawMany();
        const list = await Promise.all(rawlist.map(async row => {
            row.memberCount = await mpProfile.createQueryBuilder("profile").where(`JSON_EXTRACT(profile.data, '$.vtc.name') = '${row.vtc_name}'`).getCount();

            return row;
        }));

        return res.json({data: list});
    });

    app.get("/api/vtc/:id", async (req, res) => {
        const rawVTC = await mpProfile.createQueryBuilder("profile").where(`JSON_EXTRACT(profile.data, '$.vtc.name') = '${req.params.id}'`).getOne();
        if(!rawVTC) return;

        const fetched = await Promise.all([await (await Axios.get(`https://api.truckersmp.com/v2/vtc/${rawVTC.data.vtc.id}`)).data.response, (await Axios.get(`https://api.truckersmp.com/v2/vtc/${rawVTC.data.vtc.id}/members`)).data.response.members]);
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

        return res.json({data: {vtc: fetchedVTC, members: members}});
    });
}
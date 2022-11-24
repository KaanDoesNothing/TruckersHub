import koaRouter from "koa-router";
import { TRUCKERSMP_API, TruckersMP_krashnz, TRUCKERSMP_MAP } from "../constants";
import { User } from "../db/entities/user";
export const game = new koaRouter();

const getServers = async () => {
    const res = await (await fetch(`${TruckersMP_krashnz}/servers`)).json();

    return res;
}

const getPlayer = async ({id}: {id: string}) => {
    const res = await (await fetch(`${TRUCKERSMP_API}/player/${id}`)).json();

    return res;
}

const getPlayerServer = async ({id}: {id: string}) => {

}

game.get("/user/isTruckersmp/:username", async (ctx) => {
    const {username} = ctx.params;

    const playerSearch = await (await fetch(`${TRUCKERSMP_MAP}/playersearch?string=${username}`)).json();
    const isOnline = playerSearch.Data?.filter((player: any) => player.Name === username)[0];
    if(!isOnline) return ctx.body = {error: "Player isn't online!"}

    const servers = await getServers();
    console.log(servers)
    if(servers.error) {
        return ctx.body = {error: "Unknown"};
    }

    // console.log(isOnline.ServerId)

    const server = servers.servers.filter((server: any) => server.map === isOnline.ServerId)[0];

    console.log(server);

    return ctx.body = {
        data: {
            player: {
                username: isOnline.Name,
                id: isOnline.MpId,
                game_id: isOnline.PlayerId
            },
            server: {
                ...server
            }
        }
    }
    // console.log(player);
    // if(player.error) return ctx.body = {error: "Invalid steam id!"};

    // const servers = await getServers();
});
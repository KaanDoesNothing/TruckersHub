import koaRouter from "koa-router";
import { TRUCKERSMP_MAP } from "../constants";
import { getPlayerServer } from "../utils/game";
export const game = new koaRouter();

game.post("/game/getPlayerServer", async (ctx) => {
    const {username} = ctx.request.body as {username: string};

    return ctx.body = await getPlayerServer(username);
});

game.post("/game/getPlayersNearby", async (ctx) => {
    const {username, zoom} = ctx.request.body as {username: string, zoom?: string};

    const res = await getPlayerServer(username);

    if(res.error || !res.data) {
        return ctx.body = res;
    }

    const zoomout = parseInt(zoom as string) || 200;

    const playerLocation = res.data.player.location;
    const url = `${TRUCKERSMP_MAP}/area?x1=${playerLocation.x - zoomout}&y1=${playerLocation.y + zoomout}&x2=${playerLocation.x + zoomout}&y2=${playerLocation.y - zoomout}&server=${res.data.server.map}`;

    ctx.body = {data: (await (await fetch(url)).json()).Data};
});
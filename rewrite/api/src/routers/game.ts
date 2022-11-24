import koaRouter from "koa-router";
import { TRUCKERSMP_API, TruckersMP_krashnz, TRUCKERSMP_MAP } from "../constants";
import { User } from "../db/entities/user";
import { getPlayerServer } from "../game";
export const game = new koaRouter();

game.post("/game/getPlayerServer", async (ctx) => {
    const {username} = ctx.request.body as {username: string};

    return ctx.body = await getPlayerServer(username);
});
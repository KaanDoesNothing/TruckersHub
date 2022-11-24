import koaRouter from "koa-router";
import { getPlayerServer } from "../utils/game";
export const game = new koaRouter();

game.post("/game/getPlayerServer", async (ctx) => {
    const {username} = ctx.request.body as {username: string};

    return ctx.body = await getPlayerServer(username);
});
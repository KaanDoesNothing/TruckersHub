import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getPlayerLocation } from "../utils/game.ts";

export const APIRouter = new Router();

APIRouter.post("/api/getPlayerLocation", async (ctx) => {
    const {username} = await ctx.request.body({type: "json"}).value;
    return ctx.response.body = await getPlayerLocation(username);
});

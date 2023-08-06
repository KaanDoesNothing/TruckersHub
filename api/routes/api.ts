import { Event, User } from "../lib/db.ts";
import { isUser } from "../middleware/isUser.ts";
import { getGameData } from "../socket/cache.ts";
import { getPlayerLocation } from "../utils/game.ts";

import { Router } from "oak/mod.ts";

export const APIRouter = new Router();

APIRouter.get("/api/getVersion", (ctx) => {
    return ctx.response.body = {data: {version: "0.1"}};
});

APIRouter.post("/api/getPlayerLocation", async (ctx) => {
    const {username} = await ctx.request.body({type: "json"}).value;
    return ctx.response.body = await getPlayerLocation(username);
});

APIRouter.post("/api/game/data", isUser, async (ctx) => {
    const {token} = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({token});

    const gameCache = await getGameData({username: user.username});

    if(!gameCache) return ctx.response.body = {error: true};

    return ctx.response.body = {data: gameCache};
});

APIRouter.get("/api/lastDeliveries", async (ctx) => {
    const lastDeliveries = await Event.find({type: "delivered"}).sort({createdAt: "desc"}).limit(2);
    
    return ctx.response.body = {data: lastDeliveries};
});
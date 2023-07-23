import { Event } from "../lib/db.ts";
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

APIRouter.get("/api/lastDeliveries", async (ctx) => {
    const lastDeliveries = await Event.find({type: "delivered"}).sort({createdAt: "desc"}).limit(2);
    
    return ctx.response.body = {data: lastDeliveries};
});
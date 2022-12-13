import { Router } from "https://deno.land/x/oak/mod.ts";
import {renderFile} from "https://deno.land/x/dejs@0.10.3/mod.ts";

export const mapRouter = new Router();

mapRouter.get("/map", async (ctx) => {
    const TileMapInfo = JSON.parse(await Deno.readTextFile("./assets/TileMapInfo.json"));
    return ctx.response.body = await renderFile("./assets/map.ejs", {TileMapInfo});
});
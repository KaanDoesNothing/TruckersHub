import { renderFile } from "dejs/mod.ts";
import { Router } from "oak/mod.ts";

export const mapRouter = new Router();

mapRouter.get("/map", async (ctx) => {
    const TileMapInfo = JSON.parse(await Deno.readTextFile("./assets/TileMapInfo.json"));
    return ctx.response.body = await renderFile("./assets/map.ejs", {TileMapInfo});
});
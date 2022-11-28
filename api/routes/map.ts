import { Router } from "https://deno.land/x/oak/mod.ts";
import {render, renderFile} from "https://deno.land/x/dejs@0.10.3/mod.ts";
import { proxy } from "https://deno.land/x/oak_http_proxy@2.1.0/mod.ts";

export const mapRouter = new Router();

mapRouter.get("/map", async (ctx) => {
    const TileMapInfo = JSON.parse(await Deno.readTextFile("./assets/TileMapInfo.json"));
    return ctx.response.body = await renderFile("./assets/map.ejs", {TileMapInfo});
});

mapRouter.get("/Tiles", (ctx) => {
    proxy((ctx) => new URL("http://185.205.246.23:8006/truckershub/map/Tiles"))
})
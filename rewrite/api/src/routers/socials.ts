import koaRouter from "koa-router";
import SteamAuth from "node-steam-openid";
import { getConfig } from "../utils";

export const socials = new koaRouter();

const getSteamInstance = async () => {
    const config = await getConfig();

    const steam = new SteamAuth(config.api.steam);

    return steam;
}

socials.get("/steam/info", async (ctx) => {
    const steam = await getSteamInstance();

    return ctx.body = {url: await steam.getRedirectUrl()};
});

socials.post("/steam/authenticate", async (ctx) => {
    const steam = await getSteamInstance();

    const fetchedUser = await steam.authenticate(ctx.request);

    console.log(fetchedUser);
});
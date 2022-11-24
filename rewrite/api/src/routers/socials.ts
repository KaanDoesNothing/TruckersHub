import koaRouter from "koa-router";
import SteamAuth from "node-steam-openid";
import { User } from "../db/entities/user";
import { getConfig } from "../utils/main";
import { isUser } from "./main";

export const socials = new koaRouter();

const getSteamInstance = async () => {
    const config = await getConfig();

    const steam = new SteamAuth(config.api.steam);

    return steam;
}

socials.get("/socials/steam/info", async (ctx) => {
    const steam = await getSteamInstance();

    return ctx.body = {url: await steam.getRedirectUrl()};
});

socials.post("/socials/steam/authenticate", isUser, async (ctx) => {
    const {token, url} = ctx.request.body as {token: string, url?: string};

    if(!url) return ctx.body = {error: "No url was provided"};

    const steam_id = parseInt(url.replace("https://steamcommunity.com/openid/id/", ""));

    if(!steam_id) return ctx.body = {error: "Invalid steam_id"};

    const user = await User.findOne({where: {token}, relations: {truckersmp: true}});

    if(!user) return ctx.body = {error: "Invalid token"};

    user.steam_id = steam_id.toString();
    await user.save();

    ctx.body = {data: true};
});
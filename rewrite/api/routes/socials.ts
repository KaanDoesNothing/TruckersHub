import {Router} from "https://deno.land/x/oak/mod.ts";
import SteamAuth from "npm:node-steam-openid";
import config from "../config.ts";
import { User } from "../lib/db.ts";
import { isUser } from "../middleware/isUser.ts";

export const socialsRouter = new Router();

const getSteamInstance = () => {
    const steam = new SteamAuth(config.api.steam);

    return steam;
}

socialsRouter.get("/socials/steam/info", async (ctx) => {
    const steam = getSteamInstance();

    return ctx.response.body = {url: await steam.getRedirectUrl()};
});

socialsRouter.post("/socials/steam/authenticate", isUser, async (ctx) => {
    const {token, url} = await ctx.request.body({type: "json"}).value;

    if(!url) return ctx.response.body = {error: "No url was provided"};

    const steam_id = parseInt(url.replace("https://steamcommunity.com/openid/id/", ""));

    if(!steam_id) return ctx.response.body = {error: "Invalid steam_id"};

    const user = await User.findOne({token});

    if(!user) return ctx.response.body = {error: "Invalid token"};

    if(!user.linked) {
        user.linked = {
            steam: {
                id: steam_id.toString()
            }
        }
    }else {
        user.linked.steam = {
            id: steam_id.toString()
        }
    }

    await user.save();

    ctx.response.body = {data: true};
});
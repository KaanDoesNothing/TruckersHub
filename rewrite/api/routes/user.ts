import {Router} from "https://deno.land/x/oak/mod.ts";
import { User, Event } from "../lib/db.ts";
import { isUser } from "../middleware/isUser.ts";
import { comparePassword } from "../utils/authentication.ts";
import { closestCity } from "../utils/game.ts";

export const UserRouter = new Router();

UserRouter.post("/user/events", isUser, async (ctx) => {
    const {token, type} = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({token});

    if(!user) return ctx.response.body = {error: "Invalid token!"};

    const userEvents = await Event.find({author: user.username, type}).sort({createdAt: "desc"});

    const events = userEvents.map((row: any) => {
        if(!row.data.game) return row;

        row.data.location = closestCity(row.data.game.truck.position).realName;

        if(row.data.event.trailerID) {
            const clone = Object.assign({}, row);
            row.data.event.previous = clone.data.event.current;
            row.data.event.current = clone.data.event.trailerID;
        }

        return row;
    }).filter(row => row);

    ctx.response.body = {data: events};
});

UserRouter.post("/user", isUser, async (ctx) => {
    const {token} = await ctx.request.body({type: "json"}).value;

    let user = await User.findOne({token});
    if(!user) return ctx.response.body = {error: "Invalid token!"};

    ctx.response.body = {data: {user}};

    if(user.linked?.steam?.id) {
        try {
            const profile = await (await fetch(`https://api.truckersmp.com/v2/player/${user.linked?.steam?.id}`)).json();

            if(!profile.error) {
                if (user.linked?.truckersmp) {
                    user.linked.truckersmp = profile.response;
                }else {
                    user.linked.truckersmp = profile.response;
                }
                await user.save();
            }
        }catch(err) {
            console.log("Failed to update user");
        }
    }
});

UserRouter.post("/user/token/valid", isUser, async (ctx) => {
    const {token} = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({where: {token}, relations: {truckersmp: true}});

    if(!user) return ctx.response.body = {error: "Invalid token!"};

    return ctx.response.body = {data: true};
});


UserRouter.post("/user/login", async (ctx) => {
    const {username, password} = await ctx.request.body({type: "json"}).value;

    if(!username || !password) return ctx.response.body = {error: "Provide your username and password!"};

    let user = await User.findOne({username});
    if(!user) return ctx.response.body = {error: "User doesn't exist!"};

    const passwordCorrect = password === user.password || await comparePassword(password, user.password);

    if(!passwordCorrect) return ctx.response.body = {error: "Incorrect password!"};

    return ctx.response.body = {
        data: {
            token: user.token
        }
    };
});
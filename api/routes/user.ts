import {Router} from "https://deno.land/x/oak/mod.ts";
import { iEventDelivered, iEventFine, iEventFuel, iEventTollgate } from "../../frontend/types.ts";
import { User, Event, processedEvent } from "../lib/db.ts";
import { isUser } from "../middleware/isUser.ts";
import { comparePassword, hashPassword } from "../utils/authentication.ts";
import { closestCity } from "../utils/game.ts";

export const UserRouter = new Router();

UserRouter.post("/user/events", isUser, async (ctx) => {
    const {token, type} = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({token});

    if(!user) return ctx.response.body = {error: "Invalid token!"};

    console.time("Fetching events");
    const userEvents = await processedEvent.find({author: user.username, type}).sort({createdAt: "desc"}).cacheQuery();
    console.timeEnd("Fetching events");

    const events = userEvents.map((row: any) => {
        // if(!row.data.game) return;

        if(row.data.location) row.data.location = closestCity(row.data.location).realName;

        row.data.createdAt = row.createdAt;

        return row.data;

        // if(row.data.event.trailerID) {
        //     const clone = Object.assign({}, row);
        //     row.data.event.previous = clone.data.event.current;
        //     row.data.event.current = clone.data.event.trailerID;
        // }
    });

    ctx.response.body = {data: events};
});

UserRouter.post("/user", isUser, async (ctx) => {
    const {token} = await ctx.request.body({type: "json"}).value;

    let user = await User.findOne({token}).cacheQuery();
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

UserRouter.post("/user/register", async (ctx) => {
    const {username, password} = await ctx.request.body({type: "json"}).value;

    if(!username || !password) return ctx.response.body = {error: "Provide a username and password!"};

    const user = await User.findOne({username});
    if(user) return ctx.response.body = {error: "User already exists!"};

    const hashedPassword = await hashPassword(password);
    if(!hashedPassword) return;

    const newUser = await User.create({username, password: hashedPassword, token: crypto.randomUUID(), linked: {}}); 

    return ctx.response.body = {data: newUser.token};
});
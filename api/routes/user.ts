import { oakCors } from "https://deno.land/x/cors@v1.2.2/oakCors.ts";
import {Router} from "https://deno.land/x/oak/mod.ts";
import { iEventDelivered, iEventFine, iEventFuel, iEventTollgate } from "../../frontend/types.ts";
import { User, Event } from "../lib/db.ts";
import { isUser } from "../middleware/isUser.ts";
import { comparePassword, hashPassword } from "../utils/authentication.ts";
import { closestCity } from "../utils/game.ts";

export const UserRouter = new Router();

UserRouter.post("/user/events", isUser, async (ctx) => {
    const {token, type} = await ctx.request.body({type: "json"}).value;

    const user = await User.findOne({token});

    if(!user) return ctx.response.body = {error: "Invalid token!"};

    const userEvents = await Event.find({author: user.username, type}).sort({createdAt: "desc"}).cacheQuery();

    const events = userEvents.map((row: any) => {
        if(!row.data.game) return;

        // row.data.location = closestCity(row.data.game.truck.position).realName;

        // if(row.data.event.trailerID) {
        //     const clone = Object.assign({}, row);
        //     row.data.event.previous = clone.data.event.current;
        //     row.data.event.current = clone.data.event.trailerID;
        // }

        if(type === "delivered") {
            const data: iEventDelivered = {
                revenue: row.data.event.revenue,
                distance: row.data.event.distance.km,
                cargo: row.data.event.cargo.name,
                from: {
                    city: row.data.event.source.city.name,
                    company: row.data.event.source.company.name
                },
                to: {
                    city: row.data.event.destination.city.name,
                    company: row.data.event.destination.company.name
                },
                createdAt: row.createdAt
            }
            
            return data;
        }else if(type === "fine") {
            const data: iEventFine = {
                reason: row.data.event.offence.name,
                location: closestCity(row.data.game.truck.position).realName,
                price: row.data.event.amount,
                createdAt: row.createdAt
            }

            return data;
        }else if(type === "refuel-paid") {
            const data: iEventFuel = {
                location: closestCity(row.data.game.truck.position).realName,
                amount: Math.round(row.data.event.amount),
                price: Math.round(row.data.event.amount),
                createdAt: row.createdAt
            }

            return data;
        }else if(type === "tollgate") {
            const data: iEventTollgate = {
                location: closestCity(row.data.game.truck.position).realName,
                price: row.data.event.amount,
                createdAt: row.createdAt
            }

            return data;
        }

        return row;
    }).filter(row => row);

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
import { Next } from "koa";
import koaRouter, { RouterContext } from "koa-router";
import { User } from "../db/entities/user";
import { closestCity } from "../game";

export const main = new koaRouter();

const isUser = async (ctx: RouterContext, next: Next) => {
    const {token} = ctx.request.body as {token?: string};
    if(!token) return ctx.body = {error: "No token was provided!"};
    await next();
}

main.post("/token_valid", isUser, async (ctx) => {
    const {token} = ctx.request.body as {token: string};

    const user = await User.findOne({where: {token}, relations: {truckersmp: true}});

    if(!user) return ctx.body = {error: "Invalid token!"};

    ctx.body = {data: true};
});

main.post("/user", isUser, async (ctx) => {
    const {token} = ctx.request.body as {token: string};

    const user = await User.findOne({where: {token}, relations: {truckersmp: true}});

    if(!user) return ctx.body = {error: "Invalid token!"};

    ctx.body = {data: user};
});

main.post("/events", isUser, async (ctx) => {
    const {token, type} = ctx.request.body as {token: string, type: string};

    const user = await User.findOne({where: {token, events: {type}}, relations: {events: true}, order: {events: {createdAt: "DESC"}}});

    if(!user) return ctx.body = {error: "Invalid token!"};

    const events = user.events.map((row: any) => {
        if(!row.data.game) return row;

        row.data.location = closestCity(row.data.game.truck.position).realName;

        if(row.data.event.trailerID) {
            const clone = Object.assign({}, row);
            row.data.event.previous = clone.data.event.current;
            row.data.event.current = clone.data.event.trailerID;
        }

        return row;
    }).filter(row => row);

    ctx.body = {data: events};
})
import { Next } from "koa";
import koaRouter, { RouterContext } from "koa-router";
import { User } from "../db/entities/user";

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

    ctx.body = {data: user.events};
})
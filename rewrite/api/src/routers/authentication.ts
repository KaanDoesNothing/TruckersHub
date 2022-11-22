import { randomUUID } from "crypto";
import koaRouter from "koa-router";
import { User } from "../db/entities/user";
import { comparePassword, hashPassword } from "../utils";

export const authentication = new koaRouter();

authentication.post("/auth/login", async (ctx) => {
    const {username, password} = ctx.request.body as {username?: string, password?: string};

    if(!username || !password) return ctx.body = {error: "Provide your username and password!"};

    const user = await User.findOne({where: {username}, relations: {truckersmp: true}});
    if(!user) return ctx.body = {error: "User doesn't exist!"};

    const passwordCorrect = password === user.password || await comparePassword(password, user.password);

    if(!passwordCorrect) return ctx.body = {error: "Incorrect password!"};

    return ctx.body = {data: user.token};
});

authentication.post("/auth/register", async (ctx) => {
    const {username, password} = ctx.request.body as {username?: string, password?: string};

    if(!username || !password) return ctx.body = {error: "Provide a username and password!"};

    const user = await User.findOne({where: {username}});
    if(user) return ctx.body = {error: "User already exists!"};

    const hashedPassword = await hashPassword(password);
    if(!hashedPassword) return;

    const newUser = User.create({username, password: hashedPassword, token: randomUUID(), administrator: false}); 

    await newUser.save();

    return ctx.body = {data: newUser.token};
});
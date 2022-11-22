import { randomUUID } from "crypto";
import koaRouter from "koa-router";
import { mpProfile } from "../db/entities/mpProfile";
import { User } from "../db/entities/user";
import { comparePassword, hashPassword } from "../utils";

export const authentication = new koaRouter();

authentication.post("/auth/login", async (ctx) => {
    const {username, password} = ctx.request.body as {username?: string, password?: string};

    if(!username || !password) return ctx.body = {error: "Provide your username and password!"};

    let user = await User.findOne({where: {username}, relations: {truckersmp: true}});
    if(!user) return ctx.body = {error: "User doesn't exist!"};

    const passwordCorrect = password === user.password || await comparePassword(password, user.password);

    if(!passwordCorrect) return ctx.body = {error: "Incorrect password!"};

    if(user.steam_id) {
        const profile = await (await fetch(`https://api.truckersmp.com/v2/player/${user.steam_id}`)).json();

        if(!profile.data.error) {
            if (user.truckersmp) {
                user.truckersmp.data = profile.response;
            }else {
                const newProfile = mpProfile.create({data: profile.data.response});

                user.truckersmp = newProfile;
            }
            await user.save();
        }
    }

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
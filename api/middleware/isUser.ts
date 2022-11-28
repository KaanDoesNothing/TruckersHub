import {Context} from "https://deno.land/x/oak/mod.ts";

export const isUser = async (ctx: Context, next: any) => {
    const {token} = await ctx.request.body({type: "json"}).value;

    if(!token) return ctx.response.body = {error: "No token provided!"};

    await next();
}
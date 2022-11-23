import koaRouter from "koa-router";
import { User } from "../db/entities/user";
import { isUser } from "./main";

export const game = new koaRouter();

game.get("/", (ctx) => {

});
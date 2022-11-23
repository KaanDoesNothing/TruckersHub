import koa from "koa";
import koaBody from "koa-bodyparser";
import koaCors from "@koa/cors";
import { authentication } from "./routers/authentication";
import { main } from "./routers/main";
import { setup } from "./db";
import { socials } from "./routers/socials";
import { game } from "./routers/game";

const app = new koa();

setup();

app.use(koaCors());
app.use(koaBody());
app.use(main.routes()).use(main.allowedMethods());
app.use(authentication.routes()).use(authentication.allowedMethods());
app.use(socials.routes()).use(socials.allowedMethods());
app.use(game.routes()).use(game.allowedMethods());

app.listen(5050);
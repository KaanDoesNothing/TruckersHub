import koa from "koa";
import koaBody from "koa-bodyparser";
import koaCors from "@koa/cors";
import { authentication } from "./routers/authentication";
import { main } from "./routers/main";
import { setup } from "./db";

const app = new koa();

setup();

app.use(koaCors());
app.use(koaBody());
app.use(main.routes()).use(main.allowedMethods());
app.use(authentication.routes()).use(authentication.allowedMethods());

app.listen(5050);
import {Application} from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import { UserRouter } from "./routes/user.ts";
import { VTCRouter } from "./routes/vtc.ts";
import { socialsRouter } from "./routes/socials.ts";

const app = new Application();

app.use(oakCors());

app.use(UserRouter.routes()).use(UserRouter.allowedMethods());
app.use(VTCRouter.routes()).use(VTCRouter.allowedMethods());
app.use(socialsRouter.routes()).use(socialsRouter.allowedMethods());

await app.listen({ port: 5050 });
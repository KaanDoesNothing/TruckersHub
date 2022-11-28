import {Application, Context} from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import { UserRouter } from "./routes/user.ts";
import { VTCRouter } from "./routes/vtc.ts";
import { socialsRouter } from "./routes/socials.ts";
import { mapRouter } from "./routes/map.ts";

const app = new Application();

app.use(oakCors({preflightContinue: true, optionsSuccessStatus: 200}));

app.use(UserRouter.routes()).use(UserRouter.allowedMethods());
app.use(VTCRouter.routes()).use(VTCRouter.allowedMethods());
app.use(socialsRouter.routes()).use(socialsRouter.allowedMethods());
app.use(mapRouter.routes()).use(mapRouter.allowedMethods());

await app.listen({ port: 5050 });
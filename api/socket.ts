import { serve } from "https://deno.land/std/http/server.ts";
import { Server } from "https://deno.land/x/socket_io/mod.ts";
import { launchSocket } from "./socket/index.ts";

const io = new Server();

launchSocket(io);

await serve(io.handler(), {
  port: 7998,
});
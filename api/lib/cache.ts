import {connect} from "https://deno.land/x/redis/mod.ts";

export const cacheInstance = await connect({hostname: "127.0.0.1", port: 6379});
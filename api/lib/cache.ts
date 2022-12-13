import {connect} from "https://deno.land/x/redis/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

export const cacheInstance = await connect({hostname: config().REDIS_HOST, port: 6379, password: config().REDIS_PASSWORD});
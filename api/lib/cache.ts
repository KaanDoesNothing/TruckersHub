// import { redis, config } from "../deps.ts";
import {connect} from "redis/mod.ts";
import {config} from "dotenv/mod.ts";

//, password: config().REDIS_PASSWORD
export const cacheInstance = await connect({hostname: config().REDIS_HOST, password: config().REDIS_PASSWORD, port: 6380});
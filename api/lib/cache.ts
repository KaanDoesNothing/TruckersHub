// import { redis, config } from "../deps.ts";
import {connect} from "redis/mod.ts";
import {config} from "dotenv/mod.ts";

export const cacheInstance = await connect({hostname: config().REDIS_HOST, port: 6379, password: config().REDIS_PASSWORD});
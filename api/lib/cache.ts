import { redis, config } from "../deps.ts";

export const cacheInstance = await redis.connect({hostname: config().REDIS_HOST, port: 6379, password: config().REDIS_PASSWORD});
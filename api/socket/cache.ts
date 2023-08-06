import { cacheInstance } from "../lib/cache.ts";
import { GetMap, SetBooleanMap } from "./types.ts";
import { CacheExpireDate } from "../constants.ts";

export const handling = new Map();
export const sockets = new Map();
export const timers = {};
export const clients = new Map();

// export function getHandling({id}: GetMap) {
//     return handling.get(id) || false;
// }

// export function setHandling({id, value}: SetBooleanMap) {
//     return handling.set(id, value);
// }

export async function getGameData({username}: GetMap) {
    // const socket = sockets.get(username);
    // if(!socket) return;

    const data = await cacheInstance.get(`gamedata_${username}`);

    if(data) return JSON.parse(data as string);
}

export async function deleteGameData({username}: GetMap) {
    await cacheInstance.del(`gamedata_${username}`);
}

export async function setGameData({username, value}: {username: string, value: any}) {
    const keyname = `gamedata_${username}`;
    await cacheInstance.set(keyname, JSON.stringify(value));
    await cacheInstance.expireat(`gamedata_${username}`, (Date.now() + CacheExpireDate).toString());
}
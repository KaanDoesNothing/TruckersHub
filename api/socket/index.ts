import { Namespace, Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { cacheInstance } from "../lib/cache.ts";
import { User } from "../lib/db.ts";
import { log } from "../lib/logger.ts";
import { clients, deleteGameData, sockets } from "./cache.ts";
import { playerHandler } from "./playerHandler.ts";
import { iUser } from "../lib/schemas.ts";

cacheInstance.flushall();

let server: Namespace;

export const sleep = (time: number) => new Promise(r => setTimeout(r, time));

export function getSocketByName({username}: {username: string}) {
    const keys = sockets.entries();

    for (const [_key, value] of keys) {
        if(value.user.username === username) return value;
    }
}

export const launchSocket = (socketServer: Server) => {
    server = socketServer.of("/client");
    
    server.on("connection", async (client) => {
        const userData: iUser = await new Promise((resolve) => {
            client.once("authenticate", async (msg) => {
                const user = await User.findOne({token: msg.content});

                if(!user) return;

                client.emit("authenticated", {content: true});

                log("message", `${user.username} connected via client`);

                resolve(user);
            });
        });

        const playerInstance = new playerHandler({socket: client, userData});

        clients.set(userData.username, playerInstance);

        client.on("disconnect", async () => {
            await deleteGameData({username: userData.username});

            clients.delete(userData.username);

            log("message", `${userData.username} has disconnected`);
        });
    });
}
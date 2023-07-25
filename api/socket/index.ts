import { Namespace, Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { cacheInstance } from "../lib/cache.ts";
import { convertEvent, processedEvent, Event, User } from "../lib/db.ts";
import { log } from "../lib/logger.ts";
import { clients, deleteGameData, sockets } from "./cache.ts";
import { playerHandler } from "./playerHandler.ts";

cacheInstance.flushall();

let server: Namespace;

export const sleep = (time: number) => new Promise(r => setTimeout(r, time));

export function getSocketByName({username}: {username: string}) {
    const keys = sockets.entries();

    for (let [key, value] of keys) {
        if(value.user.username === username) return value;
    }
}

export const launchSocket = (socketServer: Server) => {
    server = socketServer.of("/client");
    
    server.on("connection", async (client) => {
        const userData: any = await new Promise((resolve) => {
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

        const id = client.id;

        client.on("event_create", async (data) => {
            const {event} = data;
        
            const eventRes = await Event.create({author: userData.username, type: event.type, data: event.data});
            const converted = convertEvent(eventRes);
            if(converted) await processedEvent.create({author: userData.username, type: event.type, data: converted});
        
            client.emit("message", {type: "log", content: "Event was saved to the database!"});
        });

        client.on("disconnect", async () => {
            await deleteGameData({username: userData.username});

            clients.delete(userData.username);

            log("message", `${userData.username} has disconnected`);
        });
    });
}
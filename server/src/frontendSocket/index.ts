import {Server} from "socket.io";
import { getSocketByName } from "../clientSocket";
import { User } from "../entities/user";

export const socketNames = new Map();

export const launchFrontEndSocket = (server: Server) => {
    server.of("/frontend", async (client) => {
        const username: User["username"] = await new Promise((resolve) => {
            client.once("authenticate", async (msg) => {
                console.log(msg);
                const user = await User.findOne({where: {token: msg.content}});

                if(!user) return;

                client.emit("authenticated", {content: true});

                console.log(`${user.username} connected`);

                resolve(user.username);
            });
        });
        
        socketNames.set(username, client.id);

        (() => {
            const clientSocket = getSocketByName({username});

            if(clientSocket) client.emit("client_settings", clientSocket.settings);
        })();
    });
} 
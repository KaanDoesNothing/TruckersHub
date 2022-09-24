import {Server} from "socket.io";
import { getSocketByName, sockets } from "../clientSocket";
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

                console.log(`${user.username} connected via frontend`);

                resolve(user.username);
            });
        });
        
        socketNames.set(username, client.id);

        client.on("client_settings_update", (data) => {
            let clientSocket = getSocketByName({username});

            clientSocket.settings = data;

            sockets.set(clientSocket.client.id, clientSocket);
        });

        (() => {
            const clientSocket = getSocketByName({username});

            if(clientSocket) client.emit("client_settings", clientSocket.settings);
        })();

        client.on("client_settings", () => {
            const clientSocket = getSocketByName({username});

            client.emit("client_settings", client.emit("client_settings", clientSocket.settings));
        });
    });
} 
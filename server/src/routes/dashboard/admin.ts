import { Application } from "express";
import { isAdministrator } from "../../middleware";
import { getSocketByName } from "../../socketServer";
import { sockets } from "../../socketServer";
import { User } from "../../entities/user";

export const routes = (app: Application) => {
    app.get("/dashboard/admin/users", isAdministrator, async (req, res) => {
        const users = await User.find({});
    
        return res.render("dashboard/admin/users", {users, getSocketByName});
    });
    
    app.get("/dashboard/admin/users/:id/pause/:type", isAdministrator, (req, res) => {
        sockets.forEach(socket => {
            if(socket.username === req.params.id) {
                socket.paused = req.params.type === "true";
    
                sockets.set(socket.client.id, socket);
            }
        });
    
        return res.json({message: "Successful"});
    });
}
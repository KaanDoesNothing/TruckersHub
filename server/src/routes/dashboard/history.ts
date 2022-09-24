import { Application } from "express";
import { getSocketByName } from "../../clientSocket";

export const routes = (app: Application) => {
    app.get("/dashboard/statistics", async (req, res) => {
        return res.render("dashboard/statistics", {getSocketByName});
    });
    
    app.get("/dashboard/history", async (req, res) => {
        return res.render("dashboard/history");
    });
    
    app.get("/dashboard/history/deliveries", async (req, res) => {
        return res.render("dashboard/history/deliveries");
    });
    
    app.get("/dashboard/history/fines", async (req, res) => {
        return res.render("dashboard/history/fines");
    });
    
    app.get("/dashboard/history/transport", async (req, res) => {
        return res.render("dashboard/history/transport");
    });
    
    app.get("/dashboard/history/tollgates", async (req, res) => {
        return res.render("dashboard/history/tollgates");
    });
    
    app.get("/dashboard/history/fuel", async (req, res) => {
        return res.render("dashboard/history/fuel");
    });
    
    app.get("/dashboard/history/damages", async (req, res) => {
        res.locals.user.events = res.locals.user.events.map((row: any) => {
            //temporary fix for my stupid mistakes.
            if(!row.data.game) return row;

            if(row.data.event.trailerID) {
                const clone = Object.assign({}, row);
                row.data.event.previous = clone.data.event.current;
                row.data.event.current = clone.data.event.trailerID;
            }

            return row;
        });
        
        return res.render("dashboard/history/damages");
    });
}
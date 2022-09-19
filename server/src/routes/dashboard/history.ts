import { Application } from "express";
import { getSocketByName } from "../../socketServer";

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
        return res.render("dashboard/history/damages");
    });
}
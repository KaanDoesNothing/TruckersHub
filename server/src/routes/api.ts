import { Application } from "express";

export const routes = (app: Application) => {
    app.get("/api/session", async (req, res) => {
        if(res.locals.user) {
            return res.json(res.locals.user);
        }else {
            return res.json({error: true});
        }
    });
}
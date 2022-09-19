import { Application } from "express";

import * as history from "./history";
import * as vtc from "./vtc";
import * as admin from "./admin";

export const routes = (app: Application) => {
    history.routes(app);
    vtc.routes(app);
    admin.routes(app);

    app.get("/dashboard/settings", async (req, res) => {
        return res.render("dashboard/settings");
    });
}
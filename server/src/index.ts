import express from "express";
import http from "http";
import socketIO from "socket.io";
import expressSession from "express-session";
import { setup } from "./db";
import { User } from "./entities/user";
import {copyFile, capitalizeFirstLetter } from "./utils";
import { sessionData } from "./types";
import { isAuthenticated } from "./middleware";
import path from "path";
import { launchShifter } from "./socketServer";
import { closestCity, fuelPrice, truckersMPClient } from "./game";
import * as dashboard from "./routes/dashboard";
import * as auth from "./routes/auth";
import * as api from "./routes/api";
import { Avatar } from "./entities/avatar";

const config = require("../config.json");

setup();

copyFile();

const app = express();
const server = http.createServer(app);
const socket = new socketIO.Server(server);

launchShifter(socket);

app.use(expressSession({
    secret: config.server.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use("/static/", express.static(path.join(__dirname, "../static")));

app.use("/", express.static(path.join(__dirname, "../../frontend/dist")));
  
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "pug");

api.routes(app);

auth.routes(app);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.use(isAuthenticated, (req, res, next) => {
    res.locals.isDashboard = true;

    next();
});

dashboard.routes(app);

// app.get("/", (req, res) => {
//     return res.render("home");
// });

// app.get("/avatar/:id", async (req, res) => {
//     const {id} = req.params;
//     const file = await Avatar.findOne({where: {id}});

//     if(!file) return res.sendStatus(404);
    
//     return res.send(file.data);
// });

server.listen(7998);
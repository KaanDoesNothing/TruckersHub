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
import { closestCity, fuelPrice } from "./game";
import * as dashboard from "./routes/dashboard";
import * as auth from "./routes/auth";

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
  
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set("view engine", "pug");

app.use(async (req, res, next) => {
    const session = req.session as sessionData;

    if(session.user?.token) {
        let existingUser = await User.findOne({where: {token: session.user.token.toString()}, relations: {events: true, vtc: true}, order: {events: {createdAt: "DESC"}}});
        if(!existingUser) return next();

        res.locals.user = existingUser;
        res.locals.modules = {
            closestCity,
            fuelPrice,
            capitalizeFirstLetter
        }

        res.locals.query = req.query;
    }

    next();
});

app.get("/", (req, res) => {
    return res.render("home");
});

auth.routes(app);

app.use(isAuthenticated, (req, res, next) => {
    res.locals.isDashboard = true;

    next();
});

dashboard.routes(app);

server.listen(7998);
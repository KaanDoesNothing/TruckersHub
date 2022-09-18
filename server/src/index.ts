import { randomUUID } from "crypto";
import express from "express";
import http from "http";
import socketIO from "socket.io";
import expressSession from "express-session";
import { setup } from "./db";
import { Event } from "./entities/event";
import { User } from "./entities/user";
import {comparePassword, copyFile, hashPassword } from "./utils";
import { sessionData } from "./types";
import { isAdministrator, isAuthenticated } from "./middleware";
import path from "path";
import { launchShifter, getSocketByName, sockets } from "./shifter";
import { closestCity, fuelPrice } from "./game";

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
        let existingUser = await User.findOne({where: {token: session.user.token.toString()}, relations: {events: true}, order: {events: {createdAt: "DESC"}}});
        if(!existingUser) return next();
        //@ts-ignore
        existingUser.events = existingUser.events.map((row: any) => {
            //temporary fix for my stupid mistakes.
            if(!row.data.game) return row;

            if(row.data.event.trailerID) {
                const clone = Object.assign({}, row);
                row.data.event.previous = clone.data.event.current;
                row.data.event.current = clone.data.event.trailerID;
            }

            return row;
        });

        res.locals.user = existingUser;
        res.locals.modules = {
            closestCity,
            fuelPrice
        }
    }

    next();
})

app.get("/", (req, res) => {
    return res.render("home");
});

app.get("/auth/register", (req, res) => {
    return res.render("register");
});

app.get("/auth/login", (req, res) => {
    return res.render("login");
});

app.post("/auth/login", async (req, res) => {
    const {username, password} = req.body;

    if(!username) return res.redirect("/auth/login");

    const existingUser = await User.findOne({where: {username: username?.toString()}});
    if(!existingUser) return res.redirect("/auth/login");

    const passwordCorrect = password === existingUser.password || await comparePassword(password, existingUser.password);

    if(!passwordCorrect) return res.redirect("/auth/login");

    (req.session as sessionData).user = {token: existingUser.token};

    return res.redirect("/dashboard/statistics");
});

app.post("/auth/register", async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) return;

    const existingUser = await User.findOne({where: {username}});

    if(existingUser) return;

    const hashedPassword = await hashPassword(password);
    if(!hashedPassword) return;

    const user = User.create({username, password: hashedPassword, token: randomUUID()}); 

    await user.save();

    return res.redirect("/");
});

app.get("/api/event/get", async (req, res) => {
    const author = await User.findOne({where: {username: req.query.username?.toString()}, relations: {events: true}});

    return res.json(author);
});

app.post("/api/event/create", async (req, res) => {
    const {token, event} = req.body;

    if(!token) return res.json({error: "No token was provided!"});

    const author = await User.findOne({where: {token}, relations: {events: true}});
    if(!author) {
        return res.json({error: "Invalid token"});
    }

    const newEvent = Event.create({type: event.type, data: event.data});

    await newEvent.save();

    author.events.push(newEvent);

    await author.save();

    return res.json({message: "Added to the database."});
});

app.use(isAuthenticated, (req, res, next) => {
    res.locals.isDashboard = true;

    next();
});

app.get("/dashboard/statistics", async (req, res) => {
    return res.render("dashboard/statistics");
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

app.get("/dashboard/vtc/list", async (req, res) => {
    // // const vtcList = await VTC.find({relations: {members: true, author: true}});
    
    // console.log(vtcList);

    // return res.render("dashboard/vtc/list", {vtcList});
});

app.get("/dashboard/vtc/create", async (req, res) => {
    // const author = await User.findOne({where: {username: "kaan075"}});

    // if(!author) return;

    // const newVTC = VTC.create({
    //     name: "Lazy Panda's",
    //     author: author,
    //     members: []
    // });

    // // await newVTC.save();
    
    // return res.json(await newVTC.save());
    // // return res.render("dashboard/history/fuel");
});

app.get("/dashboard/vtc/leave", async (req, res) => {
    const author = await User.findOne({where: {username: "kaan075"}});

});

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

app.get("/dashboard/settings", async (req, res) => {
    return res.render("dashboard/settings");
});

server.listen(7998);
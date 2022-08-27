import { randomUUID } from "crypto";
import express from "express";
import { engine } from "express-handlebars";
import expressSession from "express-session";
import { setup } from "./db";
import { Event } from "./entities/event";
import { User } from "./entities/user";
import { hashPassword } from "./utils";
import { sessionData } from "./types";

const config = require("../config.json");

setup();

const app = express();
app.use(expressSession({
    secret: config.server.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
  
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine({layoutsDir: "./views/layouts"}));
app.set("view engine", "handlebars");

app.use(async (req, res, next) => {
    const session = req.session as sessionData;

    if(session.user?.token) {
        const existingUser = await User.findOne({where: {token: session.user.token.toString()}, relations: {events: true}});

        res.locals.user = existingUser;
    }

    next();
})

app.get("/", (req, res) => {
    return res.render("home");
});

app.get("/auth/register", (req, res) => {
    return res.render("register");
});

app.get("/auth/login", async (req, res) => {
    const {username} = req.query;

    const existingUser = await User.findOne({where: {username: username?.toString()}});
    if(!existingUser) return;

    (req.session as sessionData).user = {token: existingUser.token};

    return res.redirect("/dashboard/home");
});

app.post("/auth/register", async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) return;

    const existingUser = await User.findOne({where: {username}});

    if(existingUser) return;

    const hashedPassword: string | null = await hashPassword(password);
    if(!hashedPassword) return;

    const user = User.create({username, password, token: randomUUID()}); 

    await user.save();

    return res.redirect("/");
});

app.get("/api/event/get", async (req, res) => {
    const author = await User.findOne({where: {username: req.query.username?.toString()}, relations: {events: true}});

    return res.json(author);
});

app.post("/api/event/create", async (req, res) => {
    const {username, event} = req.body;

    const author = await User.findOne({where: {username}, relations: {events: true}});
    if(!author) {
        return res.json({error: "Invalid token"});
    }

    const newEvent = Event.create({type: event.type, data: event.data});

    await newEvent.save();

    author.events.push(newEvent);

    await author.save();

    return res.json({message: "Added to the database."});
});

app.use((req, res, next) => {
    res.locals.isDashboard = true;

    next();
});

app.get("/dashboard/statistics", async (req, res) => {
    return res.render("dashboard/statistics");
});

app.get("/dashboard/logs", async (req, res) => {
    return res.render("dashboard/logs");
});

app.get("/dashboard/settings", async (req, res) => {
    return res.render("dashboard/settings");
});

app.listen(7998);
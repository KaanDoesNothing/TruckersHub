import { Application } from "express";
import { comparePassword, hashPassword } from "../utils";
import { User } from "../entities/user";
import { sessionData } from "../types";
import { randomUUID } from "crypto";
import SteamAuth from "node-steam-openid";
import { isAuthenticated } from "../middleware";
import Axios from "axios";
import { mpProfile } from "../entities/mpProfile";

const config = require("../../config.json");

const steam = new SteamAuth(config.server.steam);

export const routes = (app: Application) => {
    app.get("/auth/register", (req, res) => {
        return res.render("register");
    });
    
    app.get("/auth/login", (req, res) => {
        return res.render("login");
    });
    
    app.post("/auth/login", async (req, res) => {
        const {username, password} = req.body;
    
        if(!username) return res.redirect("/auth/login");
    
        const existingUser = await User.findOne({where: {username: username?.toString()}, relations: {truckersmp: true}});
        if(!existingUser) return res.redirect("/auth/login");

        if(!existingUser.truckersmp && existingUser.steam_id) {
            const profile = await Axios.get(`https://api.truckersmp.com/v2/player/${existingUser.steam_id}`);
            if(!profile.data.error) {
                const newProfile = mpProfile.create({data: profile.data.response});
                await newProfile.save();

                existingUser.truckersmp = newProfile;
                await existingUser.save();
            }
        }else if(existingUser.truckersmp) {
            const profile = await Axios.get(`https://api.truckersmp.com/v2/player/${existingUser.steam_id}`);
            if(!profile.data.error) {
                existingUser.truckersmp.data = profile.data.response;
                existingUser.save();
            }
        }
    
        const passwordCorrect = password === existingUser.password || await comparePassword(password, existingUser.password);
    
        if(!passwordCorrect) return res.redirect("/auth/login");
    
        (req.session as sessionData).user = {token: existingUser.token};
    
        return res.redirect("/dashboard/statistics");
    });
    
    app.post("/auth/register", async (req, res) => {
        const {username, password} = req.body;
    
        if(!username || !password) return res.render("error", {message: "You didn't provide a username or password!"});
    
        const existingUser = await User.findOne({where: {username}});
    
        if(existingUser) return res.render("error", {message: "User already exists!"});
    
        const hashedPassword = await hashPassword(password);
        if(!hashedPassword) return;
    
        const user = User.create({username, password: hashedPassword, token: randomUUID(), administrator: false}); 
    
        await user.save();
    
        return res.redirect("/");
    });

    app.get("/auth/steam/link", async (req, res) => {
        const redirectUrl = await steam.getRedirectUrl();
        return res.redirect(redirectUrl);
    });

    app.get("/auth/steam/authenticate", isAuthenticated, async (req, res) => {
        const fetchedUser = await steam.authenticate(req);

        if(!fetchedUser.steamid) return;

        const user = await User.findOne({where: {username: res.locals.user.username}});
        if(!user) return;

        user.steam_id = fetchedUser.steamid;

        await user.save();

        return res.redirect("/dashboard/settings");
    });
}
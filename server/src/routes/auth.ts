import { Application } from "express";
import { comparePassword, hashPassword } from "../utils";
import { User } from "../entities/user";
import { sessionData } from "../types";
import { randomUUID } from "crypto";

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
    
        const existingUser = await User.findOne({where: {username: username?.toString()}});
        if(!existingUser) return res.redirect("/auth/login");
    
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
    
}
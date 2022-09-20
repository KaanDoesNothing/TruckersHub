import { Application } from "express"
import { User } from "../../entities/user";
import { VTC } from "../../entities/vtc";
import Axios from "axios";

export const routes = (app: Application) => {
    app.get("/dashboard/vtc/list", async (req, res) => {
        const vtcList = await VTC.find({relations: {members: true, author: true}});
    
        return res.render("dashboard/vtc/list", {vtcList});
    });
    
    app.get("/dashboard/vtc/view/:name", async (req, res) => {
        const {name} = req.params;
    
        if(!name) return res.render("error", {message: "No name provided!"});
    
        const vtc: VTC | null = await VTC.findOne({where: {name}, relations: {members: {events: true, truckersmp: true}, author: {truckersmp: true}}});
        let vtcData: any;

        if(vtc?.author.truckersmp.data.vtc) {
            const profile = await Axios.get(`https://api.truckersmp.com/v2/vtc/${vtc.author.truckersmp.data.vtc.id}`);

            if(!profile.data.error) vtcData = profile.data.response;
        }

        if(!vtc) return res.render("error", {message: "VTC Doesn't exist!"});
    
        const members = vtc.members.map(member => {
            member.events = member.events.filter(event => event.type === "delivered");
    
            return member;
        }).sort((a: User, b: User) => b.events.length - a.events.length);
    
    
    
        return res.render("dashboard/vtc/view", {vtc, members, vtcData});
    });
    
    app.get("/dashboard/vtc/create", async (req, res) => {
        if(res.locals.user.vtc) return res.render("error", {message: "You're already in a VTC."});
    
        return res.render("dashboard/vtc/create");
    });
    
    app.post("/dashboard/vtc/create", async (req, res) => {
        const {name} = req.body;
    
        if(!name) return res.render("error", {message: "No name provided!"});
    
        if(res.locals.user.vtc) return res.render("error", {message: "You're already in a VTC."});
    
        const vtc = await VTC.findOne({where: {name}});
    
        if(vtc) return res.render("error", {message: "VTC Already exists!"});
    
        const author = await User.findOne({where: {username: res.locals.user.username}});
    
        if(!author) return;
    
        const newVTC = VTC.create({
            name: name,
            author: author,
            members: [author]
        });
    
        await newVTC.save();
    
        return res.redirect(`/dashboard/vtc/${name}`);
    });
    
    app.get("/dashboard/vtc/join/:name", async (req, res) => {
        const {name} = req.params;
        if(!name) return res.render("error", {message: "Missing parameters."});
    
        if(res.locals.user.vtc) return res.render("error", {message: "You're already in a VTC."});
    
        const vtc = await VTC.findOne({where: {name}, relations: {members: true}});
    
        if(!vtc) return res.render("error", {message: "VTC Doesn't exist!"});
    
        const user = await User.findOne({where: {username: res.locals.user.username}});
    
        if(!user) return;
    
        vtc.members.push(user);
    
        vtc.save();
    
        return res.redirect("/dashboard/vtc/list");
    });

    app.post("/dashboard/vtc/avatar/:name", async (req, res) => {
        const {name} = req.params;

        console.log(req.body);

        // const vtc = await VTC.findOne({where: {name}, relations: {members: true}});
    
        // if(!vtc) return res.render("error", {message: "VTC Doesn't exist!"});
    });
}
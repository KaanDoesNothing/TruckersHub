import { NextFunction, Request, Response } from "express";
import { User } from "./entities/user";
import { closestCity } from "./game";
import { sessionData } from "./types";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as sessionData;

    if(!session.user?.token) return res.redirect("/auth/login");

    next();
}

export const requiresUser = async (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as sessionData;

    if(session.user?.token) {
        let existingUser = await User.findOne({where: {token: session.user.token.toString()}, relations: {events: true, vtc: true, truckersmp: true}, order: {events: {createdAt: "DESC"}}});
        if(!existingUser) return next();

        res.locals.user = existingUser;

        res.locals.user.events = res.locals.user.events.map((row: any) => {
            //temporary fix for my stupid mistakes.
            if(!row.data.game) return row;

            row.data.location = closestCity(row.data.game.truck.position).realName;

            if(row.data.event.trailerID) {
                const clone = Object.assign({}, row);
                row.data.event.previous = clone.data.event.current;
                row.data.event.current = clone.data.event.trailerID;
            }

            return row;
        });

        res.locals.query = req.query;
    }

    next();
}

export const isAdministrator = (req: Request, res: Response, next: NextFunction) => {
    if(!res.locals.user.administrator) return res.json({message: "You aren't allowed to be here."});

    next();
}
import { NextFunction, Request, Response } from "express";
import { sessionData } from "./types";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const session = req.session as sessionData;

    if(!session.user?.token) return res.redirect("/auth/login");

    next();
}
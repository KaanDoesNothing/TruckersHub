import { Session } from "express-session";

export interface sessionData extends Session {
    user: {token: string},
    isDashboard?: boolean,
    dashboardTab?: string;
}
import { createConnection } from "typeorm";
import {User} from "./entities/user";
import { Event } from "./entities/event";
import { VTC } from "./entities/vtc";
import { mpProfile } from "./entities/mpProfile";
import { Avatar } from "./entities/avatar";
import { getConfig } from "../utils";

export const setup = async () => {
    const config = await getConfig();

    await createConnection({
        ...config.api.db, 
        entities: [User, Event, VTC, mpProfile, Avatar],
        synchronize: false
    });

    console.log("Connected to db");
}
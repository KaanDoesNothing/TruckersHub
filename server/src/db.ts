import { createConnection } from "typeorm";
import fs from "fs/promises";
import {User} from "./entities/user";
import { Event } from "./entities/event";
import { VTC } from "./entities/vtc";
import { mpProfile } from "./entities/mpProfile";

const config = require("../config.json");

export const setup = async () => {
    await createConnection({
        ...config.db,
        entities: [User, Event, VTC, mpProfile],
        synchronize: true
    });

    console.log("Connected to db");
}
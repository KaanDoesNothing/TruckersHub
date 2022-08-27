import { createConnection } from "typeorm";
import fs from "fs/promises";
import {User} from "./entities/user";
import { Event } from "./entities/event";

const config = require("../config.json");

export const setup = async () => {
    await createConnection({
        ...config.db,
        entities: [User, Event],
        synchronize: true
    });

    console.log("Connected to db");
}
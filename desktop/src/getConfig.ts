import * as path from "path";
import * as fs from "fs";
import { app } from "electron";

export const link = path.join(app.getAppPath(), "../", "config.json");

export const configExists = () => {
    return fs.existsSync(link);
}

export const getConfig = (): any => {
    try {
        const config = JSON.parse(fs.readFileSync(link, "utf-8"));
        return config;
    }catch(err) {
        console.log(err);
        app.quit();
        process.exit();
    }
}

export const setConfig = (data: string): any => {
    fs.writeFileSync(link, data);
}
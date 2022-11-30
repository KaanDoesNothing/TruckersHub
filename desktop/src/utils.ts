import * as path from "path";
import * as fs from "fs";
import { app } from "electron";
import { getGamePath } from "steam-game-path";
import https from "https";

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

export const makeSureInstalled = async () => {
    return new Promise(async (resolve, reject) => {
        const results = getGamePath(227300);
        if(!results.game) {
            console.log("No game path");
            app.quit();
            process.exit();
        }

        const gamePath = results.game.path;

        const pluginsPath = path.join(gamePath, "bin", "win_x64", "plugins");

        try {
            if (!fs.existsSync(pluginsPath)){
                fs.mkdirSync(pluginsPath, {recursive: true});
            }
    
            const pluginPath = path.join(gamePath, "bin", "win_x64", "plugins", "scs-telemetry.dll");
    
            const file = fs.createWriteStream(pluginPath);
            const request = https.get("https://cdn.kaanlikescoding.me/truckershub/scs-telemetry.dll", function(response) {
                response.pipe(file);
    
                file.on("finish", () => {
                    file.close();
                    resolve(true)
                });
            });
        }catch(err) {
            console.log("Game already running");
            reject(false);
        }
    });
}
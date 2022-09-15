import bcrypt from "bcrypt";
import fs from "fs/promises";
import path from "path";

const cities = require("../cities.json").citiesList;

export const hashPassword = async (password: string, saltRounds = 10): Promise<null | string> => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }

    return null;
};

export const comparePassword = async (password: string, hash: string) => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.log(error);
    }

    return false;
};

export const copyFile = async () => {
    await fs.copyFile(path.join(__dirname, "../../", "client", "client.exe"), path.join(__dirname, "../", "static", "TruckersHub.exe"));

    console.log("Copied");
}

export const closestCity = (player: {X: number, Y: number, Z: number}) => {
    function getDistance(city: any, player: {X: number, Y: number, Z: number}) {
        city = {
            x: parseInt(city.x),
            z: parseInt(city.z)
        }

        return Math.sqrt(Math.pow(city.x - player.X, 2) + Math.pow(city.z - player.Z, 2))
    }
    
    return cities.reduce((a: any, b: any) => getDistance(a, player) < getDistance(b, player) ? a : b);
}
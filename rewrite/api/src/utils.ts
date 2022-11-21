import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {join} from "path";
import {readFile} from "fs/promises";

export const getConfig = async () => {
    const raw = await readFile(join(__dirname, "../../", "config.json"), "utf-8");

    return JSON.parse(raw);
}

export const jwtSign = async (data: any) => {
    const config = await getConfig();

    return jwt.sign(data, config.api.secret);
}

export const jwtDecode = async (token: string) => {
    const config = await getConfig();

    return jwt.verify(token, config.api.secret);
}

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
import * as bcrypt from "bcrypt/mod.ts";

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
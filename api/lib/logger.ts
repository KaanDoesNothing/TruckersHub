import { chalk } from "../deps.ts";

const debugging = true;

export const log = (type: "message" | "warning" | "error", message: string) => {
    if(!debugging) return;

    if(type === "message") {
        console.log(chalk.default.blueBright(message));
    }else if(type === "error") {
        console.log(chalk.default.red(message));
    }
}
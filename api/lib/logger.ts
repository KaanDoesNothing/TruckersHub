import { chalk } from "../deps.ts";

const debugging = true;

export const log = (type: "message" | "warning", message: string) => {
    if(!debugging) return;

    if(type === "message") {
        console.log(chalk.default.green(message));
    }
}
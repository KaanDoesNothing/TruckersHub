import {defineStore} from "pinia";

export const useUserStore = defineStore("user", {
    state: (): userStore => {
        return {user: undefined, socket: {settings: undefined}}
    },
    actions: {
    }
});

export interface userStore {
    user: any;
    socket: any
}
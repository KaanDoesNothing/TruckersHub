import {defineStore} from "pinia";

export const useUserStore = defineStore("user", {
    state: (): userStore => {
        return {user: undefined}
    },
    actions: {
    }
});

export interface userStore {
    user: any;
}
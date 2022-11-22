import {defineStore} from "pinia";
import { API } from "@/constants";

export const useGlobalStore = defineStore("global", {
    state: (): any => {
        return {token: undefined, user: undefined}
    },
    actions: {
        async fetchUser() {
            const res: any = await $fetch(`${API}/user`, {body: {token: this.token}, method: "POST"});

            if(res.data) {
                this.user = res.data;
            }
        }
    }
});
import {defineStore} from "pinia";

export const useGlobalStore = defineStore("global", {
    state: (): any => {
        return {token: undefined, user: undefined}
    },
    actions: {
        async fetchUser() {
            const config = useRuntimeConfig();

            const res: any = await $fetch(`${config.public.API}/user`, {body: {token: this.token}, method: "POST"});

            if(res.data) {
                this.user = res.data.user;
            }
        }
    }
});
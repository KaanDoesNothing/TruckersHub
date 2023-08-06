import {defineStore} from "pinia";

export const useGlobalStore = defineStore("global", {
    state: (): any => {
        return {token: undefined, user: undefined, isElectron: false}
    },
    actions: {
        async authenticate() {
            const token = useCookie("token").value;

            if(!token) return false;

            if(token) this.token = token;
            await this.fetchUser();

            console.log("Authenticated!");

            return true;
        },
        async fetchUser() {
            const config = useRuntimeConfig();

            const res: any = await $fetch(`${config.public.API}/user`, {body: {token: this.token}, method: "POST"}).catch(err => console.log("Unable to fetch user data"));

            if(!res) return;

            if(res.data) {
                this.user = res.data.user;
            }
        }
    }
});
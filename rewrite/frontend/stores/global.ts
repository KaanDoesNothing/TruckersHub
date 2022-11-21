import Axios from "axios";
import {defineStore} from "pinia";
import { API } from "@/constants";

export const useGlobalStore = defineStore("global", {
    state: (): any => {
        return {token: undefined, user: undefined}
    },
    actions: {
        async fetchUser() {
            const res = await Axios.post(`${API}/user`, {token: this.token});

            if(res.data.data) {
                this.user = res.data.data;
            }
        }
    }
});
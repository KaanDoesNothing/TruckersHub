<template>
    <div class="flex justify-center mt-10">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
                <h2 class="card-title">Login</h2>
                <form class="form-control" @submit.prevent="authenticate">
                    <label class="label">
                        <span class="label-text">Username</span>
                    </label>
                    <input class="input input-bordered w-full max-w-xs" type="text" v-model="username"/>
                    <label class="label">
                        <span class="label-text">Password</span>
                    </label>
                    <input class="input input-bordered w-full max-w-xs" type="password" v-model="password"/>
                    <div class="card-actions text-center mt-2">
                        <button class="btn btn-ghost btn-block" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {API} from "@/constants";
import { useGlobalStore } from "@/stores/global";

const state = useGlobalStore();

const router = useRouter();
const route = useRoute();

const error = ref(undefined);
const username = ref("");
const password = ref("");

const tokenCookie = useCookie("token");

const authenticateWithToken = async (token: string) => {
    const res: any = await $fetch(`${API}/token_valid`, {body: {token}, method: "POST"});

    if(res.error) {
        error.value = res.error;
    }else {
        tokenCookie.value = token;
        
        state.$patch({token});

        await state.fetchUser();

        router.push("/dashboard/statistics");
    }
}

const authenticate = async () => {
    const res: any = await $fetch(`${API}/auth/login`, {body: {username: username.value, password: password.value}, method: "POST"});

    if(res.error) {
        error.value = res.error;
    }else {
        tokenCookie.value = res.data;
        
        state.$patch({token: res.data});

        await state.fetchUser();

        router.push("/dashboard/statistics");
    }
}

if(route.params.token) {
    authenticateWithToken(route.params.token as string);
}

</script>
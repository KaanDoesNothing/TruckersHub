<template>
    <Head>
        <Title>TruckersHub - Login</Title>
    </Head>
    
    <div class="flex justify-center mt-10">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-base-content">
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
import { useGlobalStore } from "@/stores/global";

const config = useRuntimeConfig();

const state = useGlobalStore();

const router = useRouter();
const route = useRoute();

const error = ref(undefined);
const username = ref("");
const password = ref("");

const tokenCookie = useCookie("token");

const authenticateWithToken = async (token: string) => {
    const res: any = await $fetch(`${config.public.API}/user/token/valid`, {body: {token}, method: "POST"});

    console.log(token, res);

    if(res.error) {
        error.value = res.error;
    }else {
        tokenCookie.value = token;
        
        await state.authenticate();

        await router.push("/client");
        // await router.push("/dashboard/statistics");
    }
}

const authenticate = async () => {
    const res: any = await $fetch(`${config.public.API}/user/login`, {body: {username: username.value, password: password.value}, method: "POST"});

    if(res.error) {
        error.value = res.error;
        alert(res.error);
    }else {
        tokenCookie.value = res.data.token;
        
        await state.authenticate();

        router.push("/dashboard/statistics");
    }
}

if(route.query.token) {
    authenticateWithToken(route.query.token as string);
}

</script>
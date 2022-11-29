<template>
    <div class="flex justify-center mt-10">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
                <h2 class="card-title">Register</h2>
                <form class="form-control" @submit.prevent="register">
                    <label class="label">
                        <span class="label-text">Username</span>
                    </label>
                    <input class="input input-bordered w-full max-w-xs" type="text" v-model="username"/>
                    <label class="label">
                        <span class="label-text">Password</span>
                    </label>
                    <input class="input input-bordered w-full max-w-xs" type="password" v-model="password"/>
                    <div class="card-actions text-center mt-2">
                        <button class="btn btn-ghost btn-block" type="submit">Register</button>
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

const register = async () => {
    const res: any = await $fetch(`${config.public.API}/user/register`, {body: {username: username.value, password: password.value}, method: "POST"});

    if(res.data) {
        router.push(`/auth/login/${res.data}`);
    }
}

</script>
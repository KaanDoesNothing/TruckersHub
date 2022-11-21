<script setup lang="ts">
import {useGlobalStore} from "@/stores/global";

const state = useGlobalStore();
const isDashboard = ref(false);
const isPhone = ref(false);

async function init() {
    // const res = await (await fetch("/api/session")).json();

    // if(!res.error) {
    // state.$patch({user: res});
    // }
}

const router = useRouter();

isDashboard.value = useRoute().path.startsWith("/dashboard")

if(process.client) {
    isPhone.value = window?.innerWidth < 1080;
}

router.afterEach((to, from) => {
    console.log(isPhone.value);
    isDashboard.value = to.path.startsWith("/dashboard");
});
</script>

<template>
    <div class="navbar bg-base-200">
        <div class="navbar-start">
            <RouterLink class="btn btn-ghost normal-case text-xl" to="/">TruckersHub</RouterLink>
        </div>
        <div class="navbar-end">
            <template v-if="isDashboard && isPhone">
                <label for="my-drawer-3" class="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </label>
            </template>
            <template v-if="!isDashboard && isPhone">
                <RouterLink class="btn" v-if="state.token" to="/dashboard/statistics">Dashboard</RouterLink>
            </template>
            <template v-if="!state.token">
                <div class="btn-group">
                    <RouterLink class="btn" to="/auth/login">Login</RouterLink>
                    <RouterLink class="btn" to="/auth/register">Register</RouterLink>
                </div>
            </template>
        </div>
    </div>
</template>
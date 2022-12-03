<script setup lang="ts">
import {useGlobalStore} from "@/stores/global";

const state = useGlobalStore();

const router = useRouter();
const route = useRoute();

const path = computed(() => route.path);
</script>

<template>
    <div class="navbar bg-base-200">
        <div class="navbar-start">
            <img src="/img/favicon.ico" class="h-8 w-8"/>
            <RouterLink class="btn btn-ghost normal-case text-xl" to="/">TruckersHub</RouterLink>
        </div>
        <div class="navbar-end">
            <label for="my-drawer-3" class="btn btn-square btn-ghost md:hidden" v-if="path.startsWith('/dashboard')">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </label>
            <RouterLink class="btn btn-ghost" v-if="state.token && !path.startsWith('/dashboard')" to="/dashboard/statistics">Dashboard</RouterLink>
            <template v-if="!state.token">
                <div class="btn-group">
                    <RouterLink class="btn btn-ghost" to="/auth/login">Login</RouterLink>
                    <RouterLink class="btn btn-ghost" to="/auth/register">Register</RouterLink>
                </div>
            </template>
        </div>
    </div>
</template>
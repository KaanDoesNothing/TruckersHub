<script setup lang="ts">
import {useGlobalStore} from "@/stores/global";

const state = useGlobalStore();

async function init() {
    // const res = await (await fetch("/api/session")).json();

    // if(!res.error) {
    // state.$patch({user: res});
    // }
}
</script>

<template>
    <div class="navbar bg-base-200">
        <div class="navbar-start">
            <RouterLink class="btn btn-ghost normal-case text-xl" to="/">TruckersHub</RouterLink>
        </div>
        <div class="navbar-end">
            <RouterLink class="btn" v-if="state.token" to="/dashboard/statistics">Dashboard</RouterLink>
            <template v-if="!state.token">
                <div class="btn-group">
                    <RouterLink class="btn" to="/auth/login">Login</RouterLink>
                    <RouterLink class="btn" to="/auth/register">Register</RouterLink>
                </div>
            </template>
        </div>
    </div>
</template>
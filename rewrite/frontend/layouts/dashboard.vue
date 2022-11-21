<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

const layout = "dashboard";

const state = useGlobalStore();

const authenticate = async () => {
    if(!localStorage) return;
    const token = localStorage.getItem("token");

    if(token) state.$patch({token});
    await state.fetchUser();
}

if(process.client) {
    state.$patch({phone: window?.innerWidth < 1080});
}

authenticate();
</script>

<template>
    <head>
        <title>TruckersHub - Dashboard</title>
    </head>

    <div v-if="state.user">
        <div class="drawer drawer-mobile">
            <input id="my-drawer-3" type="checkbox" class="drawer-toggle" /> 
            <div class="drawer-content flex flex-col">
                <slot></slot>
            </div>
            <div class="drawer-side h-screen overflow-y-hidden">
                <label for="my-drawer-3" class="drawer-overlay"></label> 
                <label class="bg-base-200 p-4 w-80">
                    <label class="text-center normal-case text-xl">General</label>
                    <ul class="menu mt-2">
                    <li><RouterLink class="rounded" to="/dashboard/statistics">Statistics</RouterLink></li>
                    <li> <RouterLink class="rounded" to="/dashboard/settings">Settings</RouterLink></li>
                    <!-- <li> <RouterLink class="rounded" to="/dashboard/settings_game" v-if="state.socket.settings">Game Settings</RouterLink></li> -->
                    </ul>
                    <label class="text-center normal-case text-xl">History</label>
                    <ul class="menu mt-2">
                    <li><RouterLink class="rounded" to="/dashboard/history/deliveries">Deliveries</RouterLink></li>
                    <li><RouterLink class="rounded" to="/dashboard/history/fines">Fines</RouterLink></li>
                    <li><RouterLink class="rounded" to="/dashboard/history/tollgates">Tollgates</RouterLink></li>
                    <!-- <li><RouterLink class="rounded" to="/dashboard/history/transport">Transport</RouterLink></li> -->
                    <li><RouterLink class="rounded" to="/dashboard/history/fuel">Fuel</RouterLink></li>
                    <!-- <li><RouterLink class="rounded" to="/dashboard/history/damages">Damages</RouterLink></li> -->
                    </ul>
                    <!-- <label class="text-center normal-case text-xl">VTC</label>
                    <ul class="menu mt-2">
                    <li><RouterLink class="rounded" :to="`/dashboard/vtc/view/${state.user.truckersmp.data.vtc.name}`" v-if="state.user?.truckersmp?.data?.vtc.inVTC">View</RouterLink></li>
                    <li><RouterLink class="rounded" to="/dashboard/vtc/list">List</RouterLink></li>
                    </ul> -->
                </label>
            </div>
        </div>
    </div>
</template>
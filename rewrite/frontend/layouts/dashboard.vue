<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

const layout = "dashboard";

const state = useGlobalStore();

const authenticate = async () => {
    const token = localStorage.getItem("token");

    if(token) state.$patch({token});
    await state.fetchUser();
}

authenticate();
</script>

<template>
    <div v-if="state.user">
        <div class="drawer drawer-mobile">
            <input class="drawer-toggle" id="my-drawer-2" type="checkbox">
            <div class="drawer-content">
                <slot></slot>
            </div>
            <div class="drawer-side p-4 w-80 bg-base-200 h-screen overflow-y-hidden">
                <label>
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
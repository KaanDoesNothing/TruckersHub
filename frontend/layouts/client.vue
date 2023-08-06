<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";
import { isElectron } from "~~/utils";

const config = useRuntimeConfig();

const layout = "client";

const state = useGlobalStore();
const router = useRouter();

const result = await state.authenticate();

if(!result) {
    router.push("/auth/login");
}

state.$patch({isElectron: isElectron()});
</script>

<template>
    <Html data-theme="night">
        <Head>
            <Title>TruckersHub</Title>
            <Link rel="icon" type="image/x-icon" href="/img/favicon.ico"/>
        </Head>
    </Html>

    <div v-if="state.user && !state.user?.blacklisted">
        <div class="drawer drawer-mobile">
            <input id="my-drawer-3" type="checkbox" class="drawer-toggle" /> 
            <div class="drawer-content flex flex-col">
                <slot></slot>
            </div>
            <div class="drawer-side h-screen overflow-y-hidden">
                <!-- <label for="my-drawer-3" class="drawer-overlay"></label> 
                <label class="bg-base-200 p-4 w-80">
                    <label class="text-center normal-case text-xl">General</label>
                    <ul class="menu mt-2">
                    <li><RouterLink class="rounded" to="/dashboard/statistics">Statistics</RouterLink></li>
                    <li> <RouterLink class="rounded" to="/dashboard/settings">Settings</RouterLink></li>
                    </ul>
                </label> -->
            </div>
        </div>
    </div>

    <div v-if="state.user?.blacklisted" class="text-center mt-10">
        <h1 class="text-2xl">You've been blocked from using TruckersHub</h1>
    </div>
</template>
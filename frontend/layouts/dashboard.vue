<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

const config = useRuntimeConfig();

const layout = "dashboard";

const state = useGlobalStore();
const router = useRouter();
const route = useRoute();

const tokenCookie = useCookie("token");
const isPlaying = ref(false);

const authenticate = async () => {
    const token = tokenCookie.value;

    if(!token) return router.push("/auth/login");
    state.$patch({token});
    await state.fetchUser();

    const res: any = await $fetch(`${config.public.API}/api/getPlayerLocation`, {body: {username: state.user.username}, method: "POST"});

    if(res.data && isPlaying.value !== true) isPlaying.value = true; 

    if(res.error && route.path.endsWith("/map")) router.push("/dashboard/statistics");
    
    if(process.browser) {
        setInterval(async () => {
            const res: any = await $fetch(`${config.public.API}/api/getPlayerLocation`, {body: {username: state.user.username}, method: "POST"});

            if(res.error && isPlaying.value !== false) isPlaying.value = false;
            if(res.data && isPlaying.value !== true) isPlaying.value = true; 

            if(res.error && route.path.endsWith("/map")) router.push("/dashboard/statistics");
        }, 30000);
    }
}

if(process.client) {
    state.$patch({phone: window?.innerWidth < 1080});
}

authenticate();
</script>

<template>
    <Html data-theme="night">
        <Head>
            <Title>TruckersHub - Dashboard</Title>
            <Link rel="icon" type="image/x-icon" href="/img/favicon.ico"/>
        </Head>
    </Html>

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
                    <label class="text-center normal-case text-xl">VTC</label>
                    <ul class="menu mt-2">
                        <li><RouterLink class="rounded" :to="`/dashboard/vtc/view/${state.user.linked?.truckersmp?.vtc?.name}`" v-if="state.user.linked?.truckersmp?.vtc?.inVTC">View</RouterLink></li>
                        <li v-if="isPlaying"><RouterLink class="rounded" :to="`/dashboard/vtc/map`">Live Map</RouterLink></li>
                        <li><RouterLink class="rounded" to="/dashboard/vtc/list">List</RouterLink></li>
                    </ul>
                </label>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

const layout = "default";

const state = useGlobalStore();

const tokenCookie = useCookie("token");

const authenticate = async () => {
    const token = tokenCookie.value;

    if(token) state.$patch({token});
    await state.fetchUser();
}

authenticate();
</script>

<template>
    <head>
        <title>TruckersHub</title>
        <meta content="TruckersHub" property="og:title"/>
        <meta content="Truckbook for Euro Truck Simulator 2" property="og:description"/>
        <meta content="https://truckershub.kaanlikescoding.me/" property="og:url"/>
    </head>
    <div>
        <slot></slot>
    </div>
</template>
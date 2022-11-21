<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

const layout = "default";

const state = useGlobalStore();

const authenticate = async () => {
    if(!localStorage) return;
    const token = localStorage.getItem("token");

    if(token) state.$patch({token});
    await state.fetchUser();
}

authenticate();
</script>

<template>
    <head>
        <title>TruckersHub</title>
    </head>
    <div>
        <slot></slot>
    </div>
</template>
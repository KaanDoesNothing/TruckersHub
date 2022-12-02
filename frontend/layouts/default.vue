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
    <div>
        <slot></slot>
    </div>
</template>
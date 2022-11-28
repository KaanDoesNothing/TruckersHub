<template>
    <iframe :src="`${config.public.API}/map${url}`" style="min-height: 100%;"></iframe>
</template>

<script setup lang="ts">
    import { useGlobalStore } from "@/stores/global";

    definePageMeta({
        layout: "dashboard"
    });

    const config = useRuntimeConfig();
    const state = useGlobalStore();
    const url = ref("");
    if(state.user?.username) {
        url.value = `?user=${encodeURIComponent(state.user.username)}&&vtc_name=${encodeURIComponent(state.user.linked.truckersmp.vtc.name)}`;
        // url.value = `${config.public.API}/map?data=$`
    }
</script>
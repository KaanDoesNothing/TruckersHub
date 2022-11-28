<template>
    <h1>test</h1>    
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

const config = useRuntimeConfig();

const route = useRoute();
const router = useRouter();
const state = useGlobalStore();

console.log(route.query);

const url = route.query["openid.identity"];

if(url && state.token) {
    const res: any = await $fetch(`${config.public.API}/socials/steam/authenticate`, {body: {token: state.token, url}, method: "POST"});

    if(res.data) {
        router.push("/");
    }
}

</script>

<template>
    <h1>test</h1>    
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";
import Axios from "axios";
import { API } from "@/constants";

const route = useRoute();
const router = useRouter();
const state = useGlobalStore();

const url = route.query["openid.identity"];

if(url && state.token) {
    const res = await Axios.post(`${API}/socials/steam/authenticate`, {token: state.token, url});

    if(res.data.data) {
        router.push("/");
    }
}

</script>

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
    <Head>
        <Title>TruckersHub</title>
        <Meta content="TruckersHub" property="og:title"/>
        <Meta content="Truckbook for Euro Truck Simulator 2" property="og:description"/>
        <Meta content="https://truckershub.kaanlikescoding.me/" property="og:url"/>
        <Meta charset="utf-8"/>
        <Meta name="description" content="A full-fledged free to use logging book for Euro Truck Simulator 2"/>
        <Link rel="icon" type="image/x-icon" href="/img/favicon.ico"/>
    </Head>
    <div>
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";
import {backgrounds} from "../information";

const layout = "default";

const state = useGlobalStore();

const tokenCookie = useCookie("token");

const authenticate = async () => {
    const token = tokenCookie.value;

    if(token) state.$patch({token});
    await state.fetchUser();
}

const config = useRuntimeConfig();

const background = backgrounds[Math.floor(Math.random()*backgrounds.length)];

authenticate();
</script>

<template>
    <Html data-theme="night">
        <Head>
            <Title>TruckersHub</title>
            <Meta content="TruckersHub" property="og:title"/>
            <Meta content="Truckbook for Euro Truck Simulator 2" property="og:description"/>
            <Meta content="https://truckershub.kaanlikescoding.me/" property="og:url"/>
            <Meta content="https://truckershub.kaanlikescoding.me/img/favicon.ico" property="og:image"></Meta>
            <Meta charset="utf-8"/>
            <Meta name="description" content="A full-fledged free to use logging book for Euro Truck Simulator 2"/>
            <Link rel="icon" type="image/x-icon" href="/img/favicon.ico"/>
        </Head>
    </Html>
    
    <div id="holder" :style="{ backgroundImage: 'url(' + background.url + ')' }" style="background-position: center; background-repeat: no-repeat; object-fit: cover;" class="object-cover min-h-screen min-w-screen">
        <slot></slot>
    </div>

    <div style="position: absolute; bottom: 5%; right: 5%;">
        <a href="https://github.com/KaanDoesNothing/TruckersHub">GitHub</a>
        <br>
        <a :href="('https://discord.com/users/'+ background.author)">Background Author</a>
    </div>
</template>
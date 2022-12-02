<template>
    <Head>
        <Title>TruckersHub - {{data.vtc.name}}</title>
        <Meta :content="`TruckersHub - ${data.vtc.name}`" property="og:title"/>
        <Meta :content="data.vtc.information" property="og:description"/>
        <Meta :content="data.vtc.logo" property="og:image"></Meta>
    </Head>

    <Loader v-if="!data"></Loader>
    <div class="card bg-base-200 shadow-xl m-4 text-primary-content text-base-content" v-if="data">
        <div class="card-body card-event">
            <label class="text-center text-2xl">{{data.vtc.name}}
                <label class="text-xl"> {{data.vtc.owner_username}}</label>
            </label>
            <br>
            <div class="avatar flex justify-center" v-if="data.vtc.logo">
                <div class="w-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img :src="data.vtc.logo">
                </div>
            </div>

            <br>
            <label class="text-center text-xl">Members</label>
            <br>
            <table class="table w-full">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Distance Traveled</th>
                        <th>Deliveries</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="member in data.members" :key="member.steam_id">
                        <th>{{data.members.indexOf(member) + 1}}</th>
                        <th>{{member.username}} {{member.online.data ? `(${member.online.data?.server.name})`: ""}} </th>
                        <th>{{member.distanceTraveled}}km</th>
                        <th>{{member.deliveryCount}}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "dashboard"
});

const config = useRuntimeConfig();

const route = useRoute();

const data = ref();

let fetchedVtc: any = await $fetch(`${config.public.API}/vtc`, {method: "POST", body: {name: route.params.vtc}});

fetchedVtc.data.members = fetchedVtc.data.members.sort((a: any, b: any) => b.deliveryCount - a.deliveryCount);
data.value = fetchedVtc.data;
</script>
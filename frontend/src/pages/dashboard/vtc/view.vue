<template>
    <div class="card bg-base-200 shadow-xl m-4 text-primary-content" v-if="data">
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
                <tr v-for="member in data.members.sort((a, b) => b.deliveryCount - a.deliveryCount)" :key="member.steam_id">
                    <th>{{data.members.indexOf(member)}}</th>
                    <th>{{member.username}}</th>
                    <th>{{member.distanceTraveled}}km</th>
                    <th>{{member.deliveryCount}}</th>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
export default {
    setup() {
        const route = useRoute();

        const data = ref();

        async function init() {
            const res = await(await fetch(`/api/vtc/${route.params.id}`)).json();

            data.value = res.data;
        }

        init();

        return {data};

        // console.log(route.params.id);
    },
}
</script>
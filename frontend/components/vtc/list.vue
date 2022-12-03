<template>
    <Head>
        <Title>TruckersHub - Browse VTCs</Title>
    </Head>

    <Loader v-if="!list"></Loader>
    
    <div class="flex justify-center">
        <input type="text" placeholder="Search a VTC" class="input input-sm input-bordered w-full max-w-xs" v-model="filter"/>
    </div>

    <br>
    
    <div class="overflow-x-auto flex justify-center p-5 bg-base-100" v-if="list">
        <table class="table w-full">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Members</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="vtc in list.filter(vtc => vtc.name.includes(filter))" :key="vtc.name">
                    <th>{{list.indexOf(vtc) + 1}}</th>
                    <th>{{vtc.name}}</th>
                    <th>{{vtc.memberCount}}</th>
                    <th><router-link class="btn" :to="`${isDashboard}/vtc/view/${vtc.name}`">View</router-link></th>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const config = useRuntimeConfig();

const filter = ref("");
const list = ref();
const isDashboard = useRoute().path.startsWith("/dashboard") ? "/dashboard" : "";

const fetchedList: any = await $fetch(`${config.public.API}/vtc/list`);
if(fetchedList.data) {
    list.value = fetchedList.data.list;
}
</script>

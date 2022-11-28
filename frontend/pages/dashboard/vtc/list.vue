<template>
    <Loader v-if="!list"></Loader>
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
                <tr v-for="vtc in list" :key="vtc.name">
                    <th>{{list.indexOf(vtc) + 1}}</th>
                    <th>{{vtc.name}}</th>
                    <th>{{vtc.memberCount}}</th>
                    <th><router-link class="btn" :to="`/dashboard/vtc/view/${vtc.name}`">View</router-link></th>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "dashboard"
});

const config = useRuntimeConfig();

const list = ref();

const fetchedList: any = await $fetch(`${config.public.API}/vtc/list`);
if(fetchedList.data) {
    list.value = fetchedList.data.list;
}
</script>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";
import { API } from "@/constants";

definePageMeta({
  layout: "dashboard"
});

const state = useGlobalStore();

const fetchedVtc: any = await $fetch(`${API}/vtc`, {method: "POST", body: {id: state.user.truckersmp.data.vtc.name}});

const onlineMembers = fetchedVtc.data.members.filter((member: any) => member.online.data).length;
</script>

<template>
    <div class="flex justify-center mt-10">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
            <h2 class="card-title">Statistics</h2>
            <p>Online VTC Members: {{onlineMembers === 0 ? "None": onlineMembers}}</p>
            <!-- <p>Deliveries: {{state.user.events?.length}}</p> -->
            </div>
        </div>
    </div>
</template>
<template>
  
</template>

<!-- <template>
    <div class="grid grid-cols-4 gap-4 p-4">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content" v-for="event in state.user.events.filter((event: any) => event.type === 'ferry' || event.type === 'train')">
            <div class="card-body card-event" v-if="event.data.game">
                <label class="card-title">{{event.type === "ferry" ? "Ferry" : "Train"}}</label>
                <p>From: {{event.data.event.source.name}}</p>
                <p>To: {{event.data.event.destination.name}}</p>
                <p>Price: ${{event.data.event.amount}}</p>
                <p>Date: {{new Date(event.createdAt).toLocaleString()}}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";
import Axios from "axios";
import { API } from "@/constants";

definePageMeta({
  layout: "dashboard"
});

const state = useGlobalStore();

const events: any = ref([]);

Axios.post(`${API}/events`, {token: state.token, type: "tollgate"}).then(res => events.value = res.data.data);
</script> -->

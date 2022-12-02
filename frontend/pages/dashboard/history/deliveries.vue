<template>
    <div class="grid flex justify-center md:grid-cols-4 md:gap-4 md:p-4">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content" v-for="event in events">
            <div class="card-body card-event text-base-content">
                <label class="card-title">Delivery</label>
                <template v-if="event.data.game">
                    <p>Revenue: ${{event.data.event.revenue}}</p>
                    <p>Distance: {{event.data.event.distance.km}} km</p>
                    <p>Cargo: {{event.data.event.cargo.name}}</p>
                    <p>From: {{event.data.event.source.city.name}} - {{event.data.event.source.company.name}}</p>
                    <p>To: {{event.data.event.destination.city.name}} - {{event.data.event.destination.company.name}}</p>
                    <p>Date: {{new Date(event.createdAt).toLocaleString()}}</p>
                </template>
                <template v-if="!event.data.game">
                    <p>Revenue: ${{event.data.revenue}}</p>
                    <p>Distance: {{event.data.distance.km}} km</p>
                    <p>Cargo: {{event.data.cargo.name}}</p>
                    <p>From: {{event.data.source.city.name}} - {{event.data.source.company.name}}</p>
                    <p>To: {{event.data.destination.city.name}} - {{event.data.destination.company.name}}</p>
                    <p>Date: {{new Date(event.createdAt).toLocaleString()}}</p>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

definePageMeta({
  layout: "dashboard"
});

const config = useRuntimeConfig();

const state = useGlobalStore();

const events: any = ref([]);

events.value = (await $fetch(`${config.public.API}/user/events`, {body: {token: state.token, type: "delivered"}, method: "POST"}) as any).data;
</script>

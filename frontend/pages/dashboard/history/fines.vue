<template>
  <div class="grid flex justify-center md:grid-cols-4 md:gap-4 md:p-4">
      <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content" v-for="event in events">
          <div class="card-body card-event text-base-content">
              <label class="card-title">Fine</label>
              <p>Reason: {{event.reason}}</p>
              <p>Location: {{event.location}}</p>
              <p>Price: ${{event.price}}</p>
              <p>Date: {{new Date(event.createdAt).toLocaleString()}}</p>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";
import { iEventFine } from "~~/types";

definePageMeta({
  layout: "dashboard"
});

const config = useRuntimeConfig();

const state = useGlobalStore();

const events = ref(<iEventFine[]>[]);

events.value = (await $fetch(`${config.public.API}/user/events`, {body: {token: state.token, type: "fine"}, method: "POST"}) as any).data;
</script>


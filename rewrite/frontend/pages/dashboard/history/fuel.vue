<template>
  <Loader v-if="events.length < 1"></Loader>
  <div class="grid flex justify-center md:grid-cols-4 md:gap-4 md:p-4">
      <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content" v-for="event in events">
          <div class="card-body card-event" v-if="event.data.game">
              <label class="card-title">Refuel</label>
              <p>Location: {{event.data.location}}</p>
              <p>Amount: {{Math.round(event.data.event.amount)}}</p>
              <p>Price: ${{Math.round(event.data.event.amount)}}</p>
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

Axios.post(`${API}/events`, {token: state.token, type: "refuel-paid"}).then(res => events.value = res.data.data);
</script>


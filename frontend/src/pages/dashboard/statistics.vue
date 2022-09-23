<script lang="ts">
import { defineComponent, ref } from "vue";
import {useUserStore} from "../../store";

export default defineComponent({
  setup() {
    const state = useUserStore();
    const isConnected = ref(false);

    async function fetchSocket() {
      const res = await (await fetch("/api/socket/settings")).json();

      if(!res.data.error) isConnected.value = true;
    }

    fetchSocket()

    return {state, isConnected};
  }
});
</script>

<template>
    <div class="flex justify-center mt-10">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
            <h2 class="card-title">Statistics</h2>
            <p>Connected: {{isConnected ? "Yes" : "No"}}</p>
            <p>Deliveries: {{state.user.events.length}}</p>
            </div>
        </div>
    </div>
</template>
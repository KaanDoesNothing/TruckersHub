<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

definePageMeta({
  layout: "dashboard"
});

const state = useGlobalStore();
</script>

<template>
    <div class="flex justify-center mt-10">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
            <h2 class="card-title">Statistics</h2>
            <!-- <p>Deliveries: {{state.user.events?.length}}</p> -->
            </div>
        </div>
    </div>
</template>
<template>
    <div class="flex justify-center flex-col">
        <div class="flex flex-col py-5 px-20 bg-gray-800 m-10 rounded-md" v-if="gameData.job?.source?.city?.name?.length > 0">
            <label class="text-xl">Current job</label>
            <!-- {{ JSON.stringify(gameData.job) }} -->

            <label>Delivery: {{ gameData.job.cargo.name }}</label>
            <label>Source: {{ gameData.job.source.city.name }}</label>
            <label>Destination: {{ gameData.job.destination.city.name }}</label>
            <label>Distance: {{ gameData.job.plannedDistance.km }}km</label>

            <!-- {{ gameData.game.timestamp.value }} -->
            <!-- {{ gameData.game.timestamp.value }}
            {{ gameData.job.expectedDeliveryTimestamp.value }} -->
        </div>

        <div class="flex flex-col text-center py-5 px-20 bg-gray-800 m-10 rounded-md">
            <label class="text-xl"></label>

            <div class="m-10">
                <table class="bg-gray-900 p-5 rounded-md">
                    <!-- head -->
                    <thead class="">
                        <tr>
                            <th>Time</th>
                            <th>Cargo</th>
                            <th>From</th>
                            <th>To</th>
                        </tr>
                        </thead>
                        <tbody>
                        <!-- row 1 -->
                        <tr>
                            <th class="p-5">1</th>
                            <td>Cy Ganderton</td>
                            <td>Quality Control Specialist</td>
                            <td>Blue</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/global";

    const config = useRuntimeConfig();
    const state = useGlobalStore();
    definePageMeta({
        layout: "client"
    });

    const gameData = ref<any>({});

    const fetchLoop = setInterval(async () => {
        const res = await $fetch<any>(`${config.public.API}/api/game/data`, {body: {token: state.token}, method: "POST"}).catch(err => console.log(err));

        if(!res.error) gameData.value = res.data;
    }, 1000);

    onUnmounted(() => clearInterval(fetchLoop));
</script>
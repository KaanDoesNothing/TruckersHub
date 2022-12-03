<template>
    <div class="md:p-20 md:mx-60">
        <div class="min-h-40 bg-base-200 rounded rounded-none md:rounded">
            <div class="text-center">
                <br>
                <label class="text-2xl">Features</label>

                <div class="grid flex justify-center md:grid-cols-2 md:gap-4 md:p-4 p-5">
                    <div class="text-primary-content bg-gray-700 rounded-md m-1" v-for="feature in features">
                        <div class="min-w-20 bg-primary min-h-40">
                            <label class="text-xl">{{feature.name}}</label>
                        </div>

                        <br>

                        <div class="text-neutral-content p-1">
                            <label>{{feature.description}}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const features = [
        {
            name: "History",
            description: "Keep track of your deliveries, fines, refuels, and tollgates"
        },
        {
            name: "Client",
            description: "Easy to setup client"
        },
        {
            name: "VTC",
            description: "Automatically imports your TruckersMP VTC"
        },
        {
            name: "Open Source",
            description: "TruckersHub is fully open source"
        }
    ];
</script>
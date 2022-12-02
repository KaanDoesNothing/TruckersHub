<template>
    <div id="holder" :style="{ backgroundImage: 'url(' + background.url + ')' }" style="background-position: center;" class="min-h-screen">
        <div class="lg:p-40">
            <div class="h-40 bg-base-200 rounded rounded-none md:rounded">
                <div class="text-center">
                    <br>
                    <label class="text-2xl">Welcome to TruckersHub</label>
                    <br>
                    <label>TruckersHub is an open source & free to use LogBook for Euro Truck Simulator 2</label>

                    <br>
                    <br>
                    <RouterLink to="/vtc/list" class="font-bold">Browse VTCs</RouterLink>
                </div>
            </div>

            <!-- <div class="mt-16">
                <div class="text-center">
                    <label class="text-2xl">Top VTCs</label>
                </div>

                <div>

                </div>
            </div> -->
        </div>
    </div>

    <div style="position: absolute; bottom: 5%; right: 5%;">
        <a :href="('https://discord.com/users/'+ background.author)">Background Author</a>
    </div>
    <!-- <div class="flex justify-center p-20"> -->
        <!-- <div class="p-10">
            <img src="@/assets/img/truck.png" class="w-64 ring rounded-full p-10 bg-gray-100" style="transform: translate(-50%, -50%);"/>
        </div> -->
    <!-- </div> -->
</template>

<script setup lang="ts">
    import {backgrounds} from "../information";

    const config = useRuntimeConfig();

    const background = backgrounds[Math.floor(Math.random()*backgrounds.length)];

    if(process.client) {
        const body = document.querySelector("body");
        // if(body) {
        //     body.style.backgroundImage = `url('${background.url}')`;
        //     body.style.minHeight = "100%";
        // }
    }

    
    // const fetchedList: any = await $fetch(`${config.public.API}/vtc/list`);

    // console.log(fetchedList.data.list);

    // const vtcs = await Promise.all(fetchedList.data.list.map(async (vtc: any) => await $fetch(`${config.public.API}/vtc`, {method: "POST", body: {name: vtc.name}})));

    // const sortedVTCs = vtcs.sort()
</script>

<style>
    body {
        /* overflow:auto; */
    }
</style>
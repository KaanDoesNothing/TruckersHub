<template>
    <div class="md:p-20 md:mx-60">
        <div class="min-h-40 bg-base-200 rounded rounded-none md:rounded">
            <div class="text-center">
                <br>
                <label class="text-2xl">Welcome to TruckersHub</label>
                <br>
                <label>TruckersHub is an open source & free to use LogBook for Euro Truck Simulator 2</label>

                <br>
                <div class="btn-group p-5">
                    <RouterLink to="/features" class="btn font-bold">Features</RouterLink>
                    <RouterLink to="/vtc/list" class="btn font-bold">Browse VTCs</RouterLink>
                </div>
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
    <!-- <div class="flex justify-center p-20"> -->
        <!-- <div class="p-10">
            <img src="@/assets/img/truck.png" class="w-64 ring rounded-full p-10 bg-gray-100" style="transform: translate(-50%, -50%);"/>
        </div> -->
    <!-- </div> -->
</template>

<script setup lang="ts">

    
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
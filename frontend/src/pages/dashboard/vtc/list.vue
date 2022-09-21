<template>
    <div class="overflow-x-auto flex justify-center p-5 bg-base-100">
        <table class="table w-full">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Members</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="vtc in list" :key="vtc.vtc_name">
                    <th>{{list.indexOf(vtc)}}</th>
                    <th>{{vtc.vtc_name}}</th>
                    <th>{{vtc.memberCount}}</th>
                    <th><router-link class="btn" :to="`/dashboard/vtc/view/${vtc.vtc_name}`">View</router-link></th>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { ref } from "vue";

export default defineComponent({
    setup() {
        const list = ref();

        async function init() {
            const res = await ((await fetch("/api/vtc/list")).json());
            list.value = res.data;
        }

        init();

        return {list: computed(() => list.value)};
    },
})
</script>

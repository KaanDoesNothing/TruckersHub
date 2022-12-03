<template>
  <div class="md:p-20 md:mx-60">
    <VtcView></VtcView>
  </div>
</template>
<script>
definePageMeta({
  layout: "default"
});
</script>

<!-- 
<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "dashboard"
});

const config = useRuntimeConfig();

const route = useRoute();

const data = ref();

let fetchedVtc: any = await $fetch(`${config.public.API}/vtc`, {method: "POST", body: {name: route.params.vtc}});

fetchedVtc.data.members = fetchedVtc.data.members.sort((a: any, b: any) => b.deliveryCount - a.deliveryCount);
data.value = fetchedVtc.data;
</script> -->
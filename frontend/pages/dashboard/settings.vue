<template>
    <div class="flex justify-center mt-10">
        <div class="card w-100 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
              <h2 class="card-title">Settings</h2>
              <a class="btn" :href="steam_info.url" :class="{'btn-disabled': state.user.linked?.steam?.id}">Link your steam account</a>
              <a class="btn" :href="`${config.public.CDN}/TruckersHub.zip`">Download Client</a>
              <a class="btn" :href="download.href" download="config.json">Download Config File</a>
              <div class="card-actions text-center">
                  <p><b>Do not share your token with anyone!</b></p>
              </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useGlobalStore} from "@/stores/global";

definePageMeta({
  layout: "dashboard"
});

const config = useRuntimeConfig();

const state = useGlobalStore();

const steam_info: any = await $fetch(`${config.public.API}/socials/steam/info`);

const configFile = JSON.stringify({
  api: config.public.SOCKET_API + "/api",
  token: state.token,
  shifter: false
});

const download = {
  href: `data:'text/json;charset=utf-8, ${encodeURIComponent(configFile)}`
}
</script>

<template>
    <div class="flex justify-center mt-10">
        <div class="card w-100 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body text-base-content">
              <h2 class="card-title">Settings</h2>
              <a class="btn" :href="steam_info.url" :class="{'btn-disabled': state.user.linked?.steam?.id}">Link your steam account</a>
              <a class="btn" :href="`${config.public.CDN}/TruckersHub.exe`">Download Client</a>
              <!-- <a class="btn" :href="download.href" download="config.json">Download Config File</a> -->
              <div class="card-actions text-center">
                  <p><b>Do not share your token with anyone!</b></p>
              </div>

              <!-- <br>
              <br>

              <div class="text-center line-break">
                <label class="text-center">Setup guide</label>
                <br>
                <label>1. Download the Client</label>
                <br>
                <label>2. Download the Config</label>
                <br>
                <label>3. Download the latest scs sdk <a href="https://github.com/RenCloud/scs-sdk-plugin/releases" style="color: aqua;">here</a></label>
              </div> -->
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

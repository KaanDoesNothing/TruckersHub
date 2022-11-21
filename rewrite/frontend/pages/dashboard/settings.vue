<template>
    <div class="flex justify-center mt-10">
        <div class="card w-100 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
            <h2 class="card-title">Settings</h2>
            <a class="btn" href="/auth/steam/link" :class="{'btn-disabled': state.user.steam_id}">Link your steam account</a>
            <a class="btn" :href="`${CDN}/TruckersHub.zip`">Download Client</a>
            <a class="btn" :href="download.href" download="config.json">Download Config File</a>
            <div class="card-actions text-center">
                <p><b>Do not share your token with anyone!</b></p>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {useGlobalStore} from "@/stores/global";
import { API, CDN } from "@/constants";

definePageMeta({
  layout: "dashboard"
});

export default defineComponent({
  setup() {
    const state = useGlobalStore();

    const configFile = JSON.stringify({
      api: API + "/api",
      token: state.token,
      shifter: false
    });

    return {
        state,
        download: {
            href: `data:'text/json;charset=utf-8, ${encodeURIComponent(configFile)}`
        },
        CDN
    }
  }
});
</script>

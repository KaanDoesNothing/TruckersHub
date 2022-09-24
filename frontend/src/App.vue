<script lang="ts">
import { defineComponent, computed } from "vue";
import Navbar from "./components/Navbar.vue";
import {useUserStore} from "./store";
import {useRoute} from "vue-router";
import {io} from "./socket";

export default defineComponent({
  components: {Navbar},
  setup() {
    const user = useUserStore();
    const route = useRoute();

    async function fetchSession() {
      const res = await (await fetch("/api/session")).json();

      if(!res.error) {
        user.$patch({user: res});

        io.emit("authenticate", {content: res.token});
      }
    }

    io.once("authenticated", () => {
        // fetchSocket();
    });

    io.on("client_settings", (data) => {
      user.$patch({socket: {settings: data}});
    });

    fetchSession();

    return {state: user, path: computed(() => route.path)};
  }
});
</script>

<template>
  <Navbar></Navbar>
  <div class="drawer drawer-mobile" v-if="path.startsWith('/dashboard') && state.user">
      <input class="drawer-toggle" id="my-drawer-2" type="checkbox">
      <div class="drawer-content">
        <router-view></router-view>
      </div>
      <div class="drawer-side p-4 w-80 bg-base-200 h-screen overflow-y-hidden">
        <label>
          <label class="text-center normal-case text-xl">General</label>
            <ul class="menu mt-2">
              <li><router-link class="rounded" to="/dashboard/statistics">Statistics</router-link></li>
              <li> <router-link class="rounded" to="/dashboard/settings">Settings</router-link></li>
              <li> <router-link class="rounded" to="/dashboard/settings_game" v-if="state.socket.settings">Game Settings</router-link></li>
            </ul>
            <label class="text-center normal-case text-xl">History</label>
            <ul class="menu mt-2">
              <li><router-link class="rounded" to="/dashboard/history/deliveries">Deliveries</router-link></li>
              <li><router-link class="rounded" to="/dashboard/history/fines">Fines</router-link></li>
              <li><router-link class="rounded" to="/dashboard/history/tollgates">Tollgates</router-link></li>
              <li><router-link class="rounded" to="/dashboard/history/transport">Transport</router-link></li>
              <li><router-link class="rounded" to="/dashboard/history/fuel">Fuel</router-link></li>
              <li><router-link class="rounded" to="/dashboard/history/damages">Damages</router-link></li>
            </ul>
            <label class="text-center normal-case text-xl">VTC</label>
            <ul class="menu mt-2">
              <li><router-link class="rounded" :to="`/dashboard/vtc/view/${state.user.truckersmp.data.vtc.name}`" v-if="state.user?.truckersmp?.data?.vtc.inVTC">View</router-link></li>
              <li><router-link class="rounded" to="/dashboard/vtc/list">List</router-link></li>
            </ul>
        </label>
      </div>
  </div>

  <template v-if="!path.startsWith('/dashboard')">
    <router-view></router-view>
  </template>
</template>
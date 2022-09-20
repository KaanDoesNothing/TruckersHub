<script lang="ts">
import { defineComponent } from "vue";
import {useUserStore} from "../store";

export default defineComponent({
  setup() {
    const state = useUserStore();

    async function init() {
      const res = await (await fetch("/api/session")).json();

      if(!res.error) {
        state.$patch({user: res});
      }
    }

    return {state};
  }
});
</script>

<template>
    <div class="navbar bg-base-200">
        <div class="navbar-start">
            <a class="btn btn-ghost normal-case text-xl" href="/">TruckersHub</a>
        </div>
        <div class="navbar-end">
            <router-link class="btn" v-if="state.user" to="/dashboard/statistics">Dashboard</router-link>
            <template v-if="!state.user">
                <div class="btn-group">
                    <a class="btn" href="/auth/login">Login</a>
                    <a class="btn" href="/auth/register">Register</a>
                </div>
            </template>
        </div>
    </div>
</template>
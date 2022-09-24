<template>
    <div class="flex justify-center mt-10">
        <div class="card w-100 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
                <h2 class="card-title">Game Settings</h2>
                <div class="form-control">
                    <label class="cursor-pointer label">
                        <span class="label-text">Paused</span>
                        <input type="checkbox" checked="checked" class="checkbox checkbox-accent" v-model="settings.paused" @change="updateSettings()"/>
                    </label>
                    <label class="cursor-pointer label">
                        <span class="label-text">Climb Detection</span>
                        <input type="checkbox" checked="checked" class="checkbox checkbox-accent" v-model="settings.hill_detection" @change="updateSettings()"/>
                    </label>
                    <label class="cursor-pointer label">
                        <span class="label-text">Hold Gear</span>
                        <input type="checkbox" checked="checked" class="checkbox checkbox-accent" v-model="settings.hold_gear" @change="updateSettings()"/>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from "vue";
import {io} from "../../socket";

export default {
    setup() {
        const settings = ref(undefined);

        function fetchSettings() {
            io.emit("client_settings");

            io.once("client_settings", (data) => settings.value = data);
        }

        function updateSettings() {
            io.emit("client_settings_update", settings.value);
        }

        fetchSettings();

        return {settings, updateSettings};
    }
}
</script>

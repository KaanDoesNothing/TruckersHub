<template>
    <div class="flex justify-center mt-10">
        <div class="card w-100 bg-base-100 shadow-xl m-1 text-primary-content">
            <div class="card-body">
                <h2 class="card-title">Game Settings</h2>
                <div class="form-control">
                    <!-- <label class="cursor-pointer label">
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
                    </label> -->
                </div>
            </div>
            <label>{{`Climbing: ${gameData.truck.orientation.pitch > 0.018}`}}</label>
            <label>Engine: {{gameData.truck.engine.enabled ? "On" : "Off"}}</label>
            <label>Speed: {{gameData.truck.speed.kph}}</label>
            <label>RPM: {{gameData.truck.engine.rpm.value.toFixed()}}</label>
            <label>Current Pitch: {{gameData.truck.orientation.pitch}}</label>
            <label>Current Gear: {{gameData.truck.transmission.gear.displayed}}</label>
            <label>Throttle: {{gameData.controls.input.throttle}}</label>
            <label>Climbing: {{gameData.truck.orientation.pitch > 0.018}}</label>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from "vue";
import {io} from "../../socket";

export default {
    setup() {
        const settings = ref(undefined);
        const gameData = ref(undefined);

        function fetchSettings() {
            io.emit("client_settings");

            io.once("client_settings", (data) => settings.value = data);
        }

        function updateSettings() {
            io.emit("client_settings_update", settings.value);
        }

        fetchSettings();

        io.on("game_data", (data) => {
            gameData.value = data;
        });

        setInterval(() => {
            io.emit("game_data");
        }, 1000);

        return {settings, updateSettings, gameData};
    }
}
</script>

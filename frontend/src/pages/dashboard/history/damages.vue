<template>
    <div class="grid grid-cols-4 gap-4 p-4">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content" v-for="event in state.user.events.filter((event: any) => event.type === 'truck_damage' || event.type === 'trailer_damage')">
            <div class="card-body card-event">
                <label class="card-title">{{event.type === "truck_damage" ? "Truck" : "Trailer"}}</label>
                <p v-if="event.type === 'truck_damage'">Vehicle: {{event.data.game.truck.make.name}}</p>
                <p v-if="event.type === 'trailer_damage'">Vehicle: {{event.data.game.trailer.model.name}}</p>
                
                <p>Location: {{event.data.location}}</p>
                <p>Total: {{Math.round(event.data.event.current.total * 100)}}%</p>
                <p>Damage: {{Math.round(event.data.event.current.total * 100) - Math.round(event.data.event.previous.total * 100)}}%</p>
                <p>Date: {{new Date(event.createdAt).toLocaleString()}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import {useUserStore} from "../../../store";

export default defineComponent({
  setup() {
    const state = useUserStore();

    return {state: state};
  }
});
</script>

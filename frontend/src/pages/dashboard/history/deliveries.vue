<template>
    <div class="grid grid-cols-4 gap-4 p-4">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content" v-for="event in state.user.events.filter((event: any) => event.type === 'delivered')">
            <div class="card-body card-event">
                <label class="card-title">Delivery</label>
                <template v-if="event.data.game">
                    <p>Revenue: ${{event.data.event.revenue}}</p>
                    <p>Distance: {{event.data.event.distance.km}} km</p>
                    <p>Cargo: {{event.data.event.cargo.name}}</p>
                    <p>From: {{event.data.event.source.city.name}} - {{event.data.event.source.company.name}}</p>
                    <p>To: {{event.data.event.destination.city.name}} - {{event.data.event.destination.company.name}}</p>
                    <p>Date: {{new Date(event.createdAt).toLocaleString()}}</p>
                </template>
                <template v-if="!event.data.game">
                    <p>Revenue: ${{event.data.revenue}}</p>
                    <p>Distance: {{event.data.distance.km}} km</p>
                    <p>Cargo: {{event.data.cargo.name}}</p>
                    <p>From: {{event.data.source.city.name}} - {{event.data.source.company.name}}</p>
                    <p>To: {{event.data.destination.city.name}} - {{event.data.destination.company.name}}</p>
                    <p>Date: {{new Date(event.createdAt).toLocaleString()}}</p>
                </template>
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

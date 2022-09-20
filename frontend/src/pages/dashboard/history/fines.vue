<template>
    <div class="grid grid-cols-4 gap-4 p-4">
        <div class="card w-80 bg-base-100 shadow-xl m-1 text-primary-content" v-for="event in state.user.events.filter((event: any) => event.type === 'fine')">
            <div class="card-body card-event" v-if="event.data.game">
                <label class="card-title">Fine</label>
                <p>Reason: {{event.data.event.offence.name}}</p>
                <p>Location: {{event.data.location}}</p>
                <p>Price: ${{event.data.event.amount}}</p>
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

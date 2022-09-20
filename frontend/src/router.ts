import { createWebHistory, createRouter } from "vue-router";
import Statistics from "./pages/dashboard/statistics.vue";
import Settings from "./pages/dashboard/settings.vue";
import Deliveries from "./pages/dashboard/history/deliveries.vue";
import Damages from "./pages/dashboard/history/damages.vue";
import Fines from "./pages/dashboard/history/fines.vue";
import Fuel from "./pages/dashboard/history/fuel.vue";
import Tollgates from "./pages/dashboard/history/tollgates.vue";
import Transport from "./pages/dashboard/history/transport.vue";


const routes = [
    {
        path: "/dashboard/statistics",
        name: "Statistics",
        component: Statistics
    },
    {
        path: "/dashboard/settings",
        name: "Settings",
        component: Settings
    },
    {
        path: "/dashboard/history/deliveries",
        name: "Deliveries",
        component: Deliveries
    },
    {
        path: "/dashboard/history/tollgates",
        name: "Tollgates",
        component: Tollgates
    },
    {
        path: "/dashboard/history/fines",
        name: "Fines",
        component: Fines
    },
    {
        path: "/dashboard/history/transport",
        name: "Transport",
        component: Transport
    },
    {
        path: "/dashboard/history/fuel",
        name: "Fuel",
        component: Fuel
    },
    {
        path: "/dashboard/history/damages",
        name: "Damages",
        component: Damages
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
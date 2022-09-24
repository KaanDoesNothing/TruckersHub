import { createWebHistory, createRouter } from "vue-router";
import Statistics from "./pages/dashboard/statistics.vue";
import Settings from "./pages/dashboard/settings.vue";
import GameSettings from "./pages/dashboard/settings_game.vue";
import Deliveries from "./pages/dashboard/history/deliveries.vue";
import Damages from "./pages/dashboard/history/damages.vue";
import Fines from "./pages/dashboard/history/fines.vue";
import Fuel from "./pages/dashboard/history/fuel.vue";
import Tollgates from "./pages/dashboard/history/tollgates.vue";
import Transport from "./pages/dashboard/history/transport.vue";
import vtcList from "./pages/dashboard/vtc/list.vue";
import vtcView from "./pages/dashboard/vtc/view.vue";
import login from "./pages/auth/login.vue";
import register from "./pages/auth/register.vue";

const routes = [
    {
        path: "/auth/login",
        name: "Login",
        component: login
    },
    {
        path: "/auth/register",
        name: "Register",
        component: register
    },
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
        path: "/dashboard/settings_game",
        name: "Game Settings",
        component: GameSettings
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
    },
    {
        path: "/dashboard/vtc/list",
        name: "List",
        component: vtcList
    },
    {
        path: "/dashboard/vtc/view/:id",
        name: "View",
        component: vtcView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
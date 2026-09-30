import { createApp } from "vue";
import App from "./App.vue";
import VueApexCharts from "vue3-apexcharts";
import { useDark } from "@vueuse/core";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/:pathMatch(.*)*", component: App }],
});
useDark({
  selector: "html",
  attribute: "data-theme",
  valueDark: "",
  valueLight: "light",
});

const app = createApp(App).use(VueApexCharts).use(router);
router.isReady().then(() => app.mount("#app"));

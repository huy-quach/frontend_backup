import "bootstrap/dist/css/bootstrap.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // JavaScript Bootstrap (nếu cần)
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// Gọi action để load lại user từ token khi ứng dụng khởi động
store.dispatch("loadUserFromToken");

const app = createApp(App);
app.use(router);
app.use(store);

// Mount the app
app.mount("#app");

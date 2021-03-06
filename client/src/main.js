import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./routes";
import Axios from "axios";
import CookieFunction from "@/utils/cookie.util";

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;

const token = CookieFunction.getCookie("sid");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

router.beforeEach((to, from, next) => {
  if (CookieFunction.getCookie("sid") && to.path === "/signin") {
    next("/");
  } else if (CookieFunction.getCookie("sid") && to.path === "/signup") {
    next("/");
  } else if (to.matched.some(record => record.meta.requiredAuth)) {
    if (store.getters.isLoggedIn || CookieFunction.getCookie("sid")) {
      next();
      return;
    }
    next("/signin");
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

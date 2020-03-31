import Vue from "vue";
import "@babel/polyfill";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/icon/iconfont.css";
import "@/styles/index.scss";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./icons"; // icon
import "./errorLog"; // error log
import "./registerServiceWorker";

function bootstrap(env) {

  Vue.use(Element);

  Vue.config.productionTip = false;
  new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
  });

}

bootstrap(ENV || process.env);


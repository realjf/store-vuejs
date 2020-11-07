import Vue from 'vue'
import App from './App.vue'

// 引入jquery
import $ from 'jquery'

Vue.config.productionTip = false

// 添加bootstrap框架
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

import store from "./store";
import router from "./router";
import Vuelidate from "vuelidate";

// 添加全局过滤
Vue.filter("currency", (value) => new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(value));

// 添加验证功能
Vue.use(Vuelidate);

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')

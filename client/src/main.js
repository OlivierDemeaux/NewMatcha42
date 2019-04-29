// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueFlashMessage from 'vue-flash-message'
import { sync } from 'vuex-router-sync'
import store from '@/store/store'
import VueLocalStorage from 'vue-localstorage'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'

Vue.use(VueResource);
Vue.use(VueFlashMessage);
Vue.use(Vuetify)
Vue.use(VueLocalStorage);
Vue.use(BootstrapVue);

sync(store, router)

Vue.config.productionTip = false;
Vue.http.options.root = 'http://localhost:8081/';
Vue.http.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8081/';
//axios.defaults.baseURL = 'http://localhost/8081';


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Routes from './routes.js'
import VueResource from 'vue-resource'
import Login from './components/Login.vue'
import Paginate from 'vuejs-paginate'
import DocumentTitle from './components/DocumentTitle.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.component('login',Login);
Vue.component('paginate', Paginate)
Vue.component('doc-title', DocumentTitle);
Vue.component('pulse-loader', PulseLoader);

export const bus = new Vue();

const router = new VueRouter({
  routes: Routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})

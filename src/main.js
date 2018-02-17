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
//Navigation Guards
router.beforeEach((to, from, next) => {
  //Allow access to home, login and register
  if (to.name == 'home' || to.name == 'login' || to.name == 'register') {
	 next();
  }else{
	let token = JSON.parse(localStorage.getItem('token'));
	if(token != null && token.token.length > 0){
		//Allow access to other routes when user is logged in
		next();
	}else{
		//Redirect to login page if user is not authenticated
		next({ path: '/login' })
	}
  }
});
new Vue({
  el: '#app',
  render: h => h(App),
  router: router
})

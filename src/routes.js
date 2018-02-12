import Home from './components/Home.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Shops from './components/Shops.vue'
import PreferredShops from './components/PreferredShops.vue'
import UserLocation from './components/UserLocation.vue'

export default [
  {path: '/', component: Home, name: 'home'},
  {path: '/login', component: Login, name: 'login'},
  {path: '/register', component: Register, name: 'register'},
  {path: '/shops', component: Shops, name: 'shops'},
  {path: '/preferred-shop', component: PreferredShops, name: 'pshops'},
   {path: '/set-location', component: UserLocation, name: 'ulocation'}
]

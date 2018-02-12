<template>
  <div>
	<app-header></app-header>
    <main role="main" class="container">
		<router-view></router-view>
    </main>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Header from './components/Header.vue'
import Register from './components/Register.vue'
import Shops from './components/Shops.vue'
import PreferredShops from './components/PreferredShops.vue'
import UserLocation from './components/UserLocation.vue'

export default {
  components:{
    'home':Home,
	'app-header':Header,
	'user-register':Register,
	'shops':Shops,
	'user-Preferredshops':PreferredShops,
  },
  data () {
    return{
      title: 'Shops'
    }
  }
}
</script>
<style>
body {
  padding-top: 5rem;
}
.starter-template {
  padding: 3rem 1.5rem;
  text-align: center;
}
</style>


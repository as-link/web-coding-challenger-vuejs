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

export default {
  components:{
    'home':Home,
	'app-header':Header,
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


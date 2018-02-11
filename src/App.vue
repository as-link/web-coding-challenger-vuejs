<template>
  <div>
    <main role="main" class="container">
		<home></home>
    </main>
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  components:{
    'home':Home,
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


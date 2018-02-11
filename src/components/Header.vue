<template>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <a class="navbar-brand" href="#">{{title}}</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link :to="{name: 'home'}" class="nav-link" exact>Home</router-link>
          </li>
          <li class="nav-item" v-if="!is_logged">
            <router-link :to="{name: 'login'}" class="nav-link" exact>Login</router-link>
          </li>
          <li class="nav-item" v-if="!is_logged">
            <router-link :to="{name: 'register'}" class="nav-link" exact>Register</router-link>
          </li>
        </ul>
      </div>
    </nav>
</template>

<script>
export default {
  data () {
    return{
      title: 'shops',
    }
  },
}
</script>
<style scoped>
  .router-link-active{
    color: #fff;
    font-weight: bold;
  }
</style>

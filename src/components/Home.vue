<template>
  <section class="jumbotron text-center">
    <div class="container">
      <h1 class="jumbotron-heading">Shops Web Coding Challenge</h1>
      <p class="lead text-muted">Something short and leading about the shops and features.<span v-if="!is_logged">Please login to view the content or register if you do not have an account.</span></p>
	  <p>
        <router-link v-if="!is_logged" :to="{name: 'login'}" class="btn btn-primary" exact>Login</router-link>
        <router-link v-if="!is_logged" :to="{name: 'register'}" class="btn btn-info" exact>Register</router-link>

        <router-link v-if="is_logged" :to="{name: 'shops'}" class="btn btn-primary" exact>Nearby shops</router-link>
        <router-link v-if="is_logged" :to="{name: 'pshops'}" class="btn btn-info" exact>Preferred shops</router-link>
      </p>
    </div>
  </section>
</template>

<script>
import {bus} from '../main';
export default {
  data () {
    return{
      title: 'Welcom',
	  is_logged: false,
    }
  },
  beforeMount(){
	//Submit an event based on whether the user is logged in or not
    let token = JSON.parse(localStorage.getItem('token'));
    if(token != null && token.token.length > 0){
      bus.$emit('userLoggedIn',true);
	  this.is_logged = true;
    }else{
      bus.$emit('userLoggedIn',false);
	  this.is_logged = false;
    }
  },
  created(){
      bus.$on('userLoggedIn',(data) =>{
      this.is_logged = data;
    });
  }
}
</script>

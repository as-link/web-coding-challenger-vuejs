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
          <li class="nav-item" v-if="is_logged">
            <router-link :to="{name: 'shops'}" class="nav-link" exact>Shops</router-link>
          </li>
          <li class="nav-item" v-if="is_logged">
            <router-link :to="{name: 'pshops'}" class="nav-link" exact>Preferred shops</router-link>
          </li>
          <li class="nav-item" v-if="is_logged">
            <router-link :to="{name: 'ulocation'}" class="nav-link" exact>My location</router-link>
          </li>
          <li class="nav-item dropdown" v-if="is_logged">
            <a class="nav-link dropdown-toggle" href="javascript:void()" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="fasle">{{name}}</a>
            <div class="dropdown-menu" aria-labelledby="dropdown01">
              <a v-on:click.prevent="logout()" href="javascript:void()" class="dropdown-item">Logout</a>
            </div>
          </li>
        </ul>
      </div>
    </nav>
</template>

<script>
import {bus} from '../main';
export default {
  data () {
    return{
      title: 'Shops',
      is_logged: false,
      name:''
    }
  },
    beforeMount(){
	//Set the user's name in the header if logged
    let token = JSON.parse(localStorage.getItem('token'));
    if(token != null && token.token.length > 0){
      this.is_logged = true;
      this.name = token.name;
    }
  },
  created(){
	//Listen to a login event
    bus.$on('userLoggedIn',(data) =>{
		this.is_logged = data;
		let token = JSON.parse(localStorage.getItem('token'));
		if(token != null && token.token.length > 0){
			this.name = token.name;
		}
    });
  },
  methods:{
    logout:function(){
      let token = JSON.parse(localStorage.getItem('token'));
      //call api logout url
        this.$http.post("http://www.shops.loc/api/logout",{},{
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token.token
          }
        }).then(function(data){
        //remove token from storage
          localStorage.removeItem('token');
          token = null;
          this.is_logged = false;
          this.$router.push({ name: 'login'});
        });
    }
  }
}
</script>
<style scoped>
  .router-link-active{
    color: #fff;
    font-weight: bold;
  }
</style>

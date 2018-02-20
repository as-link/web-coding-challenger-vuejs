<template>
  <div>
    <doc-title :title="title"></doc-title>
    <h1>{{ title }}</h1>
    <br>
	  <div style="text-align:center;">
		<pulse-loader :loading="loading"></pulse-loader>
	  </div>
	<div v-if="error" class="alert alert-danger" role="alert">{{message}}
        <button type="button" class="close" v-on:click.prevent="hideMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <h6>Dont have an account ? <router-link to="/register" class="text-primary" exact>Register</router-link></h6>
    <br>
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Email</label>
        <input v-model="user.email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input v-model="user.password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
      </div>
      <button v-on:click.prevent="submitLogin" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
import {bus} from '../main';
export default {
  data () {
    return{
      title: 'Login',
      error: 0,
      message: '',
	  loading: false,
      user:{
        email:"",
        password:"",
      }
    }
  },
  created(){
   //Redirect the user if already logged in and try to access login page
    if(JSON.parse(localStorage.getItem('token') != null)){
      let token = JSON.parse(localStorage.getItem('token'));
      if(typeof token != 'undefined'){
        this.$router.push({ name: 'shops'});
      }
    }
  },
  methods:{
	// Submit the credentials
    submitLogin:function(){
	  this.error = 0;
	  this.loading = true;
      this.$http.post("http://www.shops.loc/api/login",{
        email: this.user.email,
        password: this.user.password
      }).then(response => {
		      //Store the token in localStorage
              localStorage.setItem('token', JSON.stringify({
                name: response.body.user.name,
                token: response.body.user.token
              }));
              bus.$emit('userLoggedIn',true);
			  this.getLocation();
          }, response => {
			  this.loading = false;
              this.error = 1;
              this.message = response.body.error;
        });
    },
	//Get the use location
	getLocation:function(){
        let token = JSON.parse(localStorage.getItem('token'));
        this.$http.get("http://www.shops.loc/api/get-location",{
          headers: {'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token.token
                  }}).then(response => {
        this.lat = response.body.data.lat;
        this.lng = response.body.data.lng;
        if(this.lat != '' && this.lng != ''){
		  //Redirect the user to nearby shops page if has already set his location
          this.$router.push({ name: 'shops'});
        }else{
		  //Redirect the user the location page so he can set his location
          this.$router.push({ name: 'ulocation'});
        }
      });
    },
	hideMessage:function(){
		this.error = 0;
		this.success = 0;
	}
  }
}
</script>

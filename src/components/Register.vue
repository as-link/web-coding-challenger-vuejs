<template>
  <div>
    <doc-title :title="title"></doc-title>
    <h1>{{ title }}</h1>
    <br>
	  <div style="text-align:center;">
		<pulse-loader :loading="loading"></pulse-loader>
	  </div>
    <div v-if="error" v-html="message" class="alert alert-danger" role="alert"></div>
      <form>
        <div class="form-group">
          <label for="name">Name</label>
          <input v-model="user.name" type="text" class="form-control" id="name" aria-describedby="emailHelp" placeholder="Enter your name" name="">
        </div>
        <div class="form-group">
          <label for="exampleInputEmail1">Email</label>
          <input v-model="user.email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input v-model="user.password" type="password" name="" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <div class="form-group">
          <label for="RexampleInputPassword1">Repeat Password</label>
          <input v-model="user.c_password" type="password" name="" class="form-control" id="RexampleInputPassword1" placeholder="Repeat Password">
        </div>
        <button v-on:click.prevent="submitRegister" class="btn btn-primary">Register</button>
      </form>
  </div>
</template>

<script>
import {bus} from '../main';
export default {
  data () {
    return{
      title: 'Create account',
      user:{
        name:"",
        email:"",
        password:"",
        c_password:""
      },
      error: 0,
      message: '',
	  loading: false,
    }
  },
  created(){
	//Redirect the user if already logged in and try to access register page
    if(JSON.parse(localStorage.getItem('token') != null)){
      let token = JSON.parse(localStorage.getItem('token'));
      if(typeof token != 'undefined'){
        this.$router.push({ name: 'shops'});
      }
    }
  },
  methods:{
  //Submit data for registration
  submitRegister:function(){
	this.error = 0;
	this.loading = true;
    this.$http.post("http://www.shops.loc/api/register",{
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      c_password: this.user.c_password
    }).then(response => {
		//User is logged in on registration success
		//Store the token 
         localStorage.setItem('token', JSON.stringify({
            name: response.body.user.name,
            token: response.body.user.token
        }));
		bus.$emit('userLoggedIn',true);
        this.$router.push({ name: 'ulocation'});
      }, response =>{
            let text = '';
            for (var key in response.body.error) {
              text += '<p>' + response.body.error[key] + '</p>';
            }
			this.loading = false;
            this.error = 1;
            this.message = text;
      });
  }
 }
}
</script>

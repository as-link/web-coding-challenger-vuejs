<template>
  <div>
    <doc-title :title="title"></doc-title>
    <h1>{{ title }}</h1>
    <h6>Please type your address</h6>
    <br>
    <div class="alert alert-success" role="alert" v-if="success">{{message}}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="alert alert-danger" role="alert" v-if="error">{{message}}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <vue-google-autocomplete
      ref="address"
      id="map"
      classname="form-control"
      placeholder="Please type your address"
      v-on:placechanged="getAddressData">
    </vue-google-autocomplete>
    <br>
	<div style="text-align:center;">
		<pulse-loader :loading="loading"></pulse-loader>
	</div>
    <p v-if="!noLocation && !loading" class="text-primary">Latitude : {{lat}}</p>
    <p v-if="!noLocation && !loading" class="text-primary">Longitude : {{lng}}</p>
    <button type="button" class="btn btn-success" v-on:click.prevent="setLocation()">Set my location</button>
  </div>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'
export default {
  components: { VueGoogleAutocomplete },
  data () {
    return{
      title: 'Set your location',
      address: '',
      lat: '',
      lng: '',
      noLocation : true,
      success: 0,
      error: 0,
      message: '',
	  loading: true,
    }
  },
  created(){
  // Get the user location if set and display it
    let token = JSON.parse(localStorage.getItem('token'));
    this.$http.get("http://www.shops.loc/api/get-location",{
      headers: {'Accept': 'application/json',
                'Authorization': 'Bearer ' + token.token
              }
    }).then(response => {
      this.lat = response.body.data.lat;
      this.lng = response.body.data.lng;
      if(this.lat != '' && this.lng != ''){
        this.noLocation = false;
		this.loading = false;
      }
    });
  },
  mounted() {
    this.$refs.address.focus();
  },
  methods: {
	//Get the lat/lng from VueGoogleAutocomplete based on the entered address
    getAddressData: function (addressData, placeResultData, id) {
        this.lat = addressData.latitude;
        this.lng = addressData.longitude;
    },
	//Set location
    setLocation: function(){
	  this.loading = true;
      let token = JSON.parse(localStorage.getItem('token'));
      let headers = {'Accept': 'application/json',
                     'Authorization': 'Bearer ' + token.token};
      let body = {lat: this.lat,
                  lng: this.lng};
		//Add location if the user doesn't have one
      if(this.noLocation){
        this.$http.post("http://www.shops.loc/api/set-location",
                body,{ headers: headers })
        .then(response => {
          if(response.body.success.length){
            this.success = 1;
            this.message = response.body.success;
          }else if(response.body.error.length){
            this.error = 1;
            this.message = response.body.error;
          }
          this.noLocation = false;
		  this.loading = false;
        });
      }else { 
		// Update the user's location
        this.$http.put("http://www.shops.loc/api/set-location",
                body,{ headers: headers })
        .then(response => {
          if(response.body.success.length){
            this.success = 1;
            this.message = response.body.success;
          }else if(response.body.error.length){
            this.error = 1;
            this.message = response.body.error;
          }
          this.noLocation = false;
		  this.loading = false;
        });
      }
    }
  }
}
</script>

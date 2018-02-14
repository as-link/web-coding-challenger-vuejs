<template>
  <div>
    <doc-title :title="title"></doc-title>
    <h1>{{ title }}</h1>
    <br>
	  <div v-if="success" class="alert alert-success" role="alert">{{message}}
        <button type="button" class="close" v-on:click.prevent="hideMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div v-if="error" class="alert alert-danger" role="alert">{{message}}
        <button type="button" class="close" v-on:click.prevent="hideMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div v-if="no_data" class="alert alert-danger" role="alert">You haven't liked any shop yet</div>
	  <div style="text-align:center;">
		<pulse-loader :loading="loading"></pulse-loader>
	  </div>
      <div class="card-deck mb-4" v-if="!loading"  v-for="i in Math.ceil(shops.length / 2)">
        <div class="card" style="max-width: 50%"  v-for="shop in shops.slice((i - 1) * 2, i * 2)">
          <img class="card-img-top" v-bind:src="shop.picture" alt="">
          <div class="card-body">
            <h3 class="card-title">{{shop.name}}</h3>
            <p class="card-text">{{shop.description}}</p>
            <p class="card-text"><small class="text-muted">{{shop.email}}</small></p>
            <a class="btn btn-danger" v-on:click.prevent="unlikeShop(shop.id)" role="button">Unlike</a>
          </div>
        </div>
      </div>
      <nav  v-if="!loading && pagination > 1" >
        <paginate
          :page-count="pagination"
          :page-range="3"
          :margin-pages="2"
          :click-handler="getListPreferredShops"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :prev-class="'page-item'"
          :next-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-link-class="'page-link'"
          >
        </paginate>
      </nav>
  </div>
</template>

<script>
export default {
  data () {
    return{
      title: 'List of preferred shops',
      shops:[],
      pagination:'',
      no_data: false,
      page: '',
      error: 0,
      success: 0,
      message: '',
	  loading: true
    }
  },
  created(){
    this.getListPreferredShops();
  },
  methods:{
	//Get the paginated list of the shops that the user liked
    getListPreferredShops:function(page = ''){
        let token = JSON.parse(localStorage.getItem('token'));
        let url = "";
        this.page = page;
        if(this.page == ''){
          url = "http://www.shops.loc/api/preffered-shops";
        }else{
          url ="http://www.shops.loc/api/preffered-shops?page="+this.page;
        }
        this.$http.get(url,{
          headers: {'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token.token
                  }
        }).then(response => {
		  this.loading = false;
          if(response.body.data.length == 0){
            this.no_data = true;
            this.shops = [];
          }else{
            this.shops = response.body.data;
            this.pagination = response.body.meta.last_page;
          }
        });
    },
	// Unlike a shop to remove it from the Preferred shops list
    unlikeShop:function(shop_id){
	  this.loading = true;
      let token = JSON.parse(localStorage.getItem('token'));
      let url = "http://www.shops.loc/api/remove-like-"+shop_id;
      window.scrollTo(0, 0);
      this.$http.delete(url,{
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token.token
          }
        }).then(response => {
          if(response.body.success.length){
            this.success = 1;
            this.message = response.body.success;
            this.getListPreferredShops();
          }else if(response.body.error.length){
            this.error = 1;
            this.message = response.body.error;
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

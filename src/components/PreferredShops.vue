<template>
  <div>
    <doc-title :title="title"></doc-title>
    <h1>{{ title }}  <span class="h1_page">{{page_title}}</span></h1>
    <br>
	  <div v-if="success && !no_data && !loading" class="alert alert-success" role="alert">{{message}}
        <button type="button" class="close" v-on:click.prevent="hideMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div v-if="error && !no_data && !loading" class="alert alert-danger" role="alert">{{message}}
        <button type="button" class="close" v-on:click.prevent="hideMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div v-if="no_data" class="alert alert-warning" role="alert">You have no preferred shop!</div>
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
          :click-handler="goToPage"
          :prev-text="'Prev'"
          :next-text="'Next'"
          :container-class="'pagination'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :prev-class="'page-item'"
          :next-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-link-class="'page-link'"
		  ref="currentP"
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
      page: this.$route.params.page ? this.$route.query.page : 1,
      error: 0,
      success: 0,
      message: '',
	  loading: true,
	  page_title: ''
    }
  },
  created(){
    this.getListPreferredShops();
	 window.onpopstate =  () => {
	   this.$router.go({ path: document.location.pathname });
	 }
  },
  updated(){
	  if(this.$refs.currentP){
		this.$refs.currentP.selected = this.page - 1;
	  }
  },
  methods:{
	//Get the paginated list of the shops that the user liked
    getListPreferredShops:function(){
        let token = JSON.parse(localStorage.getItem('token'));
        let url = "";
		window.scrollTo(0, 0);
        this.page = this.$route.params.page ? this.$route.params.page : 1;
        if(this.page == ''){
          url = "http://www.shops.loc/api/preffered-shops";
		  this.page_title = '';
        }else{
          url ="http://www.shops.loc/api/preffered-shops?page="+this.page;
		  if(this.page > 1){
			this.page_title = ' - page '+this.page;
		  }else{
			this.page_title = '';
		  }
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
	},
	goToPage:function(page){
		this.$router.push({ name: 'pshops', params: { page: page }});
		this.getListPreferredShops();
		this.$refs.currentP.selected = page - 1;
	}
  }
}
</script>
<style scoped>
h1 span.h1_page{
	font-size:28px;
	color:#aaa;
}
</style>
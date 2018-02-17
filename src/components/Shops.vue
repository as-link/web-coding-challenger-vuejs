<template>
  <div>
    <doc-title :title="title"></doc-title>
    <h1>{{ title }} <span class="h1_page">{{page_title}}</span></h1>
    <br>
	  <div v-if="success && !loading" class="alert alert-success" role="alert">{{message}}
        <button type="button" class="close" v-on:click.prevent="hideMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div v-if="error && !loading" class="alert alert-danger" role="alert">{{message}}
        <button type="button" class="close" v-on:click.prevent="hideMessage()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
	  <div style="text-align:center;">
		<pulse-loader :loading="loading"></pulse-loader>
	  </div>
      <div class="card-deck mb-4" v-if="!loading"  v-for="i in Math.ceil(shops.length / 2)">
        <div class="card"  v-for="shop in shops.slice((i - 1) * 2, i * 2)">
          <img class="card-img-top" v-bind:src="shop.picture" alt="">
          <div class="card-body">
            <h3 class="card-title">{{shop.name}}</h3>
            <p class="card-text">{{shop.description}}</p>
            <p class="card-text"><small class="text-muted">{{shop.email}}</small></p>
            <a class="btn btn-success" v-on:click.prevent="setOpinion(1,shop.id)" role="button">Like</a>
            <a class="btn btn-warning" v-on:click.prevent="setOpinion(0,shop.id)" role="button">Dislike</a>
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
          >
        </paginate>
      </nav>
  </div>
</template>

<script>
export default {
  data () {
    return{
      title: 'List of nearby shops',
      shops:[],
      pagination:'',
      page: '',
      error: 0,
      success: 0,
      message: '',
	  loading: true,
	  page_title: ''
    }
  },
  created(){
      this.getListShops();
  },
  methods:{
	//Get the list of nearby shops 
    getListShops:function(){
		window.scrollTo(0, 0);
        let token = JSON.parse(localStorage.getItem('token'));
        let url = "";
        this.page = this.$route.query.page;
        if(this.page == ''){
          url = "http://www.shops.loc/api/nearby-shops";
		  this.page_title = '';
        }else{
          url ="http://www.shops.loc/api/nearby-shops?page="+this.page;
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
          this.shops = response.body.data;
          this.pagination = response.body.meta.last_page;
		  this.loading = false;
        });
    },
	//Set an opinion (Like(1)/ Dislike(0)) for a giving shops
    setOpinion:function(op,shop_id){
	  this.loading = true;
      let token = JSON.parse(localStorage.getItem('token'));
      let body = {opinion: op, shop_id: shop_id};
      let headers = {'Accept': 'application/json',
                     'Authorization': 'Bearer ' + token.token};
      window.scrollTo(0, 0);
      this.$http.post("http://www.shops.loc/api/new-opinion",body, {
        headers: headers }).then(response =>{
          if(response.body.success.length){
            this.success = 1;
            this.message = response.body.success;
          }else if(response.body.error.length){
            this.error = 1;
            this.message = response.body.error;
          }
          this.getListShops();
      });
    },
	hideMessage:function(){
		this.error = 0;
		this.success = 0;
	},
	goToPage:function(page){
		this.$router.push({ name: 'shops', query: { p: page }})
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
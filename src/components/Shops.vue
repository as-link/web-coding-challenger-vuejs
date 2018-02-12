<template>
  <div>
    <h1>{{ title }}</h1>
    <br>
      <div v-if="success" class="alert alert-success" role="alert">{{message}}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div v-if="error" class="alert alert-danger" role="alert">{{message}}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div v-if="shops.length == 0"> Loading...</div>
      <div class="card-deck mb-4" v-if="shops.length > 0"  v-for="i in Math.ceil(shops.length / 2)">
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
      <nav  v-if="shops.length > 0 && pagination > 1" >
        <paginate
          :page-count="pagination"
          :page-range="3"
          :margin-pages="2"
          :click-handler="getListShops"
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
      message: ''
    }
  },
  created(){
      this.getListShops();
  },
  methods:{
    getListShops:function(page = ''){
        let token = JSON.parse(localStorage.getItem('token'));
        let url = "";
        this.page = page;
        if(this.page == ''){
          url = "http://localhost/shops-laravel/public/api/nearby-shops";
        }else{
          url ="http://localhost/shops-laravel/public/api/nearby-shops?page="+this.page;
        }
        this.$http.get(url,{
          headers: {'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token.token
                  }
        }).then(response => {
          this.shops = response.body.data;
          this.pagination = response.body.meta.last_page;
        });
    },
    setOpinion:function(op,shop_id){
      let token = JSON.parse(localStorage.getItem('token'));
      let body = {opinion: op, shop_id: shop_id};
      let headers = {'Accept': 'application/json',
                     'Authorization': 'Bearer ' + token.token};
      window.scrollTo(0, 0);
      this.$http.post("http://localhost/shops-laravel/public/api/new-opinion",body, {
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
    }
  }
}
</script>

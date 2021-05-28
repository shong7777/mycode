const storage = sessionStorage;
Vue.component('adv-item', {
    props: ['product'],
    data() {
        return {
            showInfo: false,
        }
    },
    template: `
    <div>
        <img src="" alt=""  :src="product.ADV_IMG"  @click='clickAdv'>
    </div>
    `,
    methods: {
        clickAdv(){
            app.advproduct=this.product;
            app.advInfo=true;
        }
    },
    computed: {
    },
    watch: {
    }
});
//單一商品的卡片
Vue.component('product-card', {
    props: ['product'],
    data() {
        return {
            showInfo: false,
        }
    },
    template: `
    <div class="productcard col-xs-12 col-sm-6 col-lg-4">
        <div class="card_padding">
            <img :src="product.IMG" alt="" srcset="">
            <span class="p_name">{{product.NAME}}</span>
            <p class="p_info">{{product.INFO}}</p>
            <span class="p_more" @click='showInfo=true'>more</span>
            <div class="price">NT {{product.PRICE}}</div>
            <input type="button" value="加入購物車" class="add_cart" @click="addCart">
            <input type="hidden" name="" :value='hiddenValue' class='productInfo' :id="product.ID">
        </div>
        <div class='infoLB' v-if="showInfo" @click.self='showInfo=false'>
            <div>
                <div class='P_img'>
                <img :src="product.IMG" alt="" srcset="">
                </div>
                <div class='P_info'>
                    <span class='closeLB' @click='showInfo=false'>×</span>
                    <h4>{{product.NAME}}</h4>
                    <p>{{product.INFO}}</p>
                    <input type="button" value="加入購物車" class="add_cart" @click="addCart">
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {

        addCart() {
            if (storage[this.product.ID]) {
                app.addcartLBText = '已經在購物車內囉。';
                app.addcartLB = true;
            } else {
                storage[this.product.ID] = this.hiddenValue;
                storage['addItemList'] += this.product.ID + ',';
                app.addItemList.push(this.product.ID);
                app.addcartLBText = '已加入購物車。';
                app.addcartLB = true;
            }
        },
    },
    computed: {
        hiddenValue() {
            let product = this.product;
            let value = product.ID + '|' + product.NAME + '|' + product.IMG + '|' + product.PRICE + '|1';
            return value;
        },
    },
    watch: {
        addItemList() {
            storage['addItemList'] = addItemList
        }
    }
});
Vue.component('cartItem',{
    data(){return{
        name:null,
        img:null,
        price:null,
        num:null,
    }},
    template:`<div class="cart-item row">
                <div class="item_img col-4 col-sm-4">
                    <img :src="img" alt="">
                </div>
                <div class="item_info col-7 row">
                    <span class=' col-12'>{{name}}</span>
                    <span class='col-sm-6 col-12'>數量：<input type="number" name="" id="" class="itemNum"  v-model="num" max='12' min='1'></span>
                    <div class="item_price col-sm-6 col-12">
                        <span>小計:</span>
                        <span>{{calamount}}</span>
                    </div>
                </div>
                <span class="dropitem col-1" @click="dropItem">&#10005;</span>
            </div>`,
    props: ['id','index'],
    methods:{
        dropItem(){
            this.num=0;
            this.$emit('numchange', [this.calamount,this.index]);
            storage.removeItem(this.id);
            let list= storage['addItemList'].split(',');
            list.pop();
            let index=list.indexOf(this.id);
            list.splice(index,1);
            if(list.length>0){
                storage['addItemList']= list+',';
            }else{
                storage['addItemList']= '';
            };
            app.addItemList=storage['addItemList'].split(',');
            app.addItemList.pop();
        },
    },
    computed:{
        calamount(){
           return this.price* this.num;
        },
    },
    created(){
        let info=storage[this.id].split('|');
        this.name=info[1];
        this.img=info[2];
        this.price=info[3];
        this.num=info[4];
    },
    updated(){

    },
    watch:{
        calamount:function(){
            let info=storage[this.id].split('|');
            info.splice(4,1);
            info.push(this.num)
            info=info.join('|');
            storage[this.id]=info;
            this.$emit('numchange', [this.calamount,this.index])
        }
    }
 
});
const app = new Vue({
    el: "#app",
    data() {
        return {
            Allproducts: [],
            products:[],
            advs: [],
            type: ['塔', '蛋糕'],
            type2: ['咖啡','產地'],
            // pages: [1, 2, 3, 4, 5, 6, 7],
            nowpage: 12,
            slickAdvs: true,
            selectedType: '塔',
            addcartLBText: '已加入購物車。',
            addcartLB: false,
            addItemList: [],
            cartShow: false,
            notice:false,
            total:0,
            advInfo:false,
            advproduct:null,
            perpageNum:1,
        }
    },
    created() {
        if (storage['addItemList']) {
            let l=storage['addItemList'].split(',');
            l.pop();
            this.addItemList = l;
        } else {
            storage['addItemList'] = '';
        }
        axios
            .all([this.getProducts(this.whatorderby), this.getShoppingAdv(), ]).then(axios.spread(function(Products, ShoppingAdv) {
                app.Allproducts = Products.data[0];
                let type=[];
                for(let i in Products.data[1]){
                    type.push(Products.data[1][i].TYPE)
                }
                app.type = type;
                app.advs = ShoppingAdv.data;
            }));
    },
    mounted() {
      
    },
    updated() {
        if (this.slickAdvs) {
            $('#adv').slick({
                arrows: true,
                autoplay: true,
                autoplaySpeed: 2000,
                infinite: true,
                dots: true,
                slidesToScroll: 1,
                slidesToShow: 1,
            });
            this.slickAdvs = false;
        }
    },
    methods: {
        getProducts(orderby) {
            return axios({
                url: './phps/getproducts.php',
                method: 'get',
                params: {
                    orderby: orderby,
                }
            })
        },
        getShoppingAdv() {
            return axios({
                url: './phps/getAdv.php',
                method: 'get',
            })
        },
        changeType(e) {
            app.selectedType = e.target.value;
        },
        numchange(e){
            let total=0;
            for (let i in app.$refs.items) {
                total+=app.$refs.items[i].calamount;
                
            }
            this.total=total;
        },
        selectedPage(page) {
            return {
                selected_a: this.nowpage == page,
            }
        },
        addAdvItem() {
            if (storage[this.advproduct.ID]) {
                app.addcartLBText = '已經在購物車內囉。';
                app.addcartLB = true;
            } else {
                let product = this.advproduct;
                let value = product.ID + '|' + product.NAME + '|' + product.IMG + '|' + product.PRICE + '|1';
                storage[this.advproduct.ID] = value;
                storage['addItemList'] += this.advproduct.ID + ',';
                app.addItemList.push(this.advproduct.ID);
                app.addcartLBText = '已加入購物車。';
                app.addcartLB = true;
            }
        },

    },
    computed: {
        pages() {
            let totalItem = this.products.length;
            let pages = 0;
            pages += parseInt(totalItem / this.perpageNum);
            pages += (totalItem % this.perpageNum > 0) ? 1 : 0;
            return pages;
        },
        PerpageProduct() {
            const nowpage = this.nowpage,
                products = this.products,
                perpageNum = this.perpageNum;
            let PerpageProduct = [];
            if (nowpage * perpageNum < products.length) {

                for (let j = (nowpage - 1) * perpageNum; j < nowpage * perpageNum; j++) {
                    PerpageProduct.push(this.products[j]);
                };
            } else {
                for (let j = (nowpage - 1) * perpageNum; j < products.length; j++) {
                    PerpageProduct.push(this.products[j]);
                };
            }
            return PerpageProduct;
        },
        watchProducts() {
            return [this.Allproducts, this.selectedType];
        }
    },
    watch: {
        watchProducts() {
            const Allproducts = this.Allproducts;
            let products = [];
            if (this.selectedType == '所有商品') {
                products = this.Allproducts;
            } else {
                for (let i in Allproducts) {
                    if (Allproducts[i].TYPE == this.selectedType) {
                        products.push(Allproducts[i])
                    };
                }
            }
            this.products = products;
            this.nowpage=1;
        },
    },

});
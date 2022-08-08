const storage = sessionStorage;

function storageValue(product) {
    let spec = product.SPEC != '' ? product.SPEC : 'null';
    product.NUM = 1;
    return product.ID + '|' + product.NAME + '|' + product.IMG + '|' + product.SIZE + '|' + product.PRICE + '|' + product.STOCK + '|' + product.DELIVERY_METHOD + '|' + spec + '|' + product.NUM;
}
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
        clickAdv() {
            app.advproduct = this.product;
            app.advInfo = true;
        }
    },
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
    <div class="productcard col-xs-12 col-sm-4 col-lg-4" >
        <div class="card_padding" @click='changeshowInfo'>
            <img :src="product.IMG" :alt="product.TYPE" srcset="" loading="lazy">
            <span class="p_name" >{{product.NAME}}<span v-if='product.SPEC!=""'>({{product.SPEC}})</span></span>
            <p class="p_info" v-html='product.INFO'/>
            <div class="price">NT {{product.PRICE}}</div>
            <input type="button" value="加入購物車" class="add_cart" @click.stop="addCart">
        </div>
        <div class='infoLB' v-if="showInfo" @click.self='showInfo=false'>
            <product-lightbox   :product='product' :addCart='addCart' :changeshowInfo='changeshowInfo'/>
        </div>
    </div>
    `,
    methods: {
        addCart() {
            if (storage[this.product.ID]) {
                app.addcartLBText = '已經在購物車內囉。';
                app.addcartLB = true;
            } else {
                storage[this.product.ID] = this.Value;
                storage['addItemList'] += this.product.ID + ',';
                app.addItemList.push(this.product.ID);
                this.product.NUM = 1;
                app.addItems.push(this.product);
                app.addcartLBText = '已加入購物車。';
                app.addcartLB = true;
            }
        },
        changeshowInfo() {
            this.showInfo = this.showInfo ? false : true;
        }
    },
    computed: {
        Value() {
            let value = storageValue(this.product);
            return value;
        },
    },
    watch: {
        addItemList() {
            storage['addItemList'] = addItemList
        }
    }
});

//商品LB

Vue.component('product-lightbox', {
    props: ['product', 'addCart', 'changeshowInfo'],
    template: `
    <div>
        <div class='P_img'>
        <img :src="product.IMG" alt="商品圖片" srcset="" loading="lazy">
        </div>
        <div class='P_info'>
            <span class='closeLB' @click='changeshowInfo'>×</span>
            <h4>{{product.NAME}}<span v-if='product.SPEC!=""'>({{product.SPEC}})</span></h4>
            <p v-html='product.INFO'></p>
            <input type="button" value="加入購物車" class="add_cart" @click="addCart">
            <div  :class="{stock:true,  shortage: isShortage }" v-if='product.STOCK!=null'>尚餘庫存：{{product.STOCK}}</div>
        </div>
    </div>`,
    computed: {
        isShortage() {
            return parseInt(this.product.STOCK) <= 2 ? true : false;
        }
    }
})

//廣告LB外包div

Vue.component('adv-lightbox', {
    props: ['product'],
    template: `
        <div class='infoLB advLB'  @click.self='changeadvInfo' v-if='product'>
            <product-lightbox :product='product' :addCart='addAdvItem' :changeshowInfo='changeadvInfo' />
        </div>
  `,
    methods: {

        addAdvItem() {
            let product = this.product;
            if (storage[product.ID]) {
                app.addcartLBText = '已經在購物車內囉。';
                app.addcartLB = true;
            } else {
                storage[product.ID] = storageValue(this.product);
                storage['addItemList'] += product.ID + ',';
                app.addItemList.push(product.ID);
                app.advproduct.NUM = 1;
                app.addItems.push(product);
                app.addcartLBText = '已加入購物車。';
                app.addcartLB = true;
                app.caltotal();
            }
        },
        changeadvInfo() {
            app.advInfo = app.advInfo ? false : true;
        },
    }
})


const app = new Vue({
    el: "#app",
    data() {
        return {
            Allproducts: [],
            products: [],
            products2: [],
            advs: [],
            type: [],
            type2: [],
            nowpage: 1,
            nowpage2: 1,
            selectedClass: '甜點',
            selectedType: null,
            selectedType2: null,
            addcartLBText: '已加入購物車。',
            addcartLB: false,
            addItemList: [],
            addItems: [],
            cartShow: false,
            notice: false,
            advInfo: false,
            advproduct: null,
            perpageNum: null,
            productloading: true,
            total: 0,
        }
    },
    created() {
        if (storage['addItemList']) {
            let l = storage['addItemList'].split(',');
            l.pop();
            this.addItemList = l;
            this.itemList = storage['addItemList'];
            let Allproducts = [];
            for (let i in l) {
                let info = storage[l[i]].split('|'),
                    obj = {
                        ID: info[0],
                        NAME: info[1],
                        IMG: info[2],
                        SIZE: parseInt(info[3]),
                        PRICE: parseInt(info[4]),
                        STOCK: parseInt(info[5]),
                        DELIVERY_METHOD: parseInt(info[6]),
                        SPEC: info[7] === 'null' ? '' : info[7],
                        NUM: parseInt(info[8])
                    };

                Allproducts.push(obj);
            }
            this.addItems = Allproducts;
        } else {
            storage['addItemList'] = '';
        };

        axios
            .all([this.getProducts(), this.getShoppingAdv(), ]).then(axios.spread(function(Products, ShoppingAdv) {
                app.Allproducts = Products.data[0];
                let type = [];
                for (let i in Products.data[1]) {
                    type.push(Products.data[1][i].TYPE)
                };
                if (Products.data[1][0].TYPE) {
                    app.selectedType = Products.data[1][0].TYPE;
                }
                app.type = app.type.concat(type);
                let type2 = [];
                for (let i in Products.data[2]) {
                    type2.push(Products.data[2][i].TYPE)
                };
                if (Products.data[2][0].TYPE) {
                    app.selectedType2 = Products.data[2][0].TYPE;
                }
                app.type2 = app.type2.concat(type2);
                app.advs = ShoppingAdv.data;
                app.$nextTick(
                    function() {
                        $('#adv').slick({
                            arrows: true,
                            autoplay: true,
                            autoplaySpeed: 2000,
                            infinite: true,
                            dots: true,
                            slidesToScroll: 1,
                            slidesToShow: 1,
                        });
                    });
                document.getElementById('loading').style.display = 'none';
            }));
        this.perpageNum = (window.innerWidth > 992) ? 9 : 12;
        window.onresize = () => {
            this.perpageNum = (window.innerWidth > 992) ? 9 : 12;
        };
    },
    mounted() {
        this.caltotal();
        document.querySelector('#bag').addEventListener('click', (e) => {
            e.preventDefault()
            app.cartShow = true;
        })
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
                url: './phps/getadv.php',
                method: 'get',
            })
        },
        changeType(e) {
            app.selectedType = e.target.value;
        },
        changeType2(e) {
            app.selectedType2 = e.target.value;
        },
        selectedPage(page) {
            return {
                selected_a: this.nowpage == page,
            }
        },
        selectedPage2(page) {
            return {
                selected_a: this.nowpage2 == page,
            }
        },

        changePage() {
            const t = document.getElementById('toggleClass');
            document.documentElement.scrollTop = t.offsetTop - 150;
        },
        caltotal() {
            let total = 0;
            let addItems = this.addItems;
            for (let i in addItems) {
                total += addItems[i].PRICE * addItems[i].NUM;
            }
            this.total = total;
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
        pages2() {
            let totalItem = this.products2.length;
            let pages = 0;
            pages += parseInt(totalItem / this.perpageNum);
            pages += (totalItem % this.perpageNum > 0) ? 1 : 0;
            return pages;
        },
        PerpageProduct() {
            const nowpage = this.nowpage,
                products = this.products,
                perpageNum = this.perpageNum;
            if (nowpage * perpageNum < products.length) {
                return products.filter(obj => products.indexOf(obj) >= (nowpage - 1) * perpageNum && products.indexOf(obj) < nowpage * perpageNum);
            }
            return products.filter(obj => products.indexOf(obj) >= (nowpage - 1) * perpageNum && products.indexOf(obj) < products.length);
        },
        PerpageProduct2() {
            const nowpage = this.nowpage2,
                products = this.products2,
                perpageNum = this.perpageNum;
            if (nowpage * perpageNum < products.length) {
                return products.filter(obj => products.indexOf(obj) >= (nowpage - 1) * perpageNum && products.indexOf(obj) < nowpage * perpageNum);
            }
            return products.filter(obj => products.indexOf(obj) >= (nowpage - 1) * perpageNum && products.indexOf(obj) < products.length);

        },
        watchProducts() {
            return [this.Allproducts, this.selectedType];
        },
        watchProducts2() {
            return [this.Allproducts, this.selectedType2];
        },


    },
    watch: {
        watchProducts: function() {
            this.productloading = true;
            this.products = this.Allproducts.filter(obj => obj.TYPE === this.selectedType);
            this.nowpage = 1;
            this.productloading = false;

        },
        watchProducts2: function() {
            this.productloading = true;
            this.products2 = this.Allproducts.filter(obj => obj.TYPE === this.selectedType2);
            this.nowpage2 = 1;
            this.productloading = false;

        },
        total: function() {
            if (this.total > 10000) {
                app.addcartLBText = '親愛的顧客您好，由於此筆訂單數量較大，請直接電洽專人為您服務，造成不便還請見諒。<br>電話：<a href="tel:+886-3-4751386">03-4751386<a/>';
                app.addcartLB = true;
            }
        },
        addItems: {
            handler: function() {
                this.caltotal();
            },
            deep: true,
        }
    },

});
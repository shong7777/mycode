const storage = sessionStorage;


Vue.component('cartItem', {
    data() {
        return {}
    },
    template: `<div class="cart-item row">
                <div class="item_img col-lg-2 col-md-3 col-4">
                    <img :src="product.IMG" alt="">
                </div>
                <div class='col-lg-10  col-md-9 col-8 pinfo row'>
                    <div class='col-md-5 col-12 pname'>
                      <span class="p_name" />{{product.NAME}}<span v-if='product.SPEC!="null"'>({{product.SPEC}})</span></span>
                    </div>
                    <div class='col-md-12 col-12'>
                     <div>數量：<span class='quantity' @click='product.NUM>1?product.NUM-=1:1'>-</span><input type="number" class="itemNum"  v-model="product.NUM" :max='max' min='1' inputmode="numeric"><span class='quantity'  @click='product.NUM<100?product.NUM+=1:99'>+</span></div>
                    <div style="display: inline-block;"><span v-if='!isNaN(product.STOCK)' >尚餘庫存：{{product.STOCK}}</span></div>
                    </div>
                    <div class="item_price  col-md-3 col-12">
                        <span>小計:{{calamount}}</span>
                    </div>
                </div>
                <span class="dropitem" @click="dropItem">&#10005;</span>
            </div>`,
    props: ['product'],
    methods: {
        dropItem() {
            this.product.NUM = 0;
            storage.removeItem(this.product.ID);
            let list = storage['addItemList'].split(',');
            list.pop();
            let index = list.indexOf(this.product.ID);
            app.addItems.splice(index, 1);
            list.splice(index, 1);
            if (list.length > 0) {
                storage['addItemList'] = list + ',';
            } else {
                storage['addItemList'] = '';
            };
            app.addItemList = storage['addItemList'].split(',');
            app.addItemList.pop();
            app.addpriceproduct = null;
            app.showaddpriceproductsList = true;

        },
    },
    computed: {
        calamount() {
            return this.product.PRICE * this.product.NUM;
        },
        max() {
            let max = this.product.STOCK | 99;
            return max;
        }
    },
    watch: {
        product: {
            handler: function(n) {
                if (n.NUM > this.max) {
                    this.product.NUM = this.max;
                    app.addcartLBText = '輸入的數字超過庫存囉。';
                } else if (isNaN(parseInt(n.NUM))) { this.product.NUM = 1; }
                let info = storage[this.product.ID].split('|');
                info.pop();
                info.push(this.product.NUM);
                info = info.join('|');
                storage[this.product.ID] = info;

            },
            deep: true,
        }
    }

});
Vue.component('addprice-item', {
    data() {
        return {}
    },
    template: `<div class="cart-item row">
    <div class="item_img col-lg-2 col-md-3 col-4">
        <img :src="product.IMG" alt="">
    </div>
    <div class='col-lg-10  col-md-9 col-8 pinfo row'>
        <div class='col-md-5 col-12 pname'>
          <span class="p_name" />{{product.NAME}}<span v-if='product.SPEC!=""'>({{product.SPEC}})</span></span>
        </div>
        <div class='col-md-4 col-12'>
        數量：<input type="number"  class="itemNum"  v-model="product.NUM"  readonly>
        <div style="display: inline-block;"><span v-if='!isNaN(product.STOCK)' >尚餘庫存：{{product.STOCK}}</span></div>
        </div>
        <div class="item_price  col-md-3 col-12">
            <span>小計:{{calamount}}</span>
        </div>
    </div>
    <span class="dropitem col-1" @click="dropItem">&#10005;</span>
</div>`,
    props: ['product'],
    methods: {
        dropItem() {
            app.addpriceproduct = null;
            storage.removeItem('addpriceproduct');
            app.showaddpriceproductsList = true;

        },
    },
    computed: {
        calamount() {
            return this.product.PRICE * this.product.NUM;
        },
    },
    updated() {
        this.num = product.NUM;
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
            <img :src="product.IMG" alt="商品圖片" srcset="" loading="lazy">
            <span class="p_name" >{{product.NAME}}<span v-if='product.SPEC!=""'>({{product.SPEC}})</span></span>
            <p class="p_info" v-html='product.INFO'/>
            <div class="price">NT {{product.PRICE}}</div>
            <input type="button" value="加入購物車" class="add_cart" @click.stop="addCart">
        </div>
    </div>
    `,
    methods: {
        addCart() {
            app.addpriceproduct = this.product;
            app.showaddpriceproductsList = false;
            app.addpriceselected = true;
            app.showInfo = false;
        },
        changeshowInfo() {
            app.addpriceproduct = this.product;
            app.showInfo = true;
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

Vue.component('addprice-lightbox', {
    props: ['product'],
    template: `
        <div class='infoLB'  @click.self='changeadvInfo' v-if='product'>
            <product-lightbox :product='product' :addCart='addaddpricItem' :changeshowInfo='changeadvInfo' />
        </div>
  `,
    methods: {
        addaddpricItem() {
            app.addpriceproduct = this.product;
            app.showaddpriceproductsList = false;
            app.addpriceselected = true;
            app.showInfo = false;
        },
        changeadvInfo() {
            app.showInfo = app.showInfo ? false : true;
        },
    }
})

const app = new Vue({
    el: "#app",
    data() {
        return {
            addItemList: [],
            addItems: [],
            notice: false,
            addpriceproduct: null,
            addpriceproducts: null,
            allAddpriceproducts: null,
            cartShow: false,
            showaddpriceproductsList: true,
            addcartLB: false,
            showInfo: false,
            slickactive: false,
            product: null,
            addpriceselected: false,
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
                        SPEC: info[7],
                        NUM: parseInt(info[8])
                    };
                Allproducts.push(obj);
            }
            this.addItems = Allproducts;
        } else {
            storage['addItemList'] = '';
        };
        axios.all([this.getAddPrice()]).then(axios.spread(function(Products) {
            if (Products.data != '') {
                Products.data.forEach(e => { e.NUM = 1; })
            }
            app.allAddpriceproducts = Products.data;
            document.getElementById('loading').style.display = 'none';
            app.setaddpriceproducts()
        }));
    },
    mounted() {

    },
    updated() {

    },
    methods: {
        getAddPrice() {
            return axios({
                url: './phps/getaddprice.php',
                method: 'get',
                params: {}
            })
        },
        checkout(e) {
            if (this.total > 10000) {
                app.addcartLBText = '親愛的顧客您好，由於此筆訂單數量較大，請直接電洽專人為您服務，造成不便還請見諒。<br>電話：<a href="tel:+886-3-4751386">03-4751386<a/>';
                app.addcartLB = true;
                e.preventDefault();

            }
            let product = this.addpriceproduct;
            if (product) {
                let spec = product.SPEC;
                if (spec === '') spec = 'null';
                let value = product.ID + '|' + product.NAME + '|' + product.IMG + '|' + product.SIZE + '|' + product.PRICE + '|' + product.STOCK + '|' + product.DELIVERY_METHOD + '|' + spec + '|' + product.NUM;
                storage['addpriceproduct'] = value;
                // e.preventDefault()
            }

        },
        changeaddprice() {
            this.addpriceproduct = null;
            this.showaddpriceproductsList = true;
        },
        setaddpriceproducts() {
            let total = this.total;
            let Allproducts = this.allAddpriceproducts;
            if (Allproducts != '') {
                if (total >= 2000 && total < 3000) this.addpriceproducts = Allproducts.filter(p => p.GRADE === '1');
                else if (total >= 3000 && total < 4000) this.addpriceproducts = Allproducts.filter(p => p.GRADE === '2');
                else if (total >= 4000) this.addpriceproducts = Allproducts.filter(p => p.GRADE === '3');
                else this.addpriceproducts = [];
            }
        },
        addproduct() {
            this.addpriceproduct = this.product;
            this.showInfo = false;
            this.showaddpriceproductsList = false;
        }

    },
    computed: {
        calAll() {
            if (this.addpriceproduct) return parseInt(this.total) + parseInt(this.addpriceproduct.PRICE);
            else return this.total;
        },
        grade() {
            let total = this.total;
            if (3000 > total && total >= 2000) {
                return 2000;
            } else if (4000 > total && total >= 3000) {
                return 3000;
            } else if (total >= 4000) {
                return 4000;
            }
        },
        total() {
            let total = 0;
            let addItems = this.addItems;
            for (let i in addItems) {
                total += addItems[i].PRICE * addItems[i].NUM;
            }
            return total;
        },



    },
    watch: {
        total: function() {
            if (this.total < 2000) {
                this.addpriceproduct = null;
            }
            if (this.total > 10000) {
                app.addcartLBText = '親愛的顧客您好，由於此筆訂單數量較大，請直接電洽專人為您服務，造成不便還請見諒。<br>電話：<a href="tel:+886-3-4751386">03-4751386<a/>';
                app.addcartLB = true;
            };
            this.addpriceproduct = null;
            this.showaddpriceproductsList = false;
            if (this.allAddpriceproducts != null) { this.setaddpriceproducts() };

        },
        addpriceproducts: function(n) {
            this.addpriceproduct = null;
            this.showaddpriceproductsList = true;
            if (this.slickactive) {
                $('#addpricelist').slick('unslick')
                this.slickactive = false;
            }
            if (n.length > 2) {
                this.$nextTick(function() {
                    $('#addpricelist').slick({
                        arrows: true,
                        // infinite: true,
                        slidesToScroll: 3,
                        slidesToShow: 3,
                        responsive: [{
                                breakpoint: 600,
                                settings: {
                                    // centerMode: true,
                                    slidesToScroll: 2,
                                    slidesToShow: 2,
                                }
                            },
                            {
                                breakpoint: 350,
                                settings: {
                                    slidesToScroll: 1,
                                    slidesToShow: 1,
                                }
                            },
                        ]
                    });
                    app.slickactive = true;
                })
            }
        }
    },

});
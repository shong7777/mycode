const storage = sessionStorage;
jQuery.event.special.touchstart = {
    setup: function(_, ns, handle) {
        this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.touchmove = {
    setup: function(_, ns, handle) {
        this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
    }
};



Vue.component('cartItem', {
    data() {
        return {}
    },
    template: `<div class="cart-item row">
                <div class="item_img col-sm-2 col-3">
                    <img :src="product.IMG" alt="">
                </div>
                <div class='col-sm-10 col-9 pinfo row'>
                    <div class='col-sm-5 col-12 pname'>
                        <span  v-html='product.NAME'/>
                    </div>
                    <div class='col-sm-4 col-12'>
                    數量：<input type="number"  class="itemNum"  v-model="product.NUM" max='12' min='1'>
                    </div>
                    <div class="item_price  col-sm-3 col-12">
                        <span>小計:{{calamount}}</span>
                    </div>
                </div>
                <span class="dropitem col-1" @click="dropItem">&#10005;</span>
            </div>`,
    props: ['product'],
    methods: {
        dropItem() {
            this.num = 0;
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
        startbar() {
            console.log('start');
        },
        movebar(e) {
            console.log('move')
            console.log(e.path[0])
            console.log(e.touches.length);
        },
    },
    computed: {
        calamount() {
            return this.product.PRICE * this.product.NUM;
        },
    },
    watch: {
        calamount: function() {
            let info = storage[this.product.ID].split('|');
            info.splice(5, 1);
            info.push(this.product.NUM);
            info = info.join('|');
            storage[this.product.ID] = info;
        }
    }

});
Vue.component('addpriceItem', {
    data() {
        return {
            num: 1,
        }
    },
    template: `<div class="cart-item row">
                <div class="item_img col-sm-2 col-3">
                    <img :src="product.IMG" alt="">
                </div>
                <div class='col-sm-10 col-9 pname row'>
                    <div class='col-sm-5 col-12 pname'>
                        <span >{{product.NAME}}</span>
                    </div>
                    <div class='col-sm-4 col-12'>
                    數量：<input type="number"  class="itemNum"  v-model="product.NUM" max='12' min='1' readonly>
                    </div>
                    <div class="item_price  col-sm-3 col-12">
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
            return this.product.PRICE * this.num;
        },
    },

});

Vue.component('product-card', {
    props: ['product'],
    data() {
        return {
            showInfo: false,
        }
    },
    template: `
    <div class="productcard col-md-4 col-sm-6 col-6 " >
        <div class="card_padding" @click='show'>
            <img :src="product.IMG" alt="" srcset="" loading="lazy">
            <span class="p_name" v-html='product.NAME'/>
            <p class="p_info" v-html='product.INFO'/>
            <div class="price">NT {{product.PRICE}}</div>
            <input type="button" value="加入購物車" class="add_cart" @click.stop="addpriceproduct">
        </div>
    </div>
    `,
    methods: {
        show() {
            app.product = this.product;
            app.showInfo = true
        },

        addpriceproduct() {
            app.addpriceproduct = this.product;
            app.addpriceproduct.NUM = '1';
            app.showInfo = false;
            app.showaddpriceproductsList = false;
        }

    },
});


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
                        SIZE: info[3],
                        PRICE: info[4],
                        NUM: info[5]
                    };
                Allproducts.push(obj);
            }
            this.addItems = Allproducts;
        } else {
            storage['addItemList'] = '';
        };
        axios.all([this.getAddPrice()]).then(axios.spread(function(Products) {
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
                let value = product.ID + '|' + product.NAME + '|' + product.IMG + '|' + product.SIZE + '|' + product.PRICE + '|1';
                storage['addpriceproduct'] = value;
            }

        },
        changeaddprice() {
            this.addpriceproduct = null;
            this.showaddpriceproductsList = true;
        },
        setaddpriceproducts() {
            let total = this.total;
            let Allproducts = this.allAddpriceproducts;
            if (total >= 2000 && total < 3000) this.addpriceproducts = Allproducts.filter(p => p.GRADE === '1');
            else if (total >= 3000 && total < 4000) this.addpriceproducts = Allproducts.filter(p => p.GRADE === '2');
            else if (total >= 4000) this.addpriceproducts = Allproducts.filter(p => p.GRADE === '3');
            else this.addpriceproducts = [];
        },
        addproduct() {
            this.addpriceproduct = this.product;
            this.addpriceproduct.NUM = '1';
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
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
        clickAdv() {
            app.advproduct = this.product;
            app.advInfo = true;
        }
    },
    computed: {},
    watch: {}
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
            <img :src="product.IMG" alt="" srcset="" loading="lazy">
            <span class="p_name">{{product.NAME}}</span>
            <p class="p_info">{{product.INFO}}</p>
            <span class="p_more" @click='showInfo=true'>more</span>
            <div class="price">NT {{product.PRICE}}</div>
            <input type="button" value="加入購物車" class="add_cart" @click="addCart">
        </div>
        <div class='infoLB' v-if="showInfo" @click.self='showInfo=false'>
            <div>
                <div class='P_img'>
                <img :src="product.IMG" alt="" srcset="" loading="lazy">
                </div>
                <div class='P_info'>
                    <span class='closeLB' @click='showInfo=false'>×</span>
                    <h4>{{product.NAME}}</h4>
                    <p v-html='product.INFO'></p>
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
                storage[this.product.ID] = this.Value;
                storage['addItemList'] += this.product.ID + ',';
                app.addItemList.push(this.product.ID);
                this.product.NUM = 1;
                app.addItems.push(this.product);
                app.addcartLBText = '已加入購物車。';
                app.addcartLB = true;
                app.caltotal();
            }
        },
    },
    computed: {
        Value() {
            let product = this.product;
            let value = product.ID + '|' + product.NAME + '|' + product.IMG + '|' + product.SIZE + '|' + product.PRICE + '|1';
            return value;
        },
    },
    watch: {
        addItemList() {
            storage['addItemList'] = addItemList
        }
    }
});
// Vue.component('cartItem', {
//     data() {
//         return {}
//     },
//     template: `<div class="cart-item row">
//                 <div class="item_img col-4 col-sm-4">
//                     <img :src="product.IMG" alt="" loading="lazy">
//                 </div>
//                 <div class="item_info col-7 row">
//                     <span class=' col-12'>{{product.NAME}}</span>
//                     <span class='col-sm-6 col-12'>數量：<input type="number" name="" id="" class="itemNum"  v-model="product.NUM" max='20' min='1'></span>
//                     <div class="item_price col-sm-6 col-12">
//                         <span>小計:</span>
//                         <span>{{calamount}}</span>
//                     </div>
//                 </div>
//                 <span class="dropitem col-1" @click="dropItem">&#10005;</span>
//             </div>`,
//     props: ['product'],
//     methods: {
//         dropItem() {
//             this.num = 0;
//             storage.removeItem(this.product.ID);
//             let list = storage['addItemList'].split(',');
//             list.pop();
//             let index = list.indexOf(this.product.ID);
//             app.addItems.splice(index, 1);
//             list.splice(index, 1);
//             if (list.length > 0) {
//                 storage['addItemList'] = list + ',';
//             } else {
//                 storage['addItemList'] = '';
//             };
//             app.addItemList = storage['addItemList'].split(',');
//             app.addItemList.pop();
//             app.caltotal();
//         },
//         startbar() {
//             console.log('start');
//         },
//         movebar(e) {
//             console.log('move')
//             console.log(e.path[0])
//             console.log(e.touches.length);
//         },
//     },
//     computed: {
//         calamount() {
//             return this.product.PRICE * this.product.NUM;
//         },
//     },
//     watch: {
//         calamount: function() {
//             let info = storage[this.product.ID].split('|');
//             info.splice(5, 1);
//             info.push(this.product.NUM);
//             info = info.join('|');
//             storage[this.product.ID] = info;
//             app.caltotal();
//         }
//     }

// });
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
            selectedType: '塔',
            selectedType2: '巴西',
            addcartLBText: '已加入購物車。',
            addcartLB: false,
            addItemList: [],
            addItems: [],
            cartShow: false,
            notice: false,
            advInfo: false,
            advproduct: null,
            perpageNum: 12,
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
        axios
            .all([this.getProducts(this.whatorderby), this.getShoppingAdv(), ]).then(axios.spread(function(Products, ShoppingAdv) {
                app.Allproducts = Products.data[0];
                let type = [];
                for (let i in Products.data[1]) {
                    type.push(Products.data[1][i].TYPE)
                };
                app.type = app.type.concat(type);
                let type2 = [];
                for (let i in Products.data[2]) {
                    type2.push(Products.data[2][i].TYPE)
                };
                app.type2 = app.type2.concat(type2);
                app.advs = ShoppingAdv.data;
                console.log('done');
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
    },
    mounted() {
        this.caltotal()
    },
    // beforeUpdate() {
    //     console.log('bfupdated ');
    // },
    // updated() {
    //     console.log('updated ')
    // },
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
        addAdvItem() {
            if (storage[this.advproduct.ID]) {
                app.addcartLBText = '已經在購物車內囉。';
                app.addcartLB = true;
            } else {
                let product = this.advproduct;
                let value = product.ID + '|' + product.NAME + '|' + product.IMG + '|' + product.SIZE + '|' + product.PRICE + '|1';
                storage[product.ID] = value;
                storage['addItemList'] += product.ID + ',';
                app.addItemList.push(product.ID);
                this.advproduct.NUM = 1;
                app.addItems.push(product);
                app.addcartLBText = '已加入購物車。';
                app.addcartLB = true;
                app.caltotal();
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
        }

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
            let PerpageProduct = [];
            if (nowpage * perpageNum < products.length) {

                for (let j = (nowpage - 1) * perpageNum; j < nowpage * perpageNum; j++) {
                    PerpageProduct.push(products[j]);
                };
            } else {
                for (let j = (nowpage - 1) * perpageNum; j < products.length; j++) {
                    PerpageProduct.push(products[j]);
                };
            }
            return PerpageProduct;
        },
        PerpageProduct2() {
            const nowpage = this.nowpage2,
                products = this.products2,
                perpageNum = this.perpageNum;
            let PerpageProduct = [];
            if (nowpage * perpageNum < products.length) {
                for (let j = (nowpage - 1) * perpageNum; j < nowpage * perpageNum; j++) {
                    PerpageProduct.push(products[j]);
                };
            } else {
                for (let j = (nowpage - 1) * perpageNum; j < products.length; j++) {
                    PerpageProduct.push(products[j]);
                };
            }
            return PerpageProduct;
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
            let t = document.getElementsByClassName('product-list')[0];
            t.style.display = 'none';
            this.productloading = true;
            const Allproducts = this.Allproducts;
            let products = [];
            for (let i in Allproducts) {
                if (Allproducts[i].TYPE == this.selectedType) {
                    products.push(Allproducts[i])
                };
            }
            this.products = products;
            this.nowpage = 1;
            t.style.display = 'flex';
            this.productloading = false;
        },
        watchProducts2: function() {
            let t = document.getElementsByClassName('product-list')[1];
            t.style.display = 'none';
            this.productloading = true;
            const Allproducts = this.Allproducts;
            let products = [];
            for (let i in Allproducts) {
                if (Allproducts[i].TYPE == this.selectedType2) {
                    products.push(Allproducts[i])
                };
            }

            this.products2 = products;
            this.nowpage2 = 1;
            t.style.display = 'flex';
            this.productloading = false;
        },
        total: function() {
            if (this.total > 10000) {
                app.addcartLBText = '親愛的貴客您好，由於訂單數量較大，請直接電洽專人為您服務，造成不便還請見諒。<br>電話：<a href="tel:+886-3-4751386">03-4751386<a/>';
                app.addcartLB = true;
            }
        },
    },

});
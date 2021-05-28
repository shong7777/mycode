const storage = sessionStorage;
Vue.component('cartItem', {
    data() {
        return {}
    },
    template: `<div class="cart-item row">
                <div class="item_img col-sm-2 col-12">
                    <img :src="product.IMG" alt="">
                </div>
                <div class='col-sm-5 col-12 pname'>
                    <span >{{product.NAME}}</span>
                </div>
                <div class='col-sm-2 col-12'>
                    <span>數量：{{product.QUANTITY}}</span>
                </div>
                <div class="item_price  col-sm-3 col-12">
                    <span>單價:{{product.PRICE}}</span>
                </div>
            </div>`,
    props: ['product'],

});

const app = new Vue({
    el: "#app",
    data() {
        return {
            addItemList: null,
            addItems: null,
            orderinfo: null,
            notice: false,
            products: [],
            addpriceproducts: [],
            gwpproducts: [],
            orderNo: null,
            cartShow: false,
            addItemList: null,
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
        let searchURL = window.location.search.split("="),
            orderNo = searchURL[searchURL.length - 1];
        this.orderNo = orderNo;
        let params = new URLSearchParams();
        params.append('orderNo', orderNo);
        axios
            .post('./phps/getorder.php', params).then(function(res) {
                let data = res.data;
                app.orderinfo = data[0];
                app.products = data[1];
                app.addpriceproducts = data[2];
                app.gwpproducts = data[3];
            }).catch((error) => { console.error(error) });
    },
    methods: {
        numchange(e) {
            let total = 0;
            for (let i in app.$refs.items) {
                total += app.$refs.items[i].calamount;

            }
            this.total = total;
        },
        print() {
            window.print();
        },
        href() {
            window.location.href = "./index.html";
        }
    },
});
const storage = sessionStorage;
Vue.component('cartItem', {
    data() {
        return {}
    },
    template: `<div class="cart-item row">
                <div class="item_img col-2 ">
                    <img :src="product.IMG" alt="">
                </div>
                <div class='col-5  pname'>
                    <div>{{product.NAME}}</div>
                </div>
                <div class='col-2 '>
                    <span>數量：</span><span>{{product.QUANTITY}}</span>
                </div>
                <div class="item_price  col-3 ">
                    <span>單價:</span><span>{{product.PRICE}}</span>
                </div>
            </div>`,
    props: ['product'],

});

const app = new Vue({
    el: "#app",
    data() {
        return {
            addItemList: [],
            addItems: null,
            orderinfo: null,
            notice: false,
            products: [],
            addpriceproducts: [],
            gwpproducts: [],
            orderNo: null,
            cartShow: false,
        }
    },
    created() {
        if (storage['addItemList']) {
            let l = storage['addItemList'].split(',');
            l.pop();
            this.addItemList = l;
            this.itemList = storage['addItemList'];

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
        document.getElementById('loading').style.display = 'none';

        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { document.getElementById('print').style.display = 'inline-block' }
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
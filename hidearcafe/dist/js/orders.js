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
        //靜態網頁data建立開始
        let data = [{ "NAME_SENDER": "楊*處", "ADD_SENDER": "桃園市中壢*****", "PHONE_SENDER": "0974***147", "NAME_RECEIVER": "草*瑪", "ADD_RECEIVER": "南投縣草屯*****", "ZIPCODE": "542", "PHONE_RECEIVER": "0921***789", "NOTE": "", "DELIVERY_FEE": "150", "DELIVERY_STATE": "0", "DISCOUNT": "0", "TOTAL": "3390", "ORDER_DATE": "2021-05-26", "PAYMENT": "1" },
            [{ "NAME": "商品名稱商品名稱商品名稱商品名稱商品名稱商品名稱 塔 11", "QUANTITY": "1", "PRICE": "720", "IMG": ".\/images\/tart.png", "ID": "10011" }, { "NAME": "商品名稱商品名稱商品名稱商品名稱商品名稱商品名稱 塔 12", "QUANTITY": "1", "PRICE": "720", "IMG": ".\/images\/tart.png", "ID": "10012" }, { "NAME": "商品名稱商品名稱商品名稱商品名稱商品名稱商品名稱 巴西 47", "QUANTITY": "3", "PRICE": "600", "IMG": ".\/images\/cafe.png", "ID": "10047" }],
            [{ "NAME": "加價購DEMO 2", "QUANTITY": "1", "PRICE": "350", "IMG": ".\/images\/product.png", "ID": "2" }],
            [{ "NAME": "贈品2", "QUANTITY": "1", "PRICE": "0", "IMG": ".\/images\/product.png", "ID": "2" }]
        ];
        this.orderinfo = data[0];
        this.products = data[1];
        this.addpriceproducts = data[2];
        this.gwpproducts = data[3];
        document.getElementById('loading').style.display = 'none';

        //靜態網頁data建立結束

        // let params = new URLSearchParams();
        // params.append('orderNo', orderNo);
        // axios
        //     .post('./phps/getorder.php', params).then(function(res) {
        //         let data = res.data;
        //         app.orderinfo = data[0];
        //         app.products = data[1];
        //         app.addpriceproducts = data[2];
        //         app.gwpproducts = data[3];
        //     }).catch((error) => { console.error(error) });
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
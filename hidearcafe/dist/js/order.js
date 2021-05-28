Vue.component('cartItem',{
    data(){return{
    }},
    template:`<div class="cart-item row">
                <input type="hidden" :name="product.ID" :value='itemvalue'>
                <div class="item_img col-sm-2 col-12">
                    <img :src="product.IMG" alt="">
                </div>
                <div class='col-sm-5 col-12 pname'>
                    <span >{{product.NAME}}</span>
                </div>
                <div class='col-sm-2 col-12'>
                    <span>數量：{{product.NUM}}</span>
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
            orderinfo:null;
        }
    },
    created() {
        let searchURL = window.location.search.split("="),
            orderNo = searchURL[searchURL.length - 1];
            console.log(orderNo);
        let params = new URLSearchParams();
            params.append('text', this.discountText);
            axios
            .post('./phps/getorder.php', params).then(function(res) {
                let data=res.data;
                console.log(res.data);
            }).catch((error) => { console.error(error) });
    },
    methods: {
        numchange(e){
            let total=0;
            for (let i in app.$refs.items) {
                total+=app.$refs.items[i].calamount;
                
            }
            this.total=total;
        },
        getAddPrice(){
            return axios({
                url: './phps/getaddprice.php',
                method: 'get',
                params: {
                }
            })
        },
        checkout(){
                let product = this.addpriceproduct;
                console.log(product);
                if(product){
                    let value = product.ID + '|' + product.NAME + '|' + product.IMG + '|' +product.SIZE+ '|' + product.PRICE+ '|1';
                    storage['addpriceproduct'] = value;
                }

        },

    },
});
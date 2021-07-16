Vue.component('cartItem', {
    props: ['product'],
    created() {
        console.log(this.product);
        this.PRICE = this.product.PRICE;
        this.NUM = this.product.NUM;
    },
    data() {
        return {
            NUM: null,
            PRICE: null,
        }
    },
    template: `<div class="cart-item row">
                <div class="item_img col-4 col-sm-4">
                    <img :src="product.IMG" alt="" loading="lazy">
                </div>
                <div class="item_info col-7 row">
                    <span class=' col-12' v-html='product.NAME'/>
                    <span class='col-sm-6 col-12'>數量：<input type="number" name="" id="" class="itemNum"  v-model="product.NUM" max='20' min='1' @change="NUM=product.NUM"></span>
                    <div class="item_price col-sm-6 col-12">
                        <span>小計:</span>
                        <span>{{subtotal}}</span>
                    </div>
                </div>
                <span class="dropitem col-1" @click="dropItem">&#10005;</span>
            </div>`,

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
            app.caltotal();
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
        subtotal() {
            return this.PRICE * this.NUM;
        },
    },
    watch: {
        subtotal: function() {
            let info = storage[this.product.ID].split('|');
            info.splice(5, 1);
            info.push(this.product.NUM);
            info = info.join('|');
            storage[this.product.ID] = info;
            app.caltotal();
        },
    }
});
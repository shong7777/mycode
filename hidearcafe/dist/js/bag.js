Vue.component('cartItem', {
    props: ['product'],
    data() {
        return {
            num: this.product.NUM,
        }
    },
    template: `<div class="cart-item row">
                <div class="item_img col-4 col-sm-4">
                    <img :src="product.IMG" alt="" loading="lazy">
                </div>
                <div class="item_info col-8 row">
                    <span class=' col-12'>{{product.NAME}}<span v-if='product.SPEC!=""'>({{product.SPEC}})</span></span>
                    <div class='col-sm-12 col-12'>數量：<span class='quantity' @click='num>1?num-=1:1'>-</span><input type="number" class="itemNum"  v-model="num" :max='max' min='1' inputmode="numeric"><span class='quantity'  @click='num<100?num+=1:99'>+</span></div>
                    <div class="item_price col-sm-6 col-12">
                        <span>小計:</span>
                        <span>{{subtotal}}</span>
                    </div>
                </div>
                <div class='dropitem-wrap'>
                 <span class="dropitem" @click="dropItem">&#10005;</span>
                </div>
            </div>`,

    methods: {
        dropItem() {
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
    },
    computed: {
        subtotal() {
            return this.product.PRICE * parseInt(this.num);
        },
        max() {
            let max = this.product.STOCK | 99;
            return parseInt(max)
        }
    },
    watch: {
        num: {
            handler: function (n) {
                if (parseInt(n) > this.max) {
                    this.num = this.max;
                    this.product.NUM = this.num;
                } else if (isNaN(parseInt(n))) {
                    this.num = 1;
                    this.product.NUM = this.num;
                } else {
                    this.product.NUM = this.num;
                }
                let info = storage[this.product.ID].split('|');
                info.pop();
                info.push(this.product.NUM);
                info = info.join('|');
                storage[this.product.ID] = info;
                app.caltotal();
            },
            deep: true,
        }
    }
});
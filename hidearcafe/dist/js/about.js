const storage = sessionStorage;
const app = new Vue({
    el: "#app",
    data() {
        return {
            addItemList: [],
            addItems: null,
            total: 0,
            cartShow: false,
            notice: false,
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
        document.getElementById('loading').style.display = 'none';
    },
    mounted() {
        this.caltotal()
    },
    methods: {
        caltotal() {
            let total = 0;
            let addItems = this.addItems;
            for (let i in addItems) {
                total += addItems[i].PRICE * addItems[i].NUM;
            }
            this.total = total;
        }
    },
})
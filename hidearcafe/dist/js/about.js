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
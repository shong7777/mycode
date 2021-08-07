const storage = sessionStorage;
var taiwan_districts;
Vue.component('cartItem', {
    data() {
        return {}
    },
    template: `<div class="cart-item row">
                    <input type="hidden" :name="product.ID" :value='itemvalue'>
                    <div class="item_img col-sm-2 col-5">
                        <img :src="product.IMG" alt="">
                    </div>
                    <div class='col-sm-10 col-7 pinfo row'>
                        <div class='col-sm-5 col-12 pname'>
                            <div >{{product.NAME}}</div>
                        </div>
                        <div class='col-sm-4 col-12'>
                            <span>數量：{{product.NUM}}</span>
                        </div>
                        <div class="item_price  col-sm-3 col-12">
                            <span>單價:{{product.PRICE}}</span>
                        </div>
                    </div>
                </div>`,
    props: ['product'],
    methods: {},
    computed: {
        calamount() {
            return this.product.PRICE * this.product.NUM;
        },
        itemvalue() {
            return this.product.ID + ',' + this.product.NUM;
        }
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
            app.GiftWithPurchase = this.product;
            app.GiftWithPurchase.NUM = '1';
            app.showGiftWithPurchaseList = false;
        }


    },
    computed: {
        hiddenValue() {
            let product = this.product;
            let value = product.ID + '|' + product.NAME + '|' + product.IMG + '|' + product.PRICE + '|1';
            return value;
        },
    },
    watch: {}
});


const app = new Vue({
    el: "#app",
    data() {
        return {
            addItemList: [],
            addItems: [],
            notice: false,
            total: 0,
            addpriceproduct: null,
            allGiftWithPurchase: null,
            itemList: null,
            cartShow: false,
            GiftWithPurchase: null,
            showGiftWithPurchaseList: true,
            discount: 0,
            discountLB: false,
            discountText: null,
            itemsSize: 0,
            taiwan_districts: null,
            district: '',
            area: '',
            mail: '',
            sName: '',
            sPhone: '',
            sAdd: '',
            sdistrict: '',
            sarea: '',
            szip: '',
            rName: '',
            rPhone: '',
            rAdd: '',
            zip: '',
            product: null,
            showInfo: false
        }
    },
    created() {
        axios({
            url: './js/json/zip.json',
            method: 'get',
        }).then(function(res) {
            let data = res.data;
            let without = ["連江縣", "釣魚臺", "澎湖縣", "南海島", "金門縣"];
            let withoutare = ['東沙群島', "南沙群島", '釣魚臺', '綠島鄉', '蘭嶼鄉'];
            data.forEach(a => a.districts = a.districts.filter(b => withoutare.indexOf(b.name) === -1));
            app.taiwan_districts = data.filter(a => without.indexOf(a.name) === -1);
        }).catch((error) => { console.error(error) });
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
        if (storage['addpriceproduct']) {
            let info = storage['addpriceproduct'].split('|');
            this.addpriceproduct = {
                ID: info[0],
                NAME: info[1],
                IMG: info[2],
                SIZE: info[3],
                PRICE: info[4],
                NUM: info[5]
            };
        };
        if (storage['sName']) this.sName = storage['sName'];
        if (storage['sPhone']) this.sPhone = storage['sPhone'];
        if (storage['sAdd']) this.sAdd = storage['sAdd'];
        if (storage['rName']) this.rName = storage['rName'];
        if (storage['rPhone']) this.rPhone = storage['rPhone'];
        if (storage['rAdd']) this.rAdd = storage['rAdd'];
        if (storage['zipcode']) this.zip = storage['zipcode'];
        if (storage['district']) this.district = storage['district'];
        if (storage['area']) this.area = storage['area'];
        if (storage['sdistrict']) this.sdistrict = storage['sdistrict'];
        if (storage['sarea']) this.sarea = storage['sarea'];
        if (storage['szipcode']) this.szip = storage['szipcode'];
        if (storage['mail']) this.mail = storage['mail'];
    },
    mounted() {
        window.addEventListener('beforeunload', function() {
            storage.removeItem('addpriceproduct');
        })
        let total = 0;
        let size = 0;
        for (let i in this.$refs.items) {
            const item = this.$refs.items[i];
            total += item.calamount;
            size += item.product.SIZE * item.product.NUM;
        };
        if (this.addpriceproduct) {
            this.total = total + this.$refs.addpriceproduct.calamount;
            this.itemsSize = parseInt(size) + parseInt(this.$refs.addpriceproduct.product.SIZE);
        } else {
            this.total = total;
            this.itemsSize = size;
        };
        let params = new URLSearchParams();
        params.append('total', this.total);
        axios
            .post('./phps/getgwp.php', params).then(function(res) {
                let data = res.data;
                app.allGiftWithPurchase = data;
                if (app.allGiftWithPurchase.length > 2) {
                    app.$nextTick(function() {
                        $('#gwp').slick({
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
                                        // centerMode: true,
                                        slidesToScroll: 1,
                                        slidesToShow: 1,
                                    }
                                },
                            ]
                        });
                    })
                }
                document.getElementById('loading').style.display = 'none';
            }).catch((error) => { console.error(error) });
        document.forms[0].querySelector('.infoT').querySelectorAll('input').forEach(a => {
            if (a.classList.value === "required" && a.value != '') a.setAttribute('class', 'filled')
        })
    },
    methods: {
        checkout() {
            let product = this.addpriceproduct;
            if (product) {
                let value = product.ID + '|' + product.NAME + '|' + product.IMG + '|' + product.PRICE + '|1';
                storage['addpriceproduct'] = value;
            }

        },
        submitForm() {
            function check() {
                if (document.orderform.sName.value == '') {
                    alert('訂購人姓名未填');
                    return false;
                }
                if (document.orderform.sPhone.value == '') {
                    alert('訂購人電話未填');
                    return false;
                }
                if (document.orderform.sAdd.value == '') {
                    alert('訂購人地址未填');
                    return false;
                }
                if (document.orderform.rName.value == '') {
                    alert('收件人姓名未填');
                    return false;
                }
                if (document.orderform.rPhone.value == '') {
                    alert('收件人電話未填');
                    return false;
                }
                if (document.orderform.rAdd.value == '') {
                    alert('收件人地址未填');
                    return false;
                }
                if (document.orderform.rAdd.value == '') {
                    alert('收件人地址未填');
                    return false;
                }
                if (document.orderform.sdistrict.value == '') {
                    alert('未選擇寄件人縣市');
                    return false;
                }
                if (document.orderform.sarea.value == '') {
                    alert('未選擇寄件人地區');
                    return false;
                }
                if (document.orderform.district.value == '') {
                    alert('未選擇縣市');
                    return false;
                }
                if (document.orderform.area.value == '') {
                    alert('未選擇地區');
                    return false;
                }
                if (document.orderform.mail.value == '') {
                    alert('信箱未填');
                    return false;
                }
                return true;
            };
            if (storage['addItemList'] == '') {
                alert('您的購物車內沒有物品，請選擇商品後再結帳，謝謝。');

            } else {
                if (check()) {
                    if (confirm('是否確認提交？')) {
                        for (let i in this.addItemList) {
                            storage.removeItem(this.addItemList[i]);
                        }
                        storage.removeItem('addItemList');
                        storage.removeItem('addpriceproduct');

                        document.orderform.submit();
                    }

                }
            }
        },
        changeGWP() {
            this.GiftWithPurchase = null;
            this.showGiftWithPurchaseList = true;
        },
        checkcoupon() {
            let params = new URLSearchParams();
            params.append('text', this.discountText);
            axios
                .post('./phps/getcoupon.php', params).then(function(res) {
                    let data = res.data;
                    if (data != '') {
                        app.discount = data;
                        app.discountLB = false;
                    } else {
                        alert('折價代碼錯誤');
                        app.discount = 0;
                    }
                }).catch((error) => { console.error(error) });

        },
        saveInfo(e) {
            if (e.target.classList.value === 'filled' && e.target.value == '') { e.target.classList.value = 'required'; } else if (e.target.classList.value === 'required' && e.target.value != '') { e.target.classList.value = 'filled'; }
            if (e.target.value == '') {
                storage.removeItem(e.target.name);
            } else {
                storage[e.target.name] = e.target.value;
                if (e.target.name == 'district') {
                    this.area = '';
                }
                if (e.target.name == 'sdistrict') {
                    this.sarea = '';
                }
                if (e.target.name == 'sPhone') {
                    let reg = /(^\d{2,3}\-\d{7,8}$)|(^09\d{8})$/;
                    if (!reg.test(e.target.value)) {
                        alert('寄件人號碼格式錯誤，請重新輸入');
                        document.orderform.sPhone.value = '';
                        storage.removeItem('sPhone');
                    }
                }
                if (e.target.name == 'rPhone') {
                    let reg = /(^\d{2,3}\-\d{7,8}$)|(^09\d{8})$/;
                    if (!reg.test(e.target.value)) {
                        alert('收件人號碼格式錯誤，請重新輸入');
                        document.orderform.rPhone.value = '';
                        storage.removeItem('rPhone');
                    }
                }
                if (e.target.name == 'mail') {
                    let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
                    if (!reg.test(e.target.value)) {
                        alert('收件人號碼格式錯誤，請重新輸入');
                        document.orderform.mail.value = '';
                        storage.removeItem('mail');
                    }
                }
                if (e.target.name === 'area') {
                    let zip = e.target.options[e.target.options.selectedIndex].dataset.zip
                    this.zip = zip;
                    storage['zipcode'] = zip;
                }
                if (e.target.name === 'sarea') {
                    let zip = e.target.options[e.target.options.selectedIndex].dataset.zip
                    this.szip = zip;
                    storage['szipcode'] = zip;
                }
            }
        },
        syncinfo() {
            this.rName = this.sName;
            if (this.sName == '') {
                storage.removeItem('rName');
            } else { storage['rName'] = this.rName }
            this.rPhone = this.sPhone;
            if (this.sPhone == '') {
                storage.removeItem('rPhone');
            } else { storage['rPhone'] = this.rPhone }
            this.rAdd = this.sAdd;
            if (this.sAdd == '') {
                storage.removeItem('rAdd');
            } else {
                storage['rAdd'] = this.rAdd
                let add = this.sAdd;
                if (add.slice(0, 1) === '台') add = add.replace('台', '臺')
                let d = add.substr(0, 3);
                let area = ['鄉', '鎮', '市', '區']
                this.district = d;
                storage['district'] = d;
                if (area.indexOf(add.slice(5, 6)) > -1) {
                    this.area = add.slice(3, 6)
                }
                if (area.indexOf(add.slice(6, 7)) > -1) {
                    this.area = add.slice(3, 7)
                }
                storage['area'] = this.area;
                let zip = this.selecteddistrict.filter(a => a.name === this.area)[0].zip;
                this.zip = zip;
                storage['zipcode'] = zip;
            }
        },
        checkvalue(name, value) {
            let dom = document.forms[0][name];
            let c = this.value(value)
            dom.setAttribute('class', c)
        },
        value(value) {
            if (value == '') {
                return 'required';
            } else if (value != '') {
                return 'filled';
            }
        },
        addproduct() {
            this.GiftWithPurchase = this.product;
            this.GiftWithPurchase.NUM = '1';
            this.showInfo = false;
            this.showGiftWithPurchaseList = false;
        }
    },
    computed: {
        calAll() {
            if (this.addpriceproduct) {
                return parseInt(this.total) + parseInt(this.addpriceproduct.PRICE);
            } else {
                return this.total
            }
        },
        calDeliveryFee() {
            // 運費計算 暫時
            let fee = 0,
                boxsize = 8;
            fee += parseInt(this.itemsSize / boxsize) * 160;
            fee += (this.itemsSize % boxsize > 0) ? 160 : 0;
            if (this.total >= 2000) return 0;
            return fee;
        },

        sender_selecteddistrict() {
            if (this.taiwan_districts != null) {
                if (this.sdistrict === '') {
                    this.sarea = '';
                    return [''];
                } else {
                    return this.taiwan_districts.filter(a => a.name === this.sdistrict)[0].districts
                }
            }
        },
        selecteddistrict() {
            if (this.taiwan_districts != null) {
                if (this.district === '') {
                    this.area = '';
                    return [''];
                } else {
                    return this.taiwan_districts.filter(a => a.name === this.district)[0].districts
                }
            }
        },

    },
    watch: {
        area: function(n) {
            if (this.taiwan_districts != null) {
                this.rAdd = this.district + this.area;
            }
            document.getElementById('area').setAttribute('class', this.value(n))

        },
        sarea: function(n) {
            if (this.taiwan_districts != null) {
                this.sAdd = this.sdistrict + this.sarea;
            }
            document.getElementById('sarea').setAttribute('class', this.value(n))
        },
        district: function(n) {
            document.getElementById('district').setAttribute('class', this.value(n))

        },
        sdistrict: function(n) {
            document.getElementById('sdistrict').setAttribute('class', this.value(n))

        },

        sAdd: function(n) {
            this.checkvalue('sAdd', n)
        },
        rAdd: function(n) {
            this.checkvalue('rAdd', n)
        },
        rPhone: function(n) {
            this.checkvalue('rPhone', n)
        },
        rName: function(n) {
            this.checkvalue('rName', n)
        },
    },

});
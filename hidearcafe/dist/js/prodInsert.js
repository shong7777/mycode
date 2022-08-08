var tablename;
window.onload = init();
// import { dealImage } from './modules/deelimage.js';


function $id(id) {
    return document.getElementById(id)
}

function init() {
    getsession().then((session) => {
        if (session.data === '未登入') {
            // alert('請登入後操作，跳轉登入頁面。')
            location.href = './login.html';
        } else {
            window.parent.document.querySelector('#username').innerText = session.data;
            window.parent.document.querySelector('#logout').style.display = 'inline-block';
        }
    }).catch((error) => { console.error(error) });


    tablename = document.forms[0].tablename.value;
    const fileBtn = document.forms[0].upFile;
    fileBtn.addEventListener('change', () => { readFile(fileBtn.files[0]) })
    $id('textauto').addEventListener('change', (e) => {
        if (e.target.checked) {
            $id('textautonum').classList.remove('hide')
        } else {
            $id('textautonum').classList.add('hide')
        }
    })

    document.forms[0].tablename.addEventListener('change', (e) => {
        tablename = e.target.value;
        if (fileBtn.files[0]) readFile(fileBtn.files[0]);
        switch (tablename) {
            case 'product':
                $id('name').classList.remove('hide');
                $id('price').classList.remove('hide');
                $id('size').classList.remove('hide');
                $id('info').classList.remove('hide');
                $id('class').classList.remove('hide');
                $id('upImg').classList.remove('hide');
                $id('type').classList.remove('hide');
                $id('stock').classList.remove('hide');
                $id('spec').classList.remove('hide');
                $id('delivery').classList.remove('hide');
                $id('grade').classList.add('hide');
                $id('product_no').classList.add('hide');
                $id('discount').classList.add('hide');
                $id('text').classList.add('hide');
                document.forms[0].size.value = 2;
                break;
            case 'addprice':
                $id('name').classList.remove('hide');
                $id('price').classList.remove('hide');
                $id('size').classList.remove('hide');
                $id('info').classList.remove('hide');
                $id('upImg').classList.remove('hide');
                $id('grade').classList.remove('hide');
                $id('stock').classList.remove('hide');
                $id('spec').classList.remove('hide');
                $id('delivery').classList.remove('hide');
                $id('class').classList.add('hide');
                $id('type').classList.add('hide');
                $id('product_no').classList.add('hide');
                $id('discount').classList.add('hide');
                $id('text').classList.add('hide');
                document.forms[0].size.value = 0;
                break;
            case 'gift_with_purchase':
                $id('name').classList.remove('hide');
                $id('price').classList.remove('hide');
                $id('size').classList.remove('hide');
                $id('info').classList.remove('hide');
                $id('grade').classList.remove('hide');
                $id('upImg').classList.remove('hide');
                $id('stock').classList.remove('hide');
                $id('spec').classList.remove('hide');
                $id('delivery').classList.remove('hide');
                $id('class').classList.add('hide');
                $id('type').classList.add('hide');
                $id('product_no').classList.add('hide');
                $id('discount').classList.add('hide');
                $id('text').classList.add('hide');
                document.forms[0].size.value = 0;
                document.forms[0].price.value = 0;
                break;
            case 'adv':
                $id('class').classList.add('hide');
                $id('grade').classList.add('hide');
                $id('name').classList.add('hide');
                $id('price').classList.add('hide');
                $id('type').classList.add('hide');
                $id('size').classList.add('hide');
                $id('info').classList.add('hide');
                $id('discount').classList.add('hide');
                $id('stock').classList.add('hide');
                $id('spec').classList.add('hide');
                $id('delivery').classList.add('hide');
                $id('text').classList.add('hide');
                $id('upImg').classList.remove('hide');
                $id('product_no').classList.remove('hide');
                axios({
                        url: './phps/getproducts.php',
                        method: 'get',
                        params: {
                            orderby: '',
                        }
                    }).then((res) => {
                        let list = res.data[0];
                        let select = document.querySelector('#product_no').querySelector('select')
                        list.forEach(p => {
                            let option = document.createElement('option');
                            option.value = p.ID.substr(1);
                            option.innerText = p.ID.substr(1) + '   ' + p.NAME;
                            select.appendChild(option)
                        });
                    })
                    .catch((error) => { console.error(error) })
                break;
            case 'coupon':
                $id('class').classList.add('hide');
                $id('grade').classList.add('hide');
                $id('name').classList.add('hide');
                $id('price').classList.add('hide');
                $id('type').classList.add('hide');
                $id('size').classList.add('hide');
                $id('info').classList.add('hide');
                $id('product_no').classList.add('hide');
                $id('upImg').classList.add('hide');
                $id('stock').classList.add('hide');
                $id('spec').classList.add('hide');
                $id('delivery').classList.add('hide');
                $id('diveaway_no').classList.remove('hide');
                $id('discount').classList.remove('hide');
                $id('text').classList.remove('hide');
                document.forms[0].discount.value = 0;
                axios({
                        url: './phps/getdiveaway.php',
                        method: 'get',
                    }).then((res) => {
                        let list = res.data;
                        let select = document.querySelector('#diveaway_no').querySelector('select')
                        list.forEach(p => {
                            let option = document.createElement('option');
                            option.value = p.ID;
                            option.innerText = p.ID + '   ' + p.NAME;
                            select.appendChild(option)
                        });
                    })
                    .catch((error) => { console.error(error) })
                break;
            case 'diveaway':
                $id('name').classList.remove('hide');
                $id('price').classList.remove('hide');
                $id('size').classList.remove('hide');
                $id('info').classList.remove('hide');
                $id('upImg').classList.remove('hide');
                $id('stock').classList.remove('hide');
                $id('spec').classList.remove('hide');
                $id('delivery').classList.remove('hide');
                $id('grade').classList.add('hide');
                $id('class').classList.add('hide');
                $id('type').classList.add('hide');
                $id('product_no').classList.add('hide');
                $id('discount').classList.add('hide');
                $id('text').classList.add('hide');
                document.forms[0].size.value = 0;
                document.forms[0].price.value = 0;
                break;
        }
    })
}


function getsession() {
    return axios({
        url: './phps/getsession.php',
        method: 'get',
    })
}


function readFile(file) { //判斷型別是不是圖片
    if (!/image\/\w/.test(file.type)) { alert("請確認檔案為圖片檔"); return false; }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        dealImage(reader.result, { quality: 1 }, base => {

            // document.forms[0].img.value = base;
            let opts = {
                viewport: tablename === 'adv' ? {
                    width: 300,
                    height: 200
                } : {
                    width: 300,
                    height: 225
                },
                showZoomer: false,
                enableOrientation: true,
            }

            document.getElementById('croppiediv').innerHTML = `<div id='croppie' style="height: 300px;width:300px;"></div>
            <input type="button" value="旋轉90度" id="rotate">
            <input type="button" value="剪裁圖片" id='getimg'>`
            c = new Croppie(document.getElementById('croppie'), opts);
            c.bind({ url: base });
            document.getElementById('rotate').addEventListener('click', rotateimg)
            document.getElementById('getimg').addEventListener('click', getimg)
            document.forms[0].tablename.addEventListener('change', () => {
                document.getElementById('croppiediv').innerHTML = ''
            })

            function rotateimg() {
                c.rotate(90)
            }

            function getimg() {
                c.result({
                    type: 'canvas',
                    format: 'jpeg',
                    quality: '1',
                    size: {
                        width: tablename === 'adv' ? 1200 : 600,
                        height: tablename === 'adv' ? 900 : 450,
                    }
                }).then(img => {
                    document.getElementById('img').setAttribute('src',
                        img);
                    document.forms[0].img.value = img;
                });
            }
        });
    }
}

function sent() {
    if (tablename != 'coupon' && document.forms[0].img.value === '') {
        alert('未選擇圖片');
        return false;
    }
    $id('processing').classList.remove('hide');
    let form = document.forms[0];
    let params = new URLSearchParams();
    params.append('tablename', tablename);
    switch (tablename) {
        case 'product':
            params.append('class', form.class.value);
            params.append('pname', form.pname.value);
            params.append('price', form.price.value);
            params.append('type', form.type.value);
            params.append('size', form.size.value);
            params.append('info', form.info.value);
            params.append('img', form.img.value);
            params.append('stock', form.stock.value);
            params.append('spec', form.spec.value);
            params.append('delivery', form.delivery.value);
            break;
        case 'addprice':
            params.append('pname', form.pname.value);
            params.append('grade', form.grade.value);
            params.append('price', form.price.value);
            params.append('size', form.size.value);
            params.append('info', form.info.value);
            params.append('img', form.img.value);
            params.append('stock', form.stock.value);
            params.append('spec', form.spec.value);
            params.append('delivery', form.delivery.value);
            break;
        case 'gift_with_purchase':
            params.append('pname', form.pname.value);
            params.append('grade', form.grade.value);
            params.append('price', form.price.value);
            params.append('size', form.size.value);
            params.append('info', form.info.value);
            params.append('img', form.img.value);
            params.append('stock', form.stock.value);
            params.append('spec', form.spec.value);
            params.append('delivery', form.delivery.value);
            break;
        case 'adv':
            params.append('product_no', form.product_no.value);
            params.append('img', form.img.value);
            break;
        case 'coupon':
            if (form.diveaway_no.value === 'null' && form.discount.value <= 0) {
                alert('未設定商品或折扣，請重新操作。')
                $id('processing').classList.add('hide');
                return false
            } else if (form.diveaway_no.value != 'null' && form.discount.value > 0) {
                alert('只能指定商品或折扣，請重新操作。')
                form.discount.value = 0;
                $id('processing').classList.add('hide');
                return false
            } else if (!form.textauto.checked && form.text.value === '') {
                alert('非自動生成請輸入折扣碼，請重新操作。')
                $id('processing').classList.add('hide');
                return false
            }
            params.append('text', form.text.value);
            params.append('discount', form.discount.value);
            params.append('diveaway_no', form.diveaway_no.value);
            params.append('textauto', form.textauto.checked);
            params.append('textautonum', form.textautonum.value);
            break;
        case 'diveaway':
            params.append('pname', form.pname.value);
            params.append('price', form.price.value);
            params.append('size', form.size.value);
            params.append('info', form.info.value);
            params.append('img', form.img.value);
            params.append('stock', form.stock.value);
            params.append('spec', form.spec.value);
            params.append('delivery', form.delivery.value);
            break;
    }
    axios.post('./phps/prodInsert.php', params).then(result => {
        $id('processing').classList.add('hide');
        if (result.data.includes('新增成功')) {
            alert('新增成功');
            if (tablename === 'coupon' && result.data != '新增成功') {
                document.querySelector('.coupon-result').classList.remove('hide');
                let codes = JSON.parse(result.data.slice(4, result.data.length));
                codes.forEach((code) => {
                    let li = document.createElement('li');
                    li.innerText = code;
                    document.querySelector('.coupon-result').appendChild(li);
                })
            }
        } else { alert('新增失敗，請重新嘗試。') }
        // location.reload();
    }).catch((error) => {
        console.log(error);
        alert('新增失敗，請重新嘗試。');
        $id('processing').classList.add('hide');

        // location.reload();
    })
}

function changesize(e) {
    let size = document.forms[0].size;
    if (e.value === '咖啡') {
        size.value = 1;
    } else if (e.value === '甜點') {
        size.value = 2;
    }
}
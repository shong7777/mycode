var tablename;
window.onload = init();
// import { dealImage } from './modules/deelimage.js';


function $id(id) {
    return document.getElementById(id)
}

function init() {
    tablename = document.forms[0].tablename.value;
    const fileBtn = document.forms[0].upFile;
    fileBtn.addEventListener('change', () => { readFile(fileBtn.files[0]) })
    document.forms[0].tablename.addEventListener('change', (e) => {
        console.log(e.target.value)
        tablename = e.target.value;
        if (fileBtn.files[0]) readFile(fileBtn.files[0]);
        switch (tablename) {
            case 'product':
                console.log('新增商品');
                $id('name').setAttribute('class', '')
                $id('price').setAttribute('class', '')
                $id('size').setAttribute('class', '')
                $id('info').setAttribute('class', '')
                $id('class').setAttribute('class', '')
                $id('upImg').setAttribute('class', '')
                $id('type').setAttribute('class', '')
                $id('grade').setAttribute('class', 'hide')
                $id('product_no').setAttribute('class', 'hide')
                $id('discount').setAttribute('class', 'hide')
                $id('text').setAttribute('class', 'hide')
                document.forms[0].size.value = 2;
                break;
            case 'addprice':
                console.log('新增addprice');
                $id('name').setAttribute('class', '')
                $id('price').setAttribute('class', '')
                $id('size').setAttribute('class', '')
                $id('info').setAttribute('class', '')
                $id('upImg').setAttribute('class', '')
                $id('grade').setAttribute('class', '')
                $id('class').setAttribute('class', 'hide')
                $id('type').setAttribute('class', 'hide')
                $id('product_no').setAttribute('class', 'hide')
                $id('discount').setAttribute('class', 'hide')
                $id('text').setAttribute('class', 'hide')
                document.forms[0].size.value = 0;
                break;
            case 'gift_with_purchase':
                console.log('新增gift_with_purchase');
                $id('name').setAttribute('class', '')
                $id('price').setAttribute('class', '')
                $id('size').setAttribute('class', '')
                $id('info').setAttribute('class', '')
                $id('grade').setAttribute('class', '')
                $id('upImg').setAttribute('class', '')
                $id('class').setAttribute('class', 'hide')
                $id('type').setAttribute('class', 'hide')
                $id('product_no').setAttribute('class', 'hide')
                $id('discount').setAttribute('class', 'hide')
                $id('text').setAttribute('class', 'hide')
                document.forms[0].size.value = 0;
                document.forms[0].price.value = 0;
                break;
            case 'adv':
                console.log('新增adv');
                $id('class').setAttribute('class', 'hide')
                $id('grade').setAttribute('class', 'hide')
                $id('name').setAttribute('class', 'hide')
                $id('price').setAttribute('class', 'hide')
                $id('type').setAttribute('class', 'hide')
                $id('size').setAttribute('class', 'hide')
                $id('info').setAttribute('class', 'hide')
                $id('discount').setAttribute('class', 'hide')
                $id('text').setAttribute('class', 'hide')
                $id('upImg').setAttribute('class', '')
                $id('product_no').setAttribute('class', '')
                break;
            case 'coupon':
                console.log('新增coupon');
                $id('class').setAttribute('class', 'hide')
                $id('grade').setAttribute('class', 'hide')
                $id('name').setAttribute('class', 'hide')
                $id('price').setAttribute('class', 'hide')
                $id('type').setAttribute('class', 'hide')
                $id('size').setAttribute('class', 'hide')
                $id('info').setAttribute('class', 'hide')
                $id('product_no').setAttribute('class', 'hide')
                $id('upImg').setAttribute('class', 'hide')
                $id('discount').setAttribute('class', '')
                $id('text').setAttribute('class', '')
                break;
        }
    })
}

function readFile(file) { //判斷型別是不是圖片
    if (!/image\/\w/.test(file.type)) { alert("請確認檔案為圖片檔"); return false; }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        let width = 250;
        if (tablename === 'adv') {
            console.log('是廣告')
            width = 550;
        }
        dealImage(reader.result, { width: width, quality: 1 }, base => {
            document.getElementById('img').setAttribute('src',
                base);
            document.forms[0].img.value = base;
        });
    }
}

function sent() {
    if (tablename != 'coupon' && document.forms[0].img.value === '') {
        alert('未選擇圖片');
        return false;
    }
    console.log('送出資料');
    $id('processing').setAttribute('class', '');
    let form = document.forms[0];
    let params = new URLSearchParams();
    params.append('tablename', tablename);
    switch (tablename) {
        case 'product':
            console.log('新增商品');
            params.append('class', form.class.value);
            params.append('pname', form.pname.value);
            params.append('price', form.price.value);
            params.append('type', form.type.value);
            params.append('size', form.size.value);
            params.append('info', form.info.value);
            params.append('img', form.img.value);
            break;
        case 'addprice':
            console.log('新增addprice');
            params.append('pname', form.pname.value);
            params.append('grade', form.grade.value);
            params.append('price', form.price.value);
            params.append('size', form.size.value);
            params.append('info', form.info.value);
            params.append('img', form.img.value);
            break;
        case 'gift_with_purchase':
            console.log('新增gift_with_purchase');
            params.append('pname', form.pname.value);
            params.append('grade', form.grade.value);
            params.append('price', form.price.value);
            params.append('size', form.size.value);
            params.append('info', form.info.value);
            params.append('img', form.img.value);
            break;
        case 'adv':
            console.log('新增adv');
            params.append('product_no', form.product_no.value);
            params.append('img', form.img.value);
            break;
        case 'coupon':
            console.log('新增coupon');
            params.append('text', form.text.value);
            params.append('discount', form.discount.value);
            params.append('img', form.img.value);
            break;
    }
    axios.post('./phps/prodInsert.php', params).then(result => {
        console.log(result.data);
        $id('processing').setAttribute('class', 'hide');
        if (result.data === '新增成功') { alert('新增成功'); } else { alert('新增失敗，請重新嘗試。') }
        location.reload();
    }).catch((error) => {
        console.log(error);
        alert('新增失敗，請重新嘗試。');
        location.reload();
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
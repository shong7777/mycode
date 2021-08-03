const table = document.getElementById('tableSort');
var tbody = table.tBodies[0];
const tablename = new URL(location.href).searchParams.get('tablename');
var products;
var without;
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
var nowPage = 1;
var perpageNum = 15;
var sorted = false;


window.addEventListener('load', init());

function init() {
    axios
        .all([getableth(), getlist()]).then(axios.spread((tablethdata, list) => {
            let data = tablethdata.data.filter(obj => obj.table === tablename)[0];
            if (tablename === 'Allorders') {
                data = tablethdata.data.filter(obj => obj.table === 'orders')[0];
            }
            let tableth = data.tableth;
            without = data.without;
            writetableth(tableth);
            products = list.data;
            addpagep(products)
            writetabletd(products, without);
            let img = tableth.filter(obj => obj.DATA_NAME === 'IMG').length != 0;
            if (img) {
                console.log('有圖片欄位');
                addeditpicform();

            }
            if (tablename === 'orders') {
                sort('int', -1, 'ORDER_STATE');
                addorderinfodiv()
            } else {
                sort('int', -1, 'ONSALE');
            }
            if (tablename === 'Allorders') addorderinfodiv()

        }));
};



function getableth() {
    return axios({
        url: './js/json/tableth.json',
        method: 'get',
    })
};

function getlist() {
    return axios({
        url: './phps/gettableinfo.php',
        method: 'get',
        params: {
            tablename: tablename,
        }
    })
};

function writetableth(tableth) {
    table.tHead.appendChild(document.createElement('tr'));
    for (let i of tableth) {
        let th = document.createElement('th');
        th.innerHTML = i.COLUMN_NAME;
        th.setAttribute('data-type', i.DATA_TYPE);
        th.setAttribute('data-name', i.DATA_NAME);
        table.tHead.rows[0].appendChild(th);
    }
    var th = table.tHead.rows[0].cells;
    for (var i = 0; i < th.length; i++) {
        th[i].desc = 1;
        th[i].onclick = function() {
            sort(this.getAttribute('data-type'), this.desc, this.getAttribute('data-name'));
            this.desc = -this.desc;
        };
    };
};

function writetabletd(list, without) {
    list = pagination(list)
    for (let i of list) {
        let tr = document.createElement('tr');
        tbody.appendChild(tr);
        for (let j in i) {
            let td = document.createElement('td');
            if (j === 'SIZE') {
                td.innerHTML = `<select onchange='selectupdate(this)'><option value="2">大</option><option value="1">中</option><option value="0">小</option></select>`;
                td.firstChild.value = i[j];
            } else if (j === 'ONSALE') {
                td.innerHTML = `<label class="switch"><input type="checkbox" onclick='onsale(this)'><span class="slider round"></span></label>`;
                if (i[j] === '1') {
                    td.querySelector('input').setAttribute('checked', 'checked')
                }
            } else if (j === 'CLASS') {
                td.innerHTML = `<select onchange='selectupdate(this)'><option value="甜點">甜點</option><option value="咖啡">咖啡</option></select>`;
                td.firstChild.value = i[j];
            } else if (j === 'IMG') {
                td.innerHTML = `<img src="" alt="" class='minipic'><br><input type="button" value='更換圖片' onclick='editpic(this)'>`;
                td.firstChild.src = i[j];
            } else if (j === 'ORDER_STATE') {
                td.innerHTML = `<select onchange='selectupdate(this)'><option value="0">未付款</option><option value="1">準備出貨</option><option value="2">商品已寄出</option><option value="3">商品已送達</option><option value="-1">取消訂單</option></select>`;
                td.firstChild.value = i[j];
                switch (i[j]) {
                    case '1':
                        tr.setAttribute('class', 'piad');
                        break;
                    case '2':
                        tr.setAttribute('class', 'delivered');
                        break;
                    case '3':
                        tr.setAttribute('class', 'arrived');
                        break;
                }
            } else if (j === 'PAYMENT') {
                td.innerHTML = `<select disabled><option value="0">未付款</option><option value="1">已付款</option></select>`;
                td.firstChild.value = i[j];
            } else if (j === 'GRADE') {
                td.innerHTML = `<select onchange='selectupdate(this)'><option value="1">低</option><option value="2">中</option><option value="3">高</option></select>`;
                td.firstChild.value = i[j];
            } else {
                td.innerHTML = i[j];
            }
            tr.appendChild(td);
        }
        tr.addEventListener('click', () => {
            let trs = table.tBodies[0].getElementsByTagName('tr');
            for (let i = 0; i < trs.length; i++) {
                let value = trs[i].classList.value;
                if (value.indexOf('selected') > -1) {
                    value = value.replace("selected", "");
                    trs[i].classList.value = value;
                }
            };
            tr.classList.value += ' selected';
        })
        if (tablename === 'orders' || tablename === 'Allorders') {
            let td = document.createElement('td');
            td.innerHTML = `<input type="button" value="訂單明細" onclick='getorderinfo(this)'>`;
            tr.appendChild(td);
        }
        if (i['PAYMENT'] === '0' && i['ORDER_STATE'] > 0 && sorted) {
            alert('訂單' + i['orders_no'] + '的付款狀態或訂單狀態有誤。')
            tr.setAttribute('class', 'error')
        }


    }
    sorted = true;
    addedit(without);
};


function sort(str, desc, n) {
    products.sort((a, b) => compare(str, a[n], b[n]) * desc);
    tbody.innerHTML = '';
    writetabletd(products, without)
};

function pagination(products) {
    if (nowPage * perpageNum < products.length) {
        return products.filter(obj => products.indexOf(obj) >= (nowPage - 1) * perpageNum && products.indexOf(obj) < nowPage * perpageNum);
    }
    return products.filter(obj => products.indexOf(obj) >= (nowPage - 1) * perpageNum && products.indexOf(obj) < products.length);
}

function compare(str, a, b) {
    if (str === 'int') {
        return a - b;
    }
    return a.localeCompare(b);
};

function edit(t) {
    t.ondblclick = () => {
        if (t.firstChild) {
            if (t.firstChild.tagName != "TEXTAREA") {
                let value = t.innerHTML.replace(/<br>/g, "\n");
                t.innerHTML = `<textarea type='text' id='edit'></textarea>`;
                t.firstChild.innerHTML = value;
                t.firstChild.focus();
            }
        } else if (t.firstChild === null) {
            let value = t.innerHTML.replace(/<br>/g, "\n");
            t.innerHTML = `<textarea type='text' id='edit'></textarea>`;
            t.firstChild.innerHTML = value;
            t.firstChild.focus();
        }


    };
    t.addEventListener('focusout', (e) => {
        updateinfo(e)
        if (t.firstChild.tagName === "TEXTAREA") {
            let value = t.firstChild.value;
            value = value.replace(/\n/g, "<br>");
            t.innerHTML = value;
        }
    });

};

function addedit(without) {
    let tbody = table.tBodies[0];
    for (let i of tbody.rows) {
        for (let j of i.cells) {
            if (without.indexOf(j.cellIndex) < 0) {
                edit(j)
            }
        }
    }
}

function addeditpicform() {
    let div = document.createElement('div');
    div.setAttribute('class', 'hide bg');
    div.setAttribute('id', 'editpicbg');
    div.innerHTML = `<form action="" method="post" enctype="multipart/form-data" id='editpicform'>
                        更換圖片:<input type="file" name="upFile" accept="image/*"><br><br>
                        圖片預覽:<br>
                        <img src="" alt="" id="img" ><br><br>
                        <input type="hidden" name="img">
                        <input type="hidden" name="oldimg">
                        <input type="hidden" name="id">
                        <input type="button" value="確認修改" onclick="updatepic()">
                        <input type="button" value="取消修改"onclick='hideform()'>
                    </form>`;
    document.getElementById('main').append(div);
    const fileBtn = document.getElementById('editpicform').upFile;
    fileBtn.addEventListener('change', () => { readFile(fileBtn.files[0]) })
}

function editpic(e) {
    document.getElementById('editpicbg').setAttribute('class', 'bg');
    let form = document.getElementById('editpicform');
    let img = document.getElementById('img');
    img.src = e.parentNode.getElementsByTagName('img')[0].src;
    form.oldimg.value = img.src.slice(-20);
    form.id.value = e.parentNode.parentNode.cells[0].innerText;
}

function updatepic() {

    let form = document.getElementById('editpicform');
    if (form.img.value === '') {
        alert('未選擇新圖片');
        return false;
    }
    let params = new URLSearchParams();

    params.append('tablename', tablename);
    params.append('id', form.id.value);
    params.append('oldimg', form.oldimg.value);
    params.append('img', form.img.value);
    axios.post('./phps/updatepic.php', params).then(result => {
        console.log(result.data);
        location.reload();
    }).catch((error) => console.log(error))
}


function updateinfo(e) {
    let params = new URLSearchParams();
    params.append('tablename', tablename);
    if (table.tHead.rows[0].cells[0].getAttribute('data-name') === 'ID') {
        params.append('ID', e.target.parentNode.parentNode.cells[0].innerText);
    } else if (table.tHead.rows[0].cells[0].getAttribute('data-name') === 'orders_no') {
        params.append('orders_no', e.target.parentNode.parentNode.cells[0].innerText);
    }
    let index = e.target.parentNode.cellIndex;
    params.append('value', e.target.value);
    params.append('column', table.tHead.rows[0].cells[index].getAttribute('data-name'));
    return axios.post('./phps/update.php', params).then(result => {
        console.log(result.data);
        // if (result.data != '修改資料成功') {
        //     alert('修改失敗，請重新操作。');
        //     location.reload();
        //     return false;
        // }
        // alert('資料修改成功。')
    }).catch((error) => console.log(error))
}

function hideform() {
    document.getElementById('editpicbg').setAttribute('class', 'bg hide');
}

function readFile(file) { //判斷型別是不是圖片
    if (!/image\/\w/.test(file.type)) { alert("請確認檔案為圖片檔"); return false; }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        let width = 250;
        if (tablename === 'adv') {
            width = 550;
        }
        dealImage(reader.result, { width: width, quality: 1 }, base => {
            document.getElementById('img').setAttribute('src',
                base);
            document.getElementById('editpicform').img.value = base;
        });
    }
}

function getorderinfo(e) {
    let params = new URLSearchParams();
    params.append('tablename', tablename);
    params.append('orders_no', e.parentNode.parentNode.cells[0].innerText);
    axios.post('./phps/getordermanage.php', params).then(result => {
        writeorderinfo(result.data)
    }).catch((error) => console.log(error))
}

function addorderinfodiv() {
    let div = document.createElement('div');
    div.setAttribute('id', 'orderinfo');
    div.setAttribute('class', 'hide');
    document.getElementById('main').append(div);
    div.addEventListener('click', () => {
        div.classList.value += ' hide';
    })
}

function writeorderinfo(data) {
    let orderinfo = data[0],
        items = data[1],
        addprice = data[2],
        gwp = data[3];
    let div = document.getElementById('orderinfo');
    div.innerHTML =
        `<div>
            <div class="infoT">
                <div>
                    <label>訂單編號:</label> ${orderinfo.ORDERS_NO}
                </div>
                <div>
                    <label>訂購人：</label> ${orderinfo.NAME_SENDER}
                </div>
                <div>
                    <label>訂購人電話：</label> ${orderinfo.PHONE_SENDER}
                </div>
                <div>
                    <label>訂購人地址：</label> ${orderinfo.ADD_SENDER}
                </div>
                <div>
                    <label>收件人：</label> ${orderinfo.NAME_RECEIVER}
                </div>
                <div>
                    <label>收件人電話：</label> ${orderinfo.PHONE_RECEIVER}
                </div>
                <div>
                    <label>收件人地址：</label> ${orderinfo.ZIPCODE + ' ' + orderinfo.ADD_RECEIVER}
                </div>
                <div>
                    <label>附註：</label> ${orderinfo.NOTE}
            
                </div>
                <div><label>寄送方式：宅配到府</label><br>
                    <label>運費: ${orderinfo.DELIVERY_FEE}</label>
                </div>
                <div><label>折扣：${orderinfo.DISCOUNT}</label> </div>
                <div><label>總計：${orderinfo.TOTAL}</label></div>
                <div><label>訂單狀態：<select disabled><option value="0">未付款</option><option value="1">準備出貨</option><option value="2">商品已寄出</option><option value="3">商品已送達</option><option value="-1">取消訂單</option></select>
                </label></div>
            </div>
            <div style="text-align: center;margin-bottom:20px;">訂單內容：</div>
            <table class="itemList" id='itemList'></table>
        </div>`;
    div.querySelector('select').value = orderinfo.ORDER_STATE;
    additems(items, addprice, gwp)
    div.classList.value = div.classList.value.replace('hide', '');
    div.getElementsByTagName('div')[0].addEventListener('click', e => e.stopPropagation())
}

function additems(items, addprice, gwp) {
    let div = document.getElementById('itemList');
    items.forEach(item => {
        div.appendChild(newtr(item));
    });
    if (addprice.length > 0) {
        let tr = document.createElement('tr');
        tr.setAttribute('class', 'item')
        tr.innerHTML = '<td>加價購</td>';
        div.appendChild(tr);
        addprice.forEach(item => {
            div.appendChild(newtr(item));
        });
    }
    if (gwp.length > 0) {
        let tr = document.createElement('tr');
        tr.setAttribute('class', 'item')
        tr.innerHTML = '<td>滿額贈</td>';
        div.appendChild(tr);
        gwp.forEach(item => {
            div.appendChild(newtr(item));
        });
    }

}


function newtr(item) {
    let newtr = document.createElement('tr');
    newtr.setAttribute('class', 'item');
    newtr.innerHTML = `<td>${item.ID}</td><td>${item.NAME}</td><td > ${item.QUANTITY}</td>`;
    return newtr;
}


function addpagep() {
    let p = document.createElement('p');
    let pages = parseInt(products.length / perpageNum);
    pages += products.length % perpageNum != 0 ? 1 : 0;
    let limit = 6;
    if (pages > limit + 2) {
        if (nowPage < limit) {
            for (let i = 0; i < limit; i++) addpagelistli(p, i);
            p.append('...');
            addpagelistli(p, pages - 1)
        } else if (nowPage >= limit && nowPage < pages - parseInt(limit / 2) - 1) {
            addpagelistli(p, 0)
            p.append('...');
            for (let i = (nowPage - parseInt(limit / 2) - 1); i < nowPage + parseInt(limit / 2); i++) {
                addpagelistli(p, i)
            };
            p.append('...');
            addpagelistli(p, pages - 1)
        } else {
            addpagelistli(p, 0)
            p.append('...');
            for (let i = pages - limit; i < pages; i++) {
                addpagelistli(p, i)
            };
        }
    } else {
        for (let i = 0; i < pages; i++) addpagelistli(p, i);

    }
    document.getElementById('main').append(p);
    p.setAttribute('class', 'pagelist')
    p.setAttribute('id', 'pagelist')
    p.querySelectorAll('a').forEach(a => {
        if (parseInt(a.innerText) === nowPage) a.setAttribute('class', 'nowpage')
    })
}

function addpagelistli(p, index) {
    let a = document.createElement('a');
    a.innerText = index + 1;
    a.addEventListener('click', () => {
        if (document.getElementById('pagelist')) document.getElementById('pagelist').remove();
        // p.querySelectorAll('a').forEach(i => i.setAttribute('class', ''))
        // a.setAttribute('class', 'nowpage')
        nowPage = parseInt(a.innerText);
        tbody.innerHTML = '';
        writetabletd(products, without);
        addpagep();
        console.log(nowPage)
    })
    p.appendChild(a)
}

function onsale(e) {
    let text, value;
    console.log(e.checked)
    console.log(e.parentNode.parentNode.parentNode.cells[0].innerText)
    let params = new URLSearchParams();
    params.append('tablename', tablename);
    params.append('column', 'ONSALE');
    if (e.checked) {
        text = '商品已上架';
        value = 1;
    } else {
        text = '商品已下架';
        value = 0;
    }
    params.append('value', value);
    params.append('ID', e.parentNode.parentNode.parentNode.cells[0].innerText);
    axios.post('./phps/update.php', params).then(result => {
        console.log(result.data)
        alert(text)
    }).catch((error) => console.log(error))
}


function selectupdate(e) {
    let index = e.parentNode.cellIndex;
    let params = new URLSearchParams();
    let column = table.tHead.rows[0].cells[index].getAttribute('data-name');
    params.append('tablename', tablename);
    params.append('column', column);
    params.append('value', e.value);
    if (tablename === 'orders') {
        params.append('orders_no', e.parentNode.parentNode.cells[0].innerText);
    } else {
        params.append('ID', e.parentNode.parentNode.cells[0].innerText);
    }
    axios.post('./phps/update.php', params).then(result => {
        console.log(result.data)
        alert('修改成功')
        if (tablename === 'orders') location.reload();
        // if (column === 'ORDER_STATE') sort('int', -1, 'ORDER_STATE');
    }).catch((error) => console.log(error))
}
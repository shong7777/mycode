$(function() {
    $('#hamburger').click(function() {
        $('#hamburger').toggleClass('is-active');
        $('#nav').slideToggle();
    });
    $('#checking_orderBtn').click(function() {
        let params = new URLSearchParams();
        let orderNo = $('#checking_order').val();
        //靜態網頁data建立開始
        if (orderNo == 3) {
            location.href = `./orders.html?orders_no=3`;
        } else {
            alert('訂單編號輸入錯誤或是沒有這筆訂單。')
        }
        //靜態網頁data建立結束
        // params.append('orderNo', orderNo);
        // axios
        //     .post('./phps/checkorder.php', params).then(function(res) {
        //         let data = res.data;
        //         if (data === 1) {
        //             console.log(data);
        //             location.href = `./orders.html?orders_no=${orderNo}`;
        //         } else {
        //             alert('訂單編號輸入錯誤或是沒有這筆訂單。')
        //         }
        //     }).catch((error) => { console.error(error) });
    })
});
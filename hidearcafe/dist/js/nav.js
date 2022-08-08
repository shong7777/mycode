$(function() {
    $('#hamburger').click(function() {
        $('#hamburger').toggleClass('is-active');
        $('#nav').slideToggle();
    });
    $('#checking_orderBtn').click(function() {
        let params = new URLSearchParams();
        let orderNo = $('#checking_order').val();

        params.append('orderNo', orderNo);
        axios
            .post('./phps/checkorder.php', params).then(function(res) {
                let data = res.data;
                if (data === 1) {
                    location.href = `./orders.html?orders_no=${orderNo}`;
                } else {
                    alert('訂單編號輸入錯誤或是沒有這筆訂單。')
                }
            }).catch((error) => { console.error(error) });
    })
});
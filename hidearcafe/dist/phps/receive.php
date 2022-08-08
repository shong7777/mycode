<?php
    // 付款結果通知
    require('ECPay.Payment.Integration.php');

    try {
        // 收到綠界科技的付款結果訊息，並判斷檢查碼是否相符
        $AL = new ECPay_AllInOne();
        $AL->MerchantID = '3287784';
        $AL->HashKey = 'RSph7nOEUpVku0Iv';
        $AL->HashIV = 'q4KHELDvJ3glokFF';
        // $AL->EncryptType = ECPay_EncryptType::ENC_MD5;  // MD5
        $AL->EncryptType = ECPay_EncryptType::ENC_SHA256; // SHA256
        $feedback = $AL->CheckOutFeedback();
        
        $MerchantTradeNo=$feedback['MerchantTradeNo'];
        require_once("./connect.php");
        $sql="UPDATE orders SET PAYMENT = '1',ORDER_STATE='1' WHERE TRADENO = $MerchantTradeNo";
                $products = $pdo->prepare($sql);
                $products->execute();
                $pdo=null;
            
        // 以付款結果訊息進行相對應的處理
        /** 
        回傳的綠界科技的付款結果訊息如下:
        Array
        (
            [MerchantID] =>
            [MerchantTradeNo] =>
            [StoreID] =>
            [RtnCode] =>
            [RtnMsg] =>
            [TradeNo] =>
            [TradeAmt] =>
            [PaymentDate] =>
            [PaymentType] =>
            [PaymentTypeChargeFee] =>
            [TradeDate] =>
            [SimulatePaid] =>
            [CustomField1] =>
            [CustomField2] =>
            [CustomField3] =>
            [CustomField4] =>
            [CheckMacValue] =>
        )
        */

        // 在網頁端回應 1|OK
        echo '1|OK';
    } catch(Exception $e) {
        echo '0|' . $e->getMessage();
        $error=$e->getMessage();
        $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
        error_log($str,3,'receiveerrors.log');
    }catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='交易編號:'.$MerchantTradeNo.' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'receiveerrors.log');
};
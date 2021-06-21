<?php
$orderNo=$_GET['orders_no'];
header("Content-type:text/html;charset=utf-8");
require_once("./connect.php");
$sql = "select p.NAME, o.QUANTITY, p.PRICE,p.IMG from orders_list o join product p on o.P_ID=p.ID where o.ORDERS_NO = :orderNo;";
$orderP = $pdo->prepare($sql);
    $orderP->bindValue(":orderNo", $orderNo);
    $orderP->execute();
    $items = $orderP->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items, JSON_UNESCAPED_UNICODE);
/**
*   一般產生訂單(全功能)範例
*/
    
    //載入SDK(路徑可依系統規劃自行調整)
    include('ECPay.Payment.Integration.php');
    try {
        
    	$obj = new ECPay_AllInOne();
   
        //服務參數
        $obj->ServiceURL  = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";  //服務位置
        $obj->HashKey     = '5294y06JbISpM5x9' ;                                          //測試用Hashkey，請自行帶入ECPay提供的HashKey
        $obj->HashIV      = 'v77hoKGq4kWxNNIS' ;                                          //測試用HashIV，請自行帶入ECPay提供的HashIV
        $obj->MerchantID  = '2000132';                                                    //測試用MerchantID，請自行帶入ECPay提供的MerchantID
        $obj->EncryptType = '1';                                                          //CheckMacValue加密類型，請固定填入1，使用SHA256加密
        $obj->ClientBackURL = "http://localhost/hidearcafe/dist/orders.html?orders_no=$orderNo";                                                       


        //基本參數(請依系統規劃自行調整)
        $MerchantTradeNo = $orderNo.time() ;//測試用
        // $MerchantTradeNo = $orderNo ;//實際用
        $obj->Send['ReturnURL']         = "https://...../receive.php" ;     //付款完成通知回傳的網址
        $obj->Send['MerchantTradeNo']   = $MerchantTradeNo;                           //訂單編號
        $obj->Send['MerchantTradeDate'] = date('Y/m/d H:i:s');                        //交易時間
        $obj->Send['TotalAmount']       = 4000;                                       //交易金額
        $obj->Send['TradeDesc']         = "小賣店交易" ;                           //交易描述
        $obj->Send['ChoosePayment']     = ECPay_PaymentMethod::ALL ;                  //付款方式:全功能
        $obj->Send['ClientBackURL']     = "http://localhost/hidearcafe/dist/orders.html?orders_no=$orderNo";       //付款完成後跳轉到訂單頁面


        //訂單的商品資料
       
        // array_push($obj->Send['Items'], array('Name' => "歐付寶黑芝麻豆漿", 'Price' => (int)"2000",
        //            'Currency' => "元", 'Quantity' => (int) "1", 'URL' => "",'Subtotal'=>(int)"3000"));
        foreach($items as $item){
            array_push($obj->Send['Items'], array('Name' => $item['NAME'], 'Price' => (int)$item['PRICE'],
                        'Currency' => "元", 'Quantity' => (int) $item['QUANTITY'], 'URL' => ""));
        }
        # 電子發票參數
        /*
        $obj->Send['InvoiceMark'] = ECPay_InvoiceState::Yes;
        $obj->SendExtend['RelateNumber'] = "Test".time();
        $obj->SendExtend['CustomerEmail'] = 'test@ecpay.com.tw';
        $obj->SendExtend['CustomerPhone'] = '0911222333';
        $obj->SendExtend['TaxType'] = ECPay_TaxType::Dutiable;
        $obj->SendExtend['CustomerAddr'] = '台北市南港區三重路19-2號5樓D棟';
        $obj->SendExtend['InvoiceItems'] = array();
        // 將商品加入電子發票商品列表陣列
        foreach ($obj->Send['Items'] as $info)
        {
            array_push($obj->SendExtend['InvoiceItems'],array('Name' => $info['Name'],'Count' =>
                $info['Quantity'],'Word' => '個','Price' => $info['Price'],'TaxType' => ECPay_TaxType::Dutiable));
        }
        $obj->SendExtend['InvoiceRemark'] = '測試發票備註';
        $obj->SendExtend['DelayDay'] = '0';
        $obj->SendExtend['InvType'] = ECPay_InvType::General;
        */


        //產生訂單(auto submit至ECPay)
        $obj->CheckOut();
      

    
    } catch (Exception $e) {
    	echo $e->getMessage();
    } 


 
?>
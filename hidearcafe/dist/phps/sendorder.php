<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>訂單建立中，請稍後...</div>
</body>
</html>
<?
//檢查接接收到的欄位是否有正確
$testpost=$_POST;
unset($testpost['discount']);
unset($testpost['note']);
foreach($testpost as $key=>$value){
    $$key=$value;
    // echo 'test=>'.$key.'<br>';
    if($value==''){
            echo "<script>alert('系統錯誤,請關閉網頁後重新操作或洽管理員。'); location.href='../index.html';</script>";
            // header("Location: ../index.html");
            exit();
        }
}; 
foreach($_POST as $key=>$value){
    $$key=$value;
    // echo $key,':',$value,'<br><br>';
}; 

require_once("./connect.php");
try{
    //確認折價券是否正確，以及折扣數字
    // if($discount!=''){
    //     $sql="select DISCOUNT from coupon where TEXT = :discount";
    //     $discountprice = $pdo->prepare($sql);
    //     $discountprice->bindValue(":discount",  $discount);
    //     $discountprice->execute();
    //     if ($discountprice->rowCount() == 0) {
    //         echo "折價券號碼有問題";
    //         exit();
            
    //     } else {
    //         $productRow = $discountprice->fetch(PDO::FETCH_ASSOC);
    //         $discount=$productRow['DISCOUNT'];
    //     }
    // }else{
    //     $discount=0;
    // };
    //計算每筆商品數量及價格
    $total=0;
    $size=0;
    $list=preg_split('/,/', $addItemList, -1, PREG_SPLIT_NO_EMPTY);
    foreach($list as $v){
        $id= substr($$v,1);
        // $sql="select PRICE,SIZE from product where ID = :id";
        // $product = $pdo->prepare($sql);
        // $product->bindValue(":id",  $id);
        // $product->execute();
        // $productRow = $product->fetch(PDO::FETCH_ASSOC);
        // $price= $productRow['PRICE'];

        //靜態網頁data建立開始
        $price=500;
        $s=1;
        $orderNo=3;
        $discount=0;
        //靜態網頁data建立結束

        $num=preg_split('/,/', $$v, -1, PREG_SPLIT_NO_EMPTY)[1];
        $total+=$num*$price;
        // $s=$productRow['SIZE'];
        $size+=$s*$num;
    };
    
    //計算運費
    $boxsize=8;
    $dFee=0;
    $dFee += intval($size /$boxsize)*150;
    $dFee += ($size % $boxsize > 0) ? 150 : 0;

    //計算訂單總額
    $total= $total-$discount+$dFee;
    
    //建立訂單
    // $sql ="INSERT INTO `orders` (ORDERS_NO,NAME_SENDER, ADD_SENDER, PHONE_SENDER, NAME_RECEIVER, ADD_RECEIVER,ZIPCODE, PHONE_RECEIVER, NOTE, DELIVERY_FEE, DELIVERY_STATE, DELIVERY_NO, DISCOUNT, TOTAL,ORDER_DATE,PAYMENT) 
    //                       VALUES (NULL, :NAME_SENDER, :ADD_SENDER, :PHONE_SENDER, :NAME_RECEIVER, :ADD_RECEIVER,:ZIPCODE, :PHONE_RECEIVER, :NOTE, :DELIVERY_FEE, '0', '', :DISCOUNT, :TOTAL,:ORDER_DATE,0);";
    
    // $orderInfo = $pdo->prepare($sql);
    // $orderInfo->bindValue(":NAME_SENDER",  $sName);
    // $orderInfo->bindValue(":ADD_SENDER",  $sAdd);
    // $orderInfo->bindValue(":PHONE_SENDER",  $sPhone);
    // $orderInfo->bindValue(":NAME_RECEIVER",  $rName);
    // $orderInfo->bindValue(":ADD_RECEIVER",  $rAdd);
    // $orderInfo->bindValue(":ZIPCODE",  $zipcode);
    // $orderInfo->bindValue(":PHONE_RECEIVER",  $rPhone);
    // if(isset($note)){
    //     $orderInfo->bindValue(":NOTE",  $note);
    // }else{
    //     $orderInfo->bindValue(":NOTE",  null);
    // };
    // $orderInfo->bindValue(":DELIVERY_FEE",  $dFee);
    // $orderInfo->bindValue(":DISCOUNT",  $discount);
    // $orderInfo->bindValue(":TOTAL",  $total);
    // $orderInfo->bindValue(":ORDER_DATE",  date('Y/m/d/H/i'));
    // $affectedRows=$orderInfo->execute();
    // // echo "成功異動了{$affectedRows}筆資料";
    // $orderNo = $pdo->lastInsertId();
    // echo '訂單編號為:',$orderNo,'<br>';

    //建立訂單購買商品清單
    // foreach($list as $v){
    //     $id= substr($v,1);
    //     $num=preg_split('/,/', $$v, -1, PREG_SPLIT_NO_EMPTY)[1];
    //     $sql="INSERT INTO orders_list (ORDERS_NO, P_ID, QUANTITY) 
    //                            VALUES (:ORDERS_NO, :P_ID, :QUANTITY);";
    //     $itemorder = $pdo->prepare($sql);
    //     $itemorder->bindValue(":ORDERS_NO",  $orderNo);
    //     $itemorder->bindValue(":P_ID",  $id);
    //     $itemorder->bindValue(":QUANTITY",  $num);
    //     $affectedRows=$itemorder->execute();
        // echo "成功異動了{$affectedRows}筆資料";
    // };
    //建立訂單加價購清單
    // if(isset($_POST['addpriceproduct'])){
    //     $id=substr($addpriceproduct,3);
    //     $num=preg_split('/,/', $$addpriceproduct, -1, PREG_SPLIT_NO_EMPTY)[1];
    //     $sql="INSERT INTO addprice_list (ORDERS_NO, ADD_NO, QUANTITY) 
    //     VALUES (:ORDERS_NO, :P_ID, :QUANTITY);";
    //     $addpriceorder = $pdo->prepare($sql);
    //     $addpriceorder->bindValue(":ORDERS_NO",  $orderNo);
    //     $addpriceorder->bindValue(":P_ID",  $id);
    //     $addpriceorder->bindValue(":QUANTITY",  $num);
    //     $affectedRows=$addpriceorder->execute();
        // echo "成功異動了{$affectedRows}筆資料";
    // };
    //建立訂單滿額贈清單
    // if(isset($_POST['GiftWithPurchase'])){
    //     $id=substr($GiftWithPurchase,3);
    //     $num=preg_split('/,/', $$GiftWithPurchase, -1, PREG_SPLIT_NO_EMPTY)[1];
    //     $sql="INSERT INTO gwp_list (ORDERS_NO, GWP_NO, QUANTITY) 
    //     VALUES (:ORDERS_NO, :P_ID, :QUANTITY);";
    //     $gwporder = $pdo->prepare($sql);
    //     $gwporder->bindValue(":ORDERS_NO",  $orderNo);
    //     $gwporder->bindValue(":P_ID",  $id);
    //     $gwporder->bindValue(":QUANTITY",  $num);
    //     $affectedRows=$gwporder->execute();
        // echo "成功異動了{$affectedRows}筆資料";
    // };
    
    //串接金流
    // $sql = "select p.NAME, o.QUANTITY, p.PRICE,p.IMG from orders_list o join product p on o.P_ID=p.ID where o.ORDERS_NO = :orderNo;";
    // $orderP = $pdo->prepare($sql);
    // $orderP->bindValue(":orderNo", $orderNo);
    // $orderP->execute();
    // $items = $orderP->fetchAll(PDO::FETCH_ASSOC);
    // echo json_encode($items, JSON_UNESCAPED_UNICODE);
/**
*   一般產生訂單(全功能)範例
*/
    
    //載入SDK(路徑可依系統規劃自行調整)
    include('ECPay.Payment.Integration.php');
        
    	$obj = new ECPay_AllInOne();
   
        //服務參數
        $obj->ServiceURL  = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";  //服務位置
        $obj->HashKey     = '5294y06JbISpM5x9' ;                                          //測試用Hashkey，請自行帶入ECPay提供的HashKey
        $obj->HashIV      = 'v77hoKGq4kWxNNIS' ;                                          //測試用HashIV，請自行帶入ECPay提供的HashIV
        $obj->MerchantID  = '2000132';                                                    //測試用MerchantID，請自行帶入ECPay提供的MerchantID
        $obj->EncryptType = '1';                                                          //CheckMacValue加密類型，請固定填入1，使用SHA256加密                                           


        //基本參數(請依系統規劃自行調整)
        $MerchantTradeNo = "Test".time() ;
        $obj->Send['ReturnURL']         = "http://localhost/hidearcafe/dist/receive.php" ;     //付款完成通知回傳的網址
        $obj->Send['MerchantTradeNo']   = $MerchantTradeNo;                           //訂單編號
        $obj->Send['MerchantTradeDate'] = date('Y/m/d H:i:s');                        //交易時間
        $obj->Send['TotalAmount']       =  $total;                                       //交易金額
        $obj->Send['TradeDesc']         = "小賣店交易" ;                           //交易描述
        $obj->Send['ChoosePayment']     = ECPay_PaymentMethod::ALL ;                  //付款方式:全功能
        $obj->Send['ClientBackURL']     = "http://localhost/cafe/hidearcafe/dist/orders.html?orders_no=$orderNo";       //付款完成後跳轉到訂單頁面


        //訂單的商品資料
        //靜態網頁data建立開始
            array_push($obj->Send['Items'], array('Name' => '測試商品', 'Price' => (int)500,
                        'Currency' => "元", 'Quantity' => (int) 2, 'URL' => ""));
            array_push($obj->Send['Items'], array('Name' => '測試商品2', 'Price' => (int)500,
                        'Currency' => "元", 'Quantity' => (int) 1, 'URL' => ""));
            array_push($obj->Send['Items'], array('Name' => '測試商品3', 'Price' => (int)500,
                        'Currency' => "元", 'Quantity' => (int) 5, 'URL' => ""));
                
        //靜態網頁data建立結束
        // foreach($items as $item){
        //     array_push($obj->Send['Items'], array('Name' => $item['NAME'], 'Price' => (int)$item['PRICE'],
        //                 'Currency' => "元", 'Quantity' => (int) $item['QUANTITY'], 'URL' => ""));
        //             }
            array_push($obj->Send['Items'], array('Name' => '運費', 'Price' => (int)$dFee,
                        'Currency' => "元", 'Quantity' => (int) 1, 'URL' => ""));
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
      
    
    
    //跳轉頁面;

    // header("Location: ../orders.html?orders_no={$orderNo}");
    // exit();
}catch (PDOException $e) {
    echo  $e->getMessage() ;
};
?>
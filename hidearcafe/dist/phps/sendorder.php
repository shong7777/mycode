<?
 ob_start();
 echo "訂單建立中，請稍後...";
//檢查接接收到的欄位是否有正確
$postdata=$_POST;
unset($postdata['discount']);
unset($postdata['note']);
foreach($postdata as $key=>$value){
    $$key=$value;
    // echo 'test=>'.$key.'<br>';
    if($value==''){
            echo "<script>alert('系統錯誤,請關閉網頁後重新操作或洽管理員。'); location.href='../index.html';</script>";
            // header("Location: ../index.html");
            $error="必填欄位$key 傳輸有誤。";
            $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
            error_log($str,3,'errors.log');
            $pdo=null;
            exit();
        }
}; 
foreach($_POST as $key=>$value){
    $$key=$value;
}; 
try{
    require_once("./connect.php");
    //計算每筆商品數量及價格
    $total=0;
    $size=0;
    $list=preg_split('/,/', $addItemList, -1, PREG_SPLIT_NO_EMPTY);
    foreach($list as $v){
        $id= substr($$v,1);
        $sql="select PRICE,SIZE from product where ID = :id and ONSALE=1;";
        $product = $pdo->prepare($sql);
        $product->bindValue(":id",  $id);
        $product->execute();
        $productRow = $product->fetch(PDO::FETCH_ASSOC);
        if($productRow==''){
            echo "<script>alert('系統錯誤,請關閉網頁後重新操作或洽管理員。'); location.href='../index.html';</script>";
            $error="必填欄位$key 傳輸有誤。";
            $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
            error_log($str,3,'errors.log');
            $pdo=null;
            exit();
        }
        $price= $productRow['PRICE'];
        $num=preg_split('/,/', $$v, -1, PREG_SPLIT_NO_EMPTY)[1];
        $total+=$num*$price;
        $s=$productRow['SIZE'];
        $size+=$s*$num;
    };
    //確認加價購(有的話)
    if(isset($addpriceproduct)){
        $id=substr($addpriceproduct,3);
        $sql="select PRICE,SIZE from addprice where ID = :id and ONSALE=1";
        $product = $pdo->prepare($sql);
        $product->bindValue(":id",  $id);
        $product->execute();
        $productRow = $product->fetch(PDO::FETCH_ASSOC);
        if($productRow==''){
            echo "<script>alert('系統錯誤,請關閉網頁後重新操作或洽管理員。'); location.href='../index.html';</script>";
            $error="必填欄位$key 傳輸有誤。";
            $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
            error_log($str,3,'errors.log');
            $pdo=null;
            exit();
        }
        $addprice= $productRow['PRICE'];
        $num=preg_split('/,/', $$addpriceproduct, -1, PREG_SPLIT_NO_EMPTY)[1];
        $total+=$addprice*$num;
        $s=$productRow['SIZE']*$num;
        $size+=$s;
    }

    //計算運費
    $boxsize=8;
    $dFee=0;
    $dFee += intval($size /$boxsize)*160;
    $dFee += ($size % $boxsize > 0) ? 160 : 0;
    //滿兩千免運
    if($total>=2000)$dFee=0;

    //計算訂單總額
    $total= $total+$dFee;



      //確認折價券是否正確，以及折扣數字
      if($discount!=''){
        $discountText=$discount;
        $sql="select DISCOUNT,DIVEAWAY_ID,diveaway.NAME,diveaway.IMG from coupon left join diveaway on coupon.DIVEAWAY_ID = diveaway.ID where coupon.ONSALE = 1 and coupon.TEXT = :discountText ";
        $discountprice = $pdo->prepare($sql);
        $discountprice->bindValue(":discountText",  $discountText);
        $discountprice->execute();
        $productRow = $discountprice->fetch(PDO::FETCH_ASSOC);
        print_r($productRow);
        if($productRow==''){
            echo "折價券號碼有問題，請重新操作。";
            $pdo=null;
            exit(); 
        } else {
            $discount=$productRow['DISCOUNT'];
            if($productRow['DIVEAWAY_ID']!=null){
                $diveawayNo=$productRow['DIVEAWAY_ID'];
            }
            $discount=(int)$discount;
        }
    }else{
        $discount=0;
    };

$total= $total-$discount;
if($total>=10000){
    echo "<script>alert('系統錯誤,請關閉網頁後重新操作或洽管理員。'); location.href='../index.html';</script>";
    $error="必填欄位$key 傳輸有誤。";
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
    $pdo=null;
    exit();
}


//開始交易庫存
$pdo->beginTransaction();
foreach($list as $v){
    $id= substr($v,1);
    $num=preg_split('/,/', $$v, -1, PREG_SPLIT_NO_EMPTY)[1];
    $sql = "select NAME, STOCK from product  WHERE ID = :id and STOCK is not null and STOCK < :value for update;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":value", $num, PDO::PARAM_INT);
    $products->bindValue(":id",  $id);
    $products->execute();
    $productRow = $products->fetch(PDO::FETCH_ASSOC);
    if($products->rowCount() != 0){
        $name= $productRow['NAME'];
        ob_end_clean();
        $pdo=null;
        exit($name.'庫存已售完，請重新操作，造成不便敬請見諒。<a href="../cart.html">回購物車。</a>');
    }
    $sql = "UPDATE product SET STOCK= STOCK  - :value WHERE ID = :id;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":value", $num, PDO::PARAM_INT);
    $products->bindValue(":id",  $id);
    $products->execute();
};

if(isset($addpriceproduct)){
    $id=substr($addpriceproduct,3);
    $num=preg_split('/,/', $$addpriceproduct, -1, PREG_SPLIT_NO_EMPTY)[1];
    $sql = "select NAME,STOCK from addprice  WHERE ID = :id and STOCK is not null and STOCK < :value for update;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":value", $num, PDO::PARAM_INT);
    $products->bindValue(":id",  $id);
    $products->execute();
    if($products->rowCount() != 0){
        $productRow=$products->fetch(PDO::FETCH_ASSOC);
        $name= $productRow['NAME'];
        ob_end_clean();
        $pdo=null;
        exit($name.'庫存已售完，請重新操作，造成不便敬請見諒。');
    }
    $sql = "UPDATE addprice SET STOCK= STOCK  - :value WHERE ID = :id;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":value", $num, PDO::PARAM_INT);
    $products->bindValue(":id",  $id);
    $products->execute();
}


if(isset($GiftWithPurchase)){
    $id=substr($GiftWithPurchase,3);
    $num=preg_split('/,/', $$GiftWithPurchase, -1, PREG_SPLIT_NO_EMPTY)[1];
    $sql = "select NAME,STOCK from gift_with_purchase  WHERE ID = :id and STOCK is not null and STOCK < :value for update;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":value", $num, PDO::PARAM_INT);
    $products->bindValue(":id",  $id);
    $products->execute();
    if($products->rowCount() != 0){
        $productRow=$products->fetch(PDO::FETCH_ASSOC);
        $name= $productRow['NAME'];
        ob_end_clean();
        $pdo=null;
        exit($name.'庫存已售完，請重新操作，造成不便敬請見諒。');
    }
    $sql = "UPDATE gift_with_purchase  SET STOCK= STOCK  - :value WHERE ID = :id;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":value", $num, PDO::PARAM_INT);
    $products->bindValue(":id",  $id);
    $products->execute();
}

$pdo->commit();

    //建立訂單
    $sql ="INSERT INTO `orders` (ORDERS_NO,NAME_SENDER, ADD_SENDER, PHONE_SENDER, NAME_RECEIVER, ADD_RECEIVER,ZIPCODE, PHONE_RECEIVER, NOTE, DELIVERY_FEE, ORDER_STATE,DELIVERY_METHOD, DELIVERY_NO, DISCOUNT, TOTAL,ORDER_DATE,PAYMENT,TRADENO,mail) 
                          VALUES (NULL, :NAME_SENDER, :ADD_SENDER, :PHONE_SENDER, :NAME_RECEIVER, :ADD_RECEIVER,:ZIPCODE, :PHONE_RECEIVER, :NOTE, :DELIVERY_FEE, '0', :DELIVERY_METHOD,'', :DISCOUNT, :TOTAL,:ORDER_DATE,0,'',:mail);";
    
    $orderInfo = $pdo->prepare($sql);
    $orderInfo->bindValue(":NAME_SENDER",  $sName);
    $orderInfo->bindValue(":ADD_SENDER",  $sAdd);
    $orderInfo->bindValue(":PHONE_SENDER",  $sPhone);
    $orderInfo->bindValue(":NAME_RECEIVER",  $rName);
    $orderInfo->bindValue(":ADD_RECEIVER",  $rAdd);
    $orderInfo->bindValue(":ZIPCODE",  $zipcode);
    $orderInfo->bindValue(":PHONE_RECEIVER",  $rPhone);
    $orderInfo->bindValue(":DELIVERY_METHOD",  $delivery);
    if(isset($note)){
        $orderInfo->bindValue(":NOTE",  $note);
    }else{
        $orderInfo->bindValue(":NOTE",  null);
    };
    $orderInfo->bindValue(":DELIVERY_FEE",  $dFee);
    $orderInfo->bindValue(":DISCOUNT",  $discount);
    $orderInfo->bindValue(":TOTAL",  $total);
    $orderInfo->bindValue(":ORDER_DATE",  date('Y/m/d/H/i'));
    $orderInfo->bindValue(":mail",  $mail);
    $affectedRows=$orderInfo->execute();
    $orderNo = $pdo->lastInsertId();

    //建立訂單購買商品清單
    foreach($list as $v){
        $id= substr($v,1);
        $num=preg_split('/,/', $$v, -1, PREG_SPLIT_NO_EMPTY)[1];
        $sql="INSERT INTO orders_list (ORDERS_NO, P_ID, QUANTITY) 
                               VALUES (:ORDERS_NO, :P_ID, :QUANTITY);";
        $itemorder = $pdo->prepare($sql);
        $itemorder->bindValue(":ORDERS_NO",  $orderNo);
        $itemorder->bindValue(":P_ID",  $id);
        $itemorder->bindValue(":QUANTITY",  $num);
        $affectedRows=$itemorder->execute();
        // echo "成功異動了{$affectedRows}筆資料";
    };
    //建立訂單加價購清單
    if(isset($addpriceproduct)){
        $id=substr($addpriceproduct,3);
        $num=preg_split('/,/', $$addpriceproduct, -1, PREG_SPLIT_NO_EMPTY)[1];
        $sql="INSERT INTO addprice_list (ORDERS_NO, ADD_NO, QUANTITY) 
        VALUES (:ORDERS_NO, :P_ID, :QUANTITY);";
        $addpriceorder = $pdo->prepare($sql);
        $addpriceorder->bindValue(":ORDERS_NO",  $orderNo);
        $addpriceorder->bindValue(":P_ID",  $id);
        $addpriceorder->bindValue(":QUANTITY",  $num);
        $affectedRows=$addpriceorder->execute();
        // echo "成功異動了{$affectedRows}筆資料";
    };
    //建立訂單滿額贈清單
    if(isset($GiftWithPurchase)){
        $id=substr($GiftWithPurchase,3);
        $num=preg_split('/,/', $$GiftWithPurchase, -1, PREG_SPLIT_NO_EMPTY)[1];
        $sql="INSERT INTO gwp_list (ORDERS_NO, GWP_NO, QUANTITY) 
        VALUES (:ORDERS_NO, :P_ID, :QUANTITY);";
        $gwporder = $pdo->prepare($sql);
        $gwporder->bindValue(":ORDERS_NO",  $orderNo);
        $gwporder->bindValue(":P_ID",  $id);
        $gwporder->bindValue(":QUANTITY",  $num);
        $affectedRows=$gwporder->execute();
        // echo "成功異動了{$affectedRows}筆資料";
    };
    //建立訂單折價券正品清單
    if(isset($diveawayNo)){
        $id=$diveawayNo;
        $num=1;
        $sql="INSERT INTO diveaway_list (ORDERS_NO, DIVEAWAY_NO, QUANTITY) 
        VALUES (:ORDERS_NO, :P_ID, :QUANTITY);";
        $gwporder = $pdo->prepare($sql);
        $gwporder->bindValue(":ORDERS_NO",  $orderNo);
        $gwporder->bindValue(":P_ID",  $id);
        $gwporder->bindValue(":QUANTITY",  $num);
        $affectedRows=$gwporder->execute();
        // echo "成功異動了{$affectedRows}筆資料";
    };
    //下架已使用的折價券
    if($discountText!=''){
        $sql="UPDATE `coupon` SET `ONSALE` = '0' WHERE `TEXT` = :discount;";
        $discountused = $pdo->prepare($sql);
        $discountused->bindValue(":discount",  $discountText);
        $discountused->execute();
        $affectedRows=$discountused->execute();
    };
    
    //串接金流
    $sql = "select p.NAME, o.QUANTITY, p.PRICE,p.IMG,p.SPEC from orders_list o join product p on o.P_ID=p.ID where o.ORDERS_NO = :orderNo;";
    $orderP = $pdo->prepare($sql);
    $orderP->bindValue(":orderNo", $orderNo);
    $orderP->execute();
    $items = $orderP->fetchAll(PDO::FETCH_ASSOC);
    // echo json_encode($items, JSON_UNESCAPED_UNICODE);
/**
*   一般產生訂單(全功能)範例
*/
    
    //載入SDK(路徑可依系統規劃自行調整)
    include('ECPay.Payment.Integration.php');
        
    	$obj = new ECPay_AllInOne();
   
        //服務參數
        // $obj->ServiceURL  = "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";  //測試服務位置
        $obj->ServiceURL  = "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5";  //正式服務位置
        // $obj->HashKey     = '5294y06JbISpM5x9' ;                                          //測試用Hashkey，請自行帶入ECPay提供的HashKey
        // $obj->HashIV      = 'v77hoKGq4kWxNNIS' ;                                          //測試用HashIV，請自行帶入ECPay提供的HashIV
        // $obj->MerchantID  = '2000132';                                                    //測試用MerchantID，請自行帶入ECPay提供的MerchantID
        $obj->HashKey     = 'RSph7nOEUpVku0Iv' ;                                          //正式用Hashkey，請自行帶入ECPay提供的HashKey
        $obj->HashIV      = 'q4KHELDvJ3glokFF' ;                                          //正式用HashIV，請自行帶入ECPay提供的HashIV
        $obj->MerchantID  = '3287784';                                                    //正式用MerchantID，請自行帶入ECPay提供的MerchantID
        $obj->EncryptType = '1';                                                          //CheckMacValue加密類型，請固定填入1，使用SHA256加密                                           

        //設定交易編號並寫入訂單資料
        $MerchantTradeNo = $orderNo.time() ;
        $sql = "update orders SET TRADENO = $MerchantTradeNo where ORDERS_NO = $orderNo;";
        $orderTN = $pdo->prepare($sql);
        $orderTN->execute();
        $pdo=null;

//發送mail

$to=$mail;
$payment=0;
$from = ' Hicafe <Hicafe>';
if($to!=''){
  switch ($payment){
    case 0:
      $payment='未付款';
      break;
    case 1:
      $payment='已付款';
      break;
  }
    $subject=mb_encode_mimeheader("感謝您的購買，訂單內容請詳閱。", 'UTF-8');
    $headers = "From: $from\r\n" .
           "MIME-Version: 1.0\r\n" .
           "Content-type: text/html; charset=UTF-8\r\n";
    $message = "
    <!DOCTYPE html>
    <html lang='UTF-8'>
    <head>
        <meta charset='UTF-8'>
        <meta http-equiv='X-UA-Compatible' content='IE=edge'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>訂單內容</title>
    </head>
    
    <body>
    <p>您在Hicafe所下訂的訂單</p>
    <table>
      <tr>
        <td>訂單號碼</td><td>$MerchantTradeNo</td>
      </tr>
      <tr>
        <td>付款狀態</td><td>$payment</td>
      </tr>
    </table>
    <a href='https://hidearcafe2553.com.tw/orders.html?orders_no=$MerchantTradeNo'>點擊此連結可以觀看訂單詳情</a> 
    <p>本信件為系統發信，如有需要請來電:<a href='tel:+886-3-4751386'>03-4751386</a>或mail到:<a href='mailto:hidearca@hidearcafe2553.om'>Hidear</a></p>
    </body>
    
    </html>
";
$sendmail=mail($to,$subject,$message,$headers);
   if(!$sendmail) {
    $error = error_get_last()['message'];
    // throw new Exception($error);
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
   }
}else{
    exit('您的郵件地址有誤，無法寄信，請重新操作。');
}

        //基本參數(請依系統規劃自行調整)
        $obj->Send['ReturnURL']         = "https://hidearcafe2553.com.tw/phps/receive.php" ;     //付款完成通知回傳的網址
        $obj->Send['MerchantTradeNo']   = $MerchantTradeNo;                           //訂單編號
        $obj->Send['MerchantTradeDate'] = date('Y/m/d H:i:s');                        //交易時間
        $obj->Send['TotalAmount']       =  $total;                                       //交易金額
        $obj->Send['TradeDesc']         = "小賣店交易" ;                           //交易描述
        $obj->Send['ChoosePayment']     = ECPay_PaymentMethod::ALL ;                  //付款方式:全功能
        $obj->Send['ClientBackURL']     = "https://hidearcafe2553.com.tw/orders.html?orders_no=$MerchantTradeNo";       //付款完成後跳轉到訂單頁面


        //訂單的商品資料
        foreach($items as $item){
            $spec='('.$item['SPEC'].')';
            if($item['SPEC']===''){$spec='';};
            array_push($obj->Send['Items'], array('Name' => $item['NAME'].$spec , 'Price' => (int)$item['PRICE'],
                        'Currency' => "元", 'Quantity' => (int) $item['QUANTITY'], 'URL' => ""));
                    }
            if(isset($addpriceproduct)){
                array_push($obj->Send['Items'], array('Name' => '加價購', 'Price' => (int)$addprice,
                'Currency' => "元", 'Quantity' => '1', 'URL' => ""));
            }
            if(isset($GiftWithPurchase)){
                array_push($obj->Send['Items'], array('Name' => '滿額贈', 'Price' => (int)0,
                'Currency' => "元", 'Quantity' => '1', 'URL' => ""));
            }
            if(isset($diveawayNo)){
                array_push($obj->Send['Items'], array('Name' => '贈品', 'Price' => (int)0,
                'Currency' => "元", 'Quantity' => '1', 'URL' => ""));
            }
            array_push($obj->Send['Items'], array('Name' => '運費', 'Price' => (int)$dFee,
                        'Currency' => "元", 'Quantity' => '1', 'URL' => ""));
            if($discount!=0){array_push($obj->Send['Items'], array('Name' => '折扣', 'Price' => (int)(-$discount),
                        'Currency' => "元", 'Quantity' => '1', 'URL' => ""));}
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
        ob_end_clean();
        ?>
        <script>
            const storage = sessionStorage;
            let addItemList=<? echo json_encode($list); ?>;
            for (let i in addItemList) { storage.removeItem(addItemList[i]); }
            storage.removeItem('addItemList');
         </script>
        <?
        echo '訂單建立完成，跳轉付款頁面。';
        $obj->CheckOut();

} catch (PDOException $e) {
    $pdo->rollBack();
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
    ob_end_clean();
    exit('系統發生錯誤，請重新操作，造成不見還請見諒。');
}catch(Exception $e) {
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
}
?>
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
    echo 'test=>'.$key.'<br>';
    if($value==''){
            echo "<script>alert('系統錯誤,請關閉網頁後重新操作或洽管理員。'); location.href='../index.html';</script>";
            // header("Location: ../index.html");
            exit();
        }
}; 
foreach($_POST as $key=>$value){
    $$key=$value;
    echo $key,':',$value,'<br><br>';
}; 

require_once("./connect.php");
try{
    //確認折價券是否正確，以及折扣數字
    if($discount!=''){
        $sql="select DISCOUNT from coupon where TEXT = :discount";
        $discountprice = $pdo->prepare($sql);
        $discountprice->bindValue(":discount",  $discount);
        $discountprice->execute();
        if ($discountprice->rowCount() == 0) {
            echo "折價券號碼有問題";
            exit();
            
        } else {
            $productRow = $discountprice->fetch(PDO::FETCH_ASSOC);
            $discount=$productRow['DISCOUNT'];
        }
    }else{
        $discount=0;
    };
    //計算每筆商品數量及價格
    $total=0;
    $size=0;
    $list=preg_split('/,/', $addItemList, -1, PREG_SPLIT_NO_EMPTY);
    foreach($list as $v){
        $id= substr($$v,1);
        $sql="select PRICE,SIZE from product where ID = :id";
        $product = $pdo->prepare($sql);
        $product->bindValue(":id",  $id);
        $product->execute();
        $productRow = $product->fetch(PDO::FETCH_ASSOC);
        $price= $productRow['PRICE'];
        $num=preg_split('/,/', $$v, -1, PREG_SPLIT_NO_EMPTY)[1];
        $total+=$num*$price;
        $s=$productRow['SIZE'];
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
    $sql ="INSERT INTO `orders` (ORDERS_NO,NAME_SENDER, ADD_SENDER, PHONE_SENDER, NAME_RECEIVER, ADD_RECEIVER,ZIPCODE, PHONE_RECEIVER, NOTE, DELIVERY_FEE, DELIVERY_STATE, DELIVERY_NO, DISCOUNT, TOTAL,ORDER_DATE,PAYMENT) 
                          VALUES (NULL, :NAME_SENDER, :ADD_SENDER, :PHONE_SENDER, :NAME_RECEIVER, :ADD_RECEIVER,:ZIPCODE, :PHONE_RECEIVER, :NOTE, :DELIVERY_FEE, '0', '', :DISCOUNT, :TOTAL,:ORDER_DATE,0);";
    
    $orderInfo = $pdo->prepare($sql);
    $orderInfo->bindValue(":NAME_SENDER",  $sName);
    $orderInfo->bindValue(":ADD_SENDER",  $sAdd);
    $orderInfo->bindValue(":PHONE_SENDER",  $sPhone);
    $orderInfo->bindValue(":NAME_RECEIVER",  $rName);
    $orderInfo->bindValue(":ADD_RECEIVER",  $rAdd);
    $orderInfo->bindValue(":ZIPCODE",  $zipcode);
    $orderInfo->bindValue(":PHONE_RECEIVER",  $rPhone);
    if(isset($note)){
        $orderInfo->bindValue(":NOTE",  $note);
    }else{
        $orderInfo->bindValue(":NOTE",  null);
    };
    $orderInfo->bindValue(":DELIVERY_FEE",  $dFee);
    $orderInfo->bindValue(":DISCOUNT",  $discount);
    $orderInfo->bindValue(":TOTAL",  $total);
    $orderInfo->bindValue(":ORDER_DATE",  date('Y/m/d/H/i'));
    $affectedRows=$orderInfo->execute();
    echo "成功異動了{$affectedRows}筆資料";
    $orderNo = $pdo->lastInsertId();
    echo '訂單編號為:',$orderNo,'<br>';

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
        echo "成功異動了{$affectedRows}筆資料";
    };
    //建立訂單加價購清單
    if(isset($_POST['addpriceproduct'])){
        $id=substr($addpriceproduct,3);
        $num=preg_split('/,/', $$addpriceproduct, -1, PREG_SPLIT_NO_EMPTY)[1];
        $sql="INSERT INTO addprice_list (ORDERS_NO, ADD_NO, QUANTITY) 
        VALUES (:ORDERS_NO, :P_ID, :QUANTITY);";
        $addpriceorder = $pdo->prepare($sql);
        $addpriceorder->bindValue(":ORDERS_NO",  $orderNo);
        $addpriceorder->bindValue(":P_ID",  $id);
        $addpriceorder->bindValue(":QUANTITY",  $num);
        $affectedRows=$addpriceorder->execute();
        echo "成功異動了{$affectedRows}筆資料";
    };
    //建立訂單滿額贈清單
    if(isset($_POST['GiftWithPurchase'])){
        $id=substr($GiftWithPurchase,3);
        $num=preg_split('/,/', $$GiftWithPurchase, -1, PREG_SPLIT_NO_EMPTY)[1];
        $sql="INSERT INTO gwp_list (ORDERS_NO, GWP_NO, QUANTITY) 
        VALUES (:ORDERS_NO, :P_ID, :QUANTITY);";
        $gwporder = $pdo->prepare($sql);
        $gwporder->bindValue(":ORDERS_NO",  $orderNo);
        $gwporder->bindValue(":P_ID",  $id);
        $gwporder->bindValue(":QUANTITY",  $num);
        $affectedRows=$gwporder->execute();
        echo "成功異動了{$affectedRows}筆資料";
    };
    //跳轉頁面;
    header("Location: ./CreateOrder.php?orders_no={$orderNo}");
    // header("Location: ../orders.html?orders_no={$orderNo}");
    exit();
}catch (PDOException $e) {
    echo  $e->getMessage() ;
};
?>
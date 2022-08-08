<? session_start();
if(!isset($_SESSION['username'])){
    exit('未登入');
};
try{
    require_once("./connect.php");
    $ororderNo=$_POST['orders_no'];
    $sql = "select ORDERS_NO,NAME_SENDER,ADD_SENDER,PHONE_SENDER,NAME_RECEIVER,ADD_RECEIVER,ZIPCODE,PHONE_RECEIVER,NOTE,DELIVERY_FEE,ORDER_STATE,DISCOUNT,TOTAL,ORDER_DATE,PAYMENT from orders where ORDERS_NO = :orderNo";
    $sql = "select * from orders where ORDERS_NO = :orderNo";
    $orderInfo = $pdo->prepare($sql);
    $orderInfo->bindValue(":orderNo", $ororderNo);
    $orderInfo->execute();
    $info = $orderInfo->fetch(PDO::FETCH_ASSOC);
        
    $sql = "select p.NAME, o.QUANTITY, p.PRICE,p.IMG,p.ID from orders_list o join product p on o.P_ID=p.ID where o.ORDERS_NO = :orderNo;";
    $orderList = $pdo->prepare($sql);
    $orderList->bindValue(":orderNo", $ororderNo);
    $orderList->execute();
    $products=$orderList->fetchAll(PDO::FETCH_ASSOC);
    
    $sql = "select p.NAME, o.QUANTITY, p.PRICE,p.IMG,p.ID  from addprice_list o join addprice p on o.ADD_NO=p.ID where o.ORDERS_NO = :orderNo";
    $addpriceproduct = $pdo->prepare($sql);
    $addpriceproduct->bindValue(":orderNo", $ororderNo);
    $addpriceproduct->execute();
    $addpriceproducts=$addpriceproduct->fetchAll(PDO::FETCH_ASSOC);

    $sql = "select p.NAME, o.QUANTITY, p.PRICE,p.IMG,p.ID  from gwp_list o join gift_with_purchase p on o.GWP_NO=p.ID where o.ORDERS_NO = :orderNo";
    $gwpproduct = $pdo->prepare($sql);
    $gwpproduct->bindValue(":orderNo", $ororderNo);
    $gwpproduct->execute();
    $gwpproducts=$gwpproduct->fetchAll(PDO::FETCH_ASSOC);

    $sql = "select p.NAME, o.QUANTITY, p.PRICE,p.IMG,p.ID  from diveaway_list o join diveaway p on o.DIVEAWAY_NO =p.ID where o.ORDERS_NO = :orderNo";
    $diveawayproduct = $pdo->prepare($sql);
    $diveawayproduct->bindValue(":orderNo", $ororderNo);
    $diveawayproduct->execute();
    $diveawayproducts=$diveawayproduct->fetchAll(PDO::FETCH_ASSOC);



    $pdo=null;
    $v=[$info,$products,$addpriceproducts,$gwpproducts,$diveawayproducts];
    echo json_encode($v, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
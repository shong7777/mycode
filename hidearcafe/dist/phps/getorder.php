<?
try {
    require_once("./connect.php");
    $TRADENO=$_POST['orderNo'];
    // $ororderNo='10';
    $sql = "select orders_no,NAME_SENDER,ADD_SENDER,PHONE_SENDER,NAME_RECEIVER,ADD_RECEIVER,ZIPCODE,PHONE_RECEIVER,NOTE,DELIVERY_FEE,DELIVERY_METHOD,ORDER_STATE,DISCOUNT,TOTAL,ORDER_DATE,PAYMENT from orders where TRADENO = :orderNo";
    $orderInfo = $pdo->prepare($sql);
    $orderInfo->bindValue(":orderNo", $TRADENO);
    $orderInfo->execute();
    $info = $orderInfo->fetch(PDO::FETCH_ASSOC);
    foreach($info  as $key=>$value){
            $$key=$value;
            // echo $key,':',$value,'<br><br>';
        }; 
        // substr_replace(string,replacement,start,length)
         $ororderNo=$info['orders_no'];
        $len = mb_strlen($NAME_SENDER,'utf-8');
        //姓名加密
        if($len>1){
            $info['NAME_SENDER']= mb_substr( $NAME_SENDER,0,1,"utf-8").'*'.mb_substr( $NAME_SENDER,2,$len-1,"utf-8");
        }
        //姓名加密
        $len = mb_strlen($NAME_RECEIVER,'utf-8');
        if($len>1){
            $info['NAME_RECEIVER']= mb_substr( $NAME_RECEIVER,0,1,"utf-8").'*'.mb_substr( $NAME_RECEIVER,2,$len-1,"utf-8");
        };
        //地址加密
        $len = mb_strlen($ADD_SENDER,'utf-8');
        if($len>8){
            $info['ADD_SENDER']= mb_substr( $ADD_SENDER,0,$len-5,"utf-8").'*****';
        }
        //地址加密
        $len = mb_strlen($ADD_RECEIVER,'utf-8');
        if($len>8){
            $info['ADD_RECEIVER']= mb_substr( $ADD_RECEIVER,0,$len-5,"utf-8").'*****';
        }
        //手機加密
        $len = mb_strlen($PHONE_RECEIVER,'utf-8');
        if($len>9){
            $info['PHONE_RECEIVER']= mb_substr( $PHONE_RECEIVER,0,$len-6,"utf-8").'***'.mb_substr( $PHONE_RECEIVER,$len-3,$len,"utf-8");
        }
        //手機加密
        $len = mb_strlen($PHONE_SENDER,'utf-8');
        if($len>9){
            $info['PHONE_SENDER']= mb_substr( $PHONE_SENDER,0,$len-6,"utf-8").'***'.mb_substr( $PHONE_SENDER,$len-3,$len,"utf-8");
        }
        foreach($info  as $key=>$value){
            $$key=$value;
        }; 
        
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
    $gwpproducts=$addpriceproduct->fetchAll(PDO::FETCH_ASSOC);
    $sql = "select p.NAME, d.QUANTITY, p.PRICE,p.IMG,p.ID  from diveaway_list d join diveaway p on d.DIVEAWAY_NO=p.ID where d.ORDERS_NO = :orderNo";
    $gwpproduct = $pdo->prepare($sql);
    $gwpproduct->bindValue(":orderNo", $ororderNo);
    $gwpproduct->execute();
    $diveawayproducts=$addpriceproduct->fetchAll(PDO::FETCH_ASSOC);
    $pdo=null;
    $diveawayproducts=$gwpproduct->fetchAll(PDO::FETCH_ASSOC);
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
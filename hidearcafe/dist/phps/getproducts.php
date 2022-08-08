<?
try {
    require_once("./connect.php");
        $sql = "select concat('P',ID) ID,NAME,IMG,PRICE,TYPE,SIZE,INFO,CLASS,STOCK,SPEC,DELIVERY_METHOD from product  where ONSALE = 1 and (STOCK is null or STOCK >0);";
        $products = $pdo->prepare($sql);
        $products->execute();

    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $products ="{}";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);    
    };
    $sql = "select distinct TYPE from product  where ONSALE = 1  and CLASS='甜點' and (STOCK is null or STOCK >0) ;";
    $types = $pdo->prepare($sql);
    $types->execute();
    if ($types->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $types ="{}";
    } else { //找得到
        $typesRow = $types->fetchAll(PDO::FETCH_ASSOC);
    };
    $sql = "select distinct TYPE from product  where ONSALE = 1  and CLASS='咖啡' and (STOCK is null or STOCK >0);";
    $types2 = $pdo->prepare($sql);
    $types2->execute();
    $pdo=null;
    if ($types2->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $typesRow2 ='{}';
    } else { //找得到
        $typesRow2 = $types2->fetchAll(PDO::FETCH_ASSOC);
    };
    //送出json字串
    $a=[$productRow,$typesRow,$typesRow2];
    echo json_encode($a, JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};

?>
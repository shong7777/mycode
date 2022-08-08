<?
try {
    require_once("./connect.php");
        $sql = "SELECT concat('ADD',ID) ID,GRADE,IMG,INFO,NAME,ONSALE,PRICE,SIZE,STOCK,SPEC,DELIVERY_METHOD  from addprice where ONSALE = 1 and (STOCK is null or STOCK >0)";
        $products = $pdo->prepare($sql);
        $products->execute();
        $pdo=null;
    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $products ="{}";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        echo json_encode($productRow, JSON_UNESCAPED_UNICODE);

        
    };
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
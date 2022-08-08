<?
try {
    require_once("./connect.php");
      $sql = "select a.ID ADV_ID,a.IMG ADV_IMG,concat('P',p.ID) ID,p.NAME,p.IMG,p.PRICE,p.TYPE,p.SIZE,p.INFO,p.CLASS,p.STOCK,p.SPEC,p.DELIVERY_METHOD from adv a join product p on a.PRODUCT_ID = p.ID where a.ONSALE = 1 and  (p.STOCK is null or p.STOCK > 0);";
        $products = $pdo->prepare($sql);
        $products->execute();
        $pdo=null;
    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        echo "{}";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        echo json_encode($productRow, JSON_UNESCAPED_UNICODE);
    }
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
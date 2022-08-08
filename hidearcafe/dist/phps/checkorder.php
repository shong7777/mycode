<?
try {
    require_once("./connect.php");
        $orderNo= htmlspecialchars($_POST['orderNo']);
        $sql = "select 1 from orders where TRADENO = :orderNo;";
        $products = $pdo->prepare($sql);
        $products->bindValue(":orderNo", $orderNo);
        $products->execute();
        $pdo=null;
    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        echo "0";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        echo $productRow[0][1];
    }
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
<?
try {
    require_once("./connect.php");
        $text= htmlspecialchars($_POST['text']);
        $sql = "select DISCOUNT,DIVEAWAY_ID,diveaway.NAME,diveaway.IMG from coupon left join diveaway on coupon.DIVEAWAY_ID = diveaway.ID where coupon.ONSALE = 1 and coupon.TEXT = :text ";
        $products = $pdo->prepare($sql);
        $products->bindValue(":text", $text);
        $products->execute();
        $pdo=null;
    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        echo "";
    } else { //找得到
        $productRow = $products->fetch(PDO::FETCH_ASSOC);
        //送出json字串
        echo  json_encode($productRow, JSON_UNESCAPED_UNICODE);
    }
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
}
?>
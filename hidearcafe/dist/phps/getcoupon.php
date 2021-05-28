<?
try {
    require_once("./connect.php");
        $text= htmlspecialchars($_POST['text']);
        $sql = "select DISCOUNT from coupon where ONSALE = 1 and  TEXT = :text ;";
        $products = $pdo->prepare($sql);
        $products->bindValue(":text", $text);
        $products->execute();

    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        echo "";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        echo $productRow[0]['DISCOUNT'];
        // echo $productRow[0]['DISCOUNT'];
    }
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
};?>
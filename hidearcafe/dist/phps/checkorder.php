<?
try {
    require_once("./connect.php");
        $orderNo= htmlspecialchars($_POST['orderNo']);
        $sql = "select 1 from orders where ORDERS_NO=:orderNo;";
        $products = $pdo->prepare($sql);
        $products->bindValue(":orderNo", $orderNo);
        $products->execute();

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
};?>
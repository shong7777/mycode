<?
try {
    require_once("./connect.php");
    // $orderby =htmlspecialchars($_GET['orderby']);
        // $sql = "select * from adv a join product p on a.PRODUCT_ID = p.ID where a.ONSALE = 1 ;";
        $sql = "select a.ADV_ID,ADV_IMG,concat('P',p.ID) ID,p.NAME,p.IMG,p.PRICE,p.TYPE,p.SIZE,p.INFO,p.CLASS from adv a join product p on a.PRODUCT_ID = p.ID where a.ONSALE = 1 ;";

        $products = $pdo->prepare($sql);
        $products->execute();

    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        echo "{}";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        echo json_encode($productRow);
    }
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
};?>
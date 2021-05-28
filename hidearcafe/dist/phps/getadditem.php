<?
try {
    require_once("./connect.php");
    // $orderby =htmlspecialchars($_GET['orderby']);
        $sql = "select * from product  where ONSALE = 1";
        $products = $pdo->prepare($sql);
        $products->execute();

    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $products ="{}";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        
    };
    require_once("./connect.php");
    $sql = "select distinct TYPE from product  where ONSALE = 1;";
    $types = $pdo->prepare($sql);
    $types->execute();
    if ($types->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $types ="{}";
    } else { //找得到
        $typesRow = $types->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        $a=[$productRow,$typesRow];
        echo json_encode($a);
    };

    
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
};?>
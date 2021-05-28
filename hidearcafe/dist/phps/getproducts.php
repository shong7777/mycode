<?
try {
    require_once("./connect.php");
    // $orderby =htmlspecialchars($_GET['orderby']);
        $sql = "select concat('P',ID) ID,NAME,IMG,PRICE,TYPE,SIZE,INFO,CLASS from product  where ONSALE = 1";
        $products = $pdo->prepare($sql);
        $products->execute();

    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $products ="{}";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        
    };
    $sql = "select distinct TYPE from product  where ONSALE = 1  and CLASS='甜點';";
    $types = $pdo->prepare($sql);
    $types->execute();
    if ($types->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $types ="{}";
    } else { //找得到
        $typesRow = $types->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
    };
    $sql = "select distinct TYPE from product  where ONSALE = 1  and CLASS='咖啡';";
    $types2 = $pdo->prepare($sql);
    $types2->execute();
    if ($types2->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $typesRow2 ='{}';
    } else { //找得到
        $typesRow2 = $types2->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
    };
    
    
    $a=[$productRow,$typesRow,$typesRow2];
    echo json_encode($a);
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
};?>
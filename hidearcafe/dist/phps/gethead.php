<?
try {
    require_once("./connect.php");
    // $tablename=$_GET['tablename'];
    // $orderby =htmlspecialchars($_GET['orderby']);
    $sql="SELECT COLUMN_NAME,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'addprice'";
    $products = $pdo->prepare($sql);
        // $products->bindValue(":grade", $grade);
        $products->execute();
    if ($products->rowCount() == 0) { 
        $products ="{}";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        echo json_encode($productRow , JSON_UNESCAPED_UNICODE);
    };
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
};
?>
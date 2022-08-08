<?
try {
    require_once("./connect.php");
    $addItemList=$_POST['addItemList'];
    $list=preg_split('/,/', $addItemList, -1, PREG_SPLIT_NO_EMPTY);
    $items= array();
    foreach($list as $i){
        $id=substr($i,1);
        $num=$_POST[$i];
        $sql = "select ID,STOCK,NAME from product  where ID = $id and  STOCK < $num and STOCK is not null;";
        $products = $pdo->prepare($sql);
        $products->execute();
        if ($products->rowCount() != 0) { 
            $productRow = $products->fetch(PDO::FETCH_ASSOC);  
            array_push($items,$productRow);
        } 
        // print_r($items);
    }
    $pdo=null;
    echo json_encode($items, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};

?>
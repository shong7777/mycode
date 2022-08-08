<?
try {
    require_once("./connect.php");
    $total=$_POST['total'];
    if($total>=2000&&$total<3000){
        $grade=1;
    }elseif($total>=3000&&$total<4000){
        $grade=2;
    }elseif ($total>=4000) {
        $grade=3;
    }else{$grade=0;};
    // $orderby =htmlspecialchars($_GET['orderby']);
        $sql = "SELECT concat('GWP',ID) ID,GRADE,IMG,INFO,NAME,PRICE,SIZE,STOCK,SPEC,DELIVERY_METHOD  from gift_with_purchase where ONSALE = 1 and GRADE=:grade and (STOCK is null or STOCK >0)";
        $products = $pdo->prepare($sql);
        $products->bindValue(":grade", $grade);
        $products->execute();
        $pdo=null;
    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $products ="{}";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        echo json_encode($productRow , JSON_UNESCAPED_UNICODE);

        
    };
   

    
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
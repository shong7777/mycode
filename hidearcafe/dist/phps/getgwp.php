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
        $sql = "SELECT concat('GWP',ID) ID,GRADE,IMG,INFO,NAME,ONSALE,PRICE,SIZE from gift_with_purchase where ONSALE = 1 and GRADE=:grade";
        $products = $pdo->prepare($sql);
        $products->bindValue(":grade", $grade);
        $products->execute();
    if ($products->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        $products ="{}";
    } else { //找得到
        $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        echo json_encode($productRow);

        
    };
   

    
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
};?>
<?session_start();
if(!isset($_SESSION['username'])){
    exit('未登入');
};
if($_GET['tablename']==='null'){
    exit();
}
try {
    require_once("./connect.php");
    $tablename=htmlspecialchars($_GET['tablename']);
    $sql="select * from $tablename;";
    if($tablename==='orders'){
        $sql="select * from $tablename where ORDER_STATE != -1 and ORDER_STATE != 3;";
        $sql="select * from orders left join diveaway_list on orders.orders_no = diveaway_list.ORDERS_NO where orders.ORDER_STATE != -1 and orders.ORDER_STATE != 3;";
    }elseif($tablename==='Allorders'){
    $sql="select * from orders left join diveaway_list on orders.orders_no = diveaway_list.ORDERS_NO;";
    }
    $products = $pdo->prepare($sql);
        $products->execute();
        $pdo=null;
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
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
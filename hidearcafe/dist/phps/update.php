<?session_start();
if(!isset($_SESSION['username'])){
    exit('未登入');
};
try {
    require_once("./connect.php");
    $tablename=$_POST['tablename'];
    if($tablename==='Allorders')$tablename='orders';
    if(isset($_POST['ID'])){
        $pk='ID';
        $id=$_POST['ID'];  
    }else if(isset($_POST['orders_no'])){
        $pk='orders_no';
        $id=$_POST['orders_no'];
    }
    $value=$_POST['value'];
    $column=$_POST['column'];
    $sql = "UPDATE $tablename SET $column = :value WHERE $pk = :id;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":value",  $value);
    $products->bindValue(":id",  $id);
    $products->execute();
    $pdo=null;
    echo '修改資料成功';
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
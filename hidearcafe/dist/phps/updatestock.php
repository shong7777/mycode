<?session_start();
if(!isset($_SESSION['username'])){
    exit('未登入');
};
try {
    require_once("./connect.php");

    $tablename=$_POST['tablename'];
    $id=$_POST['ID']; 
    $value=$_POST['value'];
    $pdo->beginTransaction();
    $sql = "select STOCK from $tablename  WHERE ID = :id for update;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":id",  $id);
    $products->execute();
    $stock=$products->fetch(PDO::FETCH_ASSOC)['STOCK'];
    if($value==='null'){
        $sql = "UPDATE $tablename SET STOCK = null WHERE ID = :id;";
        $products = $pdo->prepare($sql);
    }else if((int)$value===0){
        exit('修改失敗');
    }
    else{
        if($stock!=null) $sql = "UPDATE $tablename SET STOCK = STOCK +:value WHERE ID = :id;";
        else  $sql = "UPDATE $tablename SET STOCK = 0 +:value WHERE ID = :id;";
        $products = $pdo->prepare($sql);
        $products->bindValue(":value",  $value, PDO::PARAM_INT);
    }
    $products->bindValue(":id",  $id);
    $products->execute();
    $pdo->commit();
    $sql = "select STOCK from $tablename  WHERE ID = :id;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":id",  $id);
    $products->execute();
    $stock=$products->fetch(PDO::FETCH_ASSOC)['STOCK'];
    $pdo=null;
    if ($products->rowCount() == 0) { 
        echo "修改失敗";
    } else { 
        echo $stock;
    };
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
    $pdo->rollBack();
};
?>
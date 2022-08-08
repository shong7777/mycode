<?session_start();
try {
    require_once("./connect.php");
        $sql = "select * from user where username  = binary :username and  password = binary :password ;";
        $products = $pdo->prepare($sql);
        $products->bindValue(":username", $_POST['username']);
        $products->bindValue(":password", $_POST['password']);
        $products->execute();
        $pdo=null;
    if ($products->rowCount() == 0) { //找不到
        echo "<script>alert('登入錯誤,請重新登入。'); location.href='../login.html';</script>";
    } else { //找得到
        $productRow = $products->fetch(PDO::FETCH_ASSOC);
        $_SESSION['username']=$_POST['username'];
        echo "<script>alert('登入成功，跳轉管理頁面。'); window.parent.location.href='../backstage.html?tablename=orders';</script>";
    }
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
}

?>

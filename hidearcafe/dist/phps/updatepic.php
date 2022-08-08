<?session_start();
if(!isset($_SESSION['username'])){
    exit('未登入');
};
try {
    require_once("./connect.php");
    echo $_POST['id'];
    echo $_POST['oldimg'];
    $tablename=$_POST['tablename'];
    $id= $_POST['id'];
    echo '測試檔案';
    $path='../images/';
    $pathold=$path.$_POST['oldimg'];
    if(file_exists($pathold)){
        echo '檔案存在';
        unlink($pathold);
        echo '檔案刪除成功';
    }else{
        echo '檔案不存在';
        // exit();
    }

    $base_img =base64_decode(str_replace('data:image/jpeg;base64,', '', $_POST["img"]));
        
        
    $prefix='nx_';
    //改名
    $output_file = $prefix.uniqid().'.png';
    
    $path = $path.$output_file;

    if(file_put_contents($path, $base_img)){
        echo '新增圖片成功';

        $sql = "UPDATE $tablename SET `IMG` = :image WHERE `ID` = $id;";
        $products = $pdo->prepare($sql);
        $products -> bindValue(":image", "./images/$output_file");
        $products->execute();
        $pdo=null;
        echo '修改資料成功';

    }
    // $orderby =htmlspecialchars($_GET['orderby']);

    // if ($products->rowCount() == 0) { //找不到
    //     //傳回空的JSON字串
    //     $products ="{}";
    // } else { //找得到
    //     $productRow = $products->fetchAll(PDO::FETCH_ASSOC);
    //     //送出json字串
    //     echo json_encode($productRow, JSON_UNESCAPED_UNICODE);

        
    // };
   

    
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
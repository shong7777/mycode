<?
if(!isset($_SESSION)){session_start();}
//延長session回收時間
if(!isset($_SESSION['temporary_pass'])||(time()-$_SESSION['temporary_pass'])>120){
    $_SESSION['temporary_pass']=time();
}
try {
    require("./connect.php");
        $sql = "select * from chat_log where ID > :last_massage_id ;";
        $messages = $pdo->prepare($sql);
        $messages->bindValue(":last_massage_id", $_SESSION['last_massage_id']);
        $messages->execute();

    
    if ($messages->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        echo "[]";
    } else { //找得到
        $messageRow = $messages->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        echo json_encode($messageRow, JSON_UNESCAPED_UNICODE);
        $insert_id = $pdo->lastInsertId();
            $_SESSION['last_massage_id'] =$messageRow[count($messageRow)-1]['ID'];
    }
    $pdo=null;
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
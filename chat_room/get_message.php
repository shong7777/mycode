<?
session_start();
$_SESSION['login_time']=date('Y/m/d H:i:s');
echo $_SESSION['login_time'];
try {
    require_once("./connect.php");
        // $orderNo= htmlspecialchars($_POST['orderNo']);
        $time=  date('Y/m/d H:i:s');
        $sql = "select * from chat_log where date < :time;";
        $messages = $pdo->prepare($sql);
        $messages->bindValue(":time", $time);
        $messages->execute();
        $pdo=null;
    if ($messages->rowCount() == 0) { //找不到
        //傳回空的JSON字串
        echo "0";
    } else { //找得到
        $messageRow = $messages->fetchAll(PDO::FETCH_ASSOC);
        //送出json字串
        // echo $messageRow;
        // print_r($messageRow);
        echo json_encode($messageRow, JSON_UNESCAPED_UNICODE);

    }
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
<?
$insert_message=false;
if(!isset($_SESSION)){session_start();}
try {
    require_once("./connect.php");
        $message= htmlspecialchars($_POST['message']);
        //驗證是否超過50字
        // if( mb_strlen($message,"utf-8") > 50){
        //     exit("違規操作");
        // };
        $nickname=$_SESSION['nickname'];       
        $time=date('Y/m/d H:i:s');
        $sql = "INSERT INTO `chat_log` (`ID`, `sender`, `message`, `date`) VALUES (NULL, :nickname, :message , :time);";
        $messages = $pdo->prepare($sql);
        $messages->bindValue(":nickname", $nickname);
        $messages->bindValue(":message", $message);
        $messages->bindValue(":time", $time);
        $messages->execute();
        $insert_id = $pdo->lastInsertId();
        $_SESSION['last_massage_id'] =$insert_id-1;
        $pdo=null;
        $insert_message=true;
        if($insert_id){
            echo 'done';
        }
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
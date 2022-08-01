<?
session_start();
// $_POST['nickname']='兔兔';
$_SESSION['nickname']=$_POST['nickname'];
$nickname=$_SESSION['nickname'];        
$_POST['message']='系統訊息：'.$nickname.'加入了聊天室。';
$_SESSION['login_time']=date('Y/m/d H:i:s');
$time=date('Y/m/d H:i:s');

//啟用sent_message.php,但為了避免返回echo建立緩存區域並在回應時清空緩存
ob_start();
require_once("./sent_message.php");
ob_clean();
ob_end_flush();
if($insert_message){
    //避免重複顯示登入文字
    $_SESSION['last_massage_id'] =$insert_id+1;
    $j=array('message'=>$message,'date'=>$time);
    echo json_encode($j, JSON_UNESCAPED_UNICODE);
}
// require_once("./get_message.php");

?>
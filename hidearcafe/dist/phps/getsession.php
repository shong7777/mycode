<?session_start();
if(isset($_SESSION['username'])){
    echo $_SESSION['username'];
}else{
    echo '未登入';
};?>
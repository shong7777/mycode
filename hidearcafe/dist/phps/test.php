<?php 
require_once("./connect.php");
$pdo->beginTransaction();
    $id= '10001';
    $num='2';
    $sql = "select NAME, STOCK from product  WHERE ID = 10001 and STOCK is not null  for update;";
    $sql = "select NAME, STOCK from product  WHERE ID = :id and STOCK is not null and STOCK < :value for update;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":value", $num, PDO::PARAM_INT);
    $products->bindValue(":id",  $id);
    $products->execute();
    $productRow = $products->fetch(PDO::FETCH_ASSOC);
    if($products->rowCount() != 0){
        $name= $productRow['NAME'];
        ob_end_clean();
        $pdo=null;
        exit($name.'庫存已售完，請重新操作，造成不便敬請見諒。');
    }
    $sql = "UPDATE product SET STOCK= STOCK  - :value WHERE ID = :id;";
    $products = $pdo->prepare($sql);
    $products->bindValue(":value", $num, PDO::PARAM_INT);
    $products->bindValue(":id",  $id);
    $products->execute();


$pdo->commit();

// $MerchantTradeNo='241628171222';    
// $sql="select MAIL,PAYMENT  from orders WHERE TRADENO = $MerchantTradeNo";
// $products = $pdo->prepare($sql);
// $products->execute();
// $productRow = $products->fetch(PDO::FETCH_ASSOC);
// $to=$productRow['MAIL'];
// $payment=$productRow['PAYMENT'];
// $from = ' Hicafe <Hicafe>';
// if($to!=''){
//   switch ($payment){
//     case 0:
//       $payment='未付款';
//       break;
//     case 1:
//       $payment='已付款';
//       break;
//   }
//     $subject=mb_encode_mimeheader("感謝您的購買，訂單內容請詳閱。", 'UTF-8');
//     $headers = "From: $from\r\n" .
//            "MIME-Version: 1.0\r\n" .
//            "Content-type: text/html; charset=UTF-8\r\n";
//     $message = "
//     <!DOCTYPE html>
//     <html lang='UTF-8'>
//     <head>
//         <meta charset='UTF-8'>
//         <meta http-equiv='X-UA-Compatible' content='IE=edge'>
//         <meta name='viewport' content='width=device-width, initial-scale=1.0'>
//         <title>訂單內容</title>
//     </head>
    
//     <body>
//     <p>您在Hicafe所下訂的訂單</p>
//     <table>
//       <tr>
//         <td>訂單號碼</td><td>$MerchantTradeNo</td>
//       </tr>
//       <tr>
//         <td>付款狀態</td><td>$payment</td>
//       </tr>
//     </table>
//     <a href='https://personaltestdebug.mx500.com/orders.html?orders_no=$MerchantTradeNo'>點擊此連結可以觀看訂單詳情</a> 
//     <p>本信件為系統發信，如有需要請來電:<a href='tel:+886-3-4751386'>03-4751386</a>或mail到:<a href='mailto:hidear@personaltestdebug.mx500.com'>Hidear</a></p>
//     </body>
    
//     </html>
// ";
//     echo "開始寄信";
//     mail($to,$subject,$message,$headers);
//     echo "寄信結束";
// }else{exit('訂單有誤，請重新操作。')}
?>
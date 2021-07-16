<?php
$base_img =base64_decode(str_replace('data:image/jpeg;base64,', '', $_POST["img"]));

$path = "../images/";

$prefix='nx_';

$output_file = $prefix.uniqid().'.png';

$path = $path.$output_file;

file_put_contents($path, $base_img);
// $errMsg = "";
// try {
// 	require_once("./connect.php");

// 	//.......確定是否上傳成功
// 	if( $_FILES["upFile"]["error"] == UPLOAD_ERR_OK){
// 		//決定檔案名稱
// 		$imageNo = uniqid();
// 		$fileName = $imageNo".png";  //312543544.png
// 		//先檢查images資料夾存不存在
// 		if( file_exists("images") === false){
// 			mkdir("images");
// 		}
// 		//將檔案copy到要放的路徑
// 		$from = $_FILES["upFile"]["tmp_name"];
// 		$to = "../images/$fileName";


// 		if(copy( $from, $to)===true){
// 			$sql="INSERT INTO `product` (`ID`, `NAME`, `IMG`, `PRICE`, `TYPE`, `SIZE`, `INFO`, `ONSALE`, `CLASS`) 
// 								 VALUES (NULL, :pname, :image, :price, :type, :size, :info, '1', :class);";
// 			$products = $pdo->prepare( $sql );
// 			$products -> bindValue(":class", $_POST["class"]);
// 			$products -> bindValue(":pname", $_POST["pname"]);
// 			$products -> bindValue(":price", $_POST["price"]);
// 			$products -> bindValue("type", $_POST["type"]);
// 			$products -> bindValue("size", $_POST["size"]);
// 			$products -> bindValue("info", $_POST["info"]);
// 			$products -> bindValue(":image", "./images/$fileName");
// 			$products -> execute();			
// 			echo "1";
// 		}else{
// 			echo "0";
// 		}

// 	}else{
// 			// echo "錯誤代碼 : {$_FILES["upFile"]["error"]} <br>";
		
// 		switch($_FILES["upFile"]["error"]){
// 			case 1 : 
// 				echo "檔案大小超出 php.ini:upload_max_filesize 限制 <br>";
// 				break; 
// 			case 2 :
// 				 echo "檔案大小超出 MAX_FILE_SIZE 限制 <br>";
// 				 break; 
// 			case 3 :
// 				 echo "檔案僅被部分上傳 <br>";
// 				 break; 
// 			case 4 : 
// 				echo "檔案未被上傳 <br>";
// 				break; 
// 		};
// 		echo "新增失敗<br>";
// 	}
// } catch (PDOException $e) {
// 	$pdo->rollBack();
// 	$errMsg .= "錯誤原因 : ".$e -> getMessage(). "<br>";
// 	$errMsg .= "錯誤行號 : ".$e -> getLine(). "<br>";	
// 	echo $errMsg;
// }
?>
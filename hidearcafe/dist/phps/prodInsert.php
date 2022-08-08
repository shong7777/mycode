<?php session_start();
if(!isset($_SESSION['username'])){
    exit('未登入');
};
$errMsg = "";
try {
	require_once("./connect.php");
	$tablename=$_POST['tablename'];
	if($tablename==='coupon'){
		// echo $_POST['textautonum'];
		if($_POST['textauto']==='true'){
			$textlist=[];
			for($i=0;$i<$_POST['textautonum'];$i++){
				$strbase='1234567890qwertyuiopasdfghjklzxcvbnm';
				$str=uniqid().substr(str_shuffle($strbase),0,6);
				array_push($textlist,$str);
				$sql="INSERT INTO `coupon` (`ID`,  `DISCOUNT`,`DIVEAWAY_ID` ,`TEXT`,  `ONSALE`) 
				VALUES (NULL, :discount, :diveaway_no ,:text,  1);";
				$products = $pdo->prepare( $sql );
				$products -> bindValue(":discount", $_POST['discount'], PDO::PARAM_INT);
				$products -> bindValue(":diveaway_no", $_POST['diveaway_no']!='null'?$_POST['diveaway_no']:null);
				$products -> bindValue(":text", $str);
				$products -> execute();	
			}
			echo "新增成功";
			echo json_encode($textlist);
			exit();
		}
			$sql="INSERT INTO `coupon` (`ID`,  `DISCOUNT`,`DIVEAWAY_ID` ,`TEXT`,  `ONSALE`) 
			VALUES (NULL, :discount, :diveaway_no ,:text,  1);";
			$products = $pdo->prepare( $sql );
			$products -> bindValue(":discount", $_POST['discount'], PDO::PARAM_INT);
			$products -> bindValue(":diveaway_no", $_POST['diveaway_no']!='null'?$_POST['diveaway_no']:null);
			$products -> bindValue(":text", $_POST['text']);
			$products -> execute();	
			echo "新增成功";
			exit(); 
	}
	//確認是否接收到base64
	if($_POST["img"] != ''){
	//設定儲存資料夾路徑
        $path = "../images/";

        //確認是否有圖片資料夾，沒有的話新增
		if(!file_exists($path)){
			mkdir($path);
		}
        $base_img =base64_decode(str_replace('data:image/jpeg;base64,', '', $_POST["img"]));
        $prefix='nx_';
        //改名
        $output_file = $prefix.uniqid().'.png';
        $path = $path.$output_file;
		if(file_put_contents($path, $base_img)){
			switch($tablename){
				case 'product':
								$sql="INSERT INTO `product` (`ID`, `NAME`, `IMG`, `PRICE`, `TYPE`, `SIZE`, `INFO`, `ONSALE`, `CLASS`, `STOCK`, `SPEC`, `DELIVERY_METHOD`) 
										VALUES (NULL, :pname, :image, :price, :type,:size, :info, '1', :class , :stock, :spec, :delivery);";
					$products = $pdo->prepare($sql);
					$products -> bindValue(":class", $_POST["class"]);
					$products -> bindValue(":pname", $_POST["pname"]);
					$products -> bindValue(":price", $_POST["price"]);
					$products -> bindValue("type", $_POST["type"]);
					$products -> bindValue("size", $_POST["size"]);
					$products -> bindValue("info", $_POST["info"]);
					$stock=$_POST["stock"];
					$products -> bindValue("stock",$stock!='' ? $stock : null, PDO::PARAM_STR);
					$products -> bindValue("spec", $_POST["spec"]);
					$products -> bindValue("delivery", $_POST["delivery"]);
					$products -> bindValue(":image", "./images/$output_file");
					$products -> execute();	
					echo "新增成功";
					break;  
				case 'addprice':
					$sql="INSERT INTO `addprice` (`ID`, `NAME`, `IMG`, `PRICE`, `GRADE`, `SIZE`, `INFO`, `ONSALE`, `STOCK`, `SPEC`, `DELIVERY_METHOD`) 
										VALUES   (NULL, :pname, :image, :price,  :grade, :size, :info, '1' , :stock, :spec, :delivery)";
					$products = $pdo->prepare( $sql );
					$products -> bindValue(":pname", $_POST["pname"]);
					$products -> bindValue(":price", $_POST["price"]);
					$products -> bindValue(":grade", $_POST["grade"]);
					$products -> bindValue(":size", $_POST["size"]);
					$products -> bindValue(":info", $_POST["info"]);
					$stock=$_POST["stock"];
					$products -> bindValue("stock",$stock!='' ? $stock : null, PDO::PARAM_STR);
					$products -> bindValue("spec", $_POST["spec"]);
					$products -> bindValue("delivery", $_POST["delivery"]);
					$products -> bindValue(":image", "./images/$output_file");
					$products -> execute();	
					echo "新增成功";
					break;  
				case 'gift_with_purchase':
					$sql="INSERT INTO `gift_with_purchase` (`ID`, `NAME`, `IMG`, `PRICE`, `GRADE`, `SIZE`, `INFO`, `ONSALE`, `STOCK`, `SPEC`, `DELIVERY_METHOD`) 
										VALUES   (NULL, :pname, :image, :price,  :grade, :size, :info, '1' , :stock, :spec, :delivery)";
					$products = $pdo->prepare( $sql );
					$products -> bindValue(":pname", $_POST["pname"]);
					$products -> bindValue(":price", $_POST["price"]);
					$products -> bindValue(":grade", $_POST["grade"]);
					$products -> bindValue(":size", $_POST["size"]);
					$products -> bindValue(":info", $_POST["info"]);
					$stock=$_POST["stock"];
					$products -> bindValue("stock",$stock!='' ? $stock : null, PDO::PARAM_STR);
					$products -> bindValue("spec", $_POST["spec"]);
					$products -> bindValue("delivery", $_POST["delivery"]);
					$products -> bindValue(":image", "./images/$output_file");
					$products -> execute();	
					echo "新增成功";
					break;  
				case 'diveaway':
					$sql="INSERT INTO `diveaway` (`ID`, `NAME`, `IMG`, `PRICE`, `SIZE`, `INFO`, `ONSALE`, `STOCK`, `SPEC`, `DELIVERY_METHOD`) 
										VALUES   (NULL, :pname, :image, :price,   :size, :info, '1' , :stock, :spec, :delivery)";
					$products = $pdo->prepare( $sql );
					$products -> bindValue(":pname", $_POST["pname"]);
					$products -> bindValue(":price", $_POST["price"]);
					$products -> bindValue(":size", $_POST["size"]);
					$products -> bindValue(":info", $_POST["info"]);
					$stock=$_POST["stock"];
					$products -> bindValue("stock",$stock!='' ? $stock : null, PDO::PARAM_STR);
					$products -> bindValue("spec", $_POST["spec"]);
					$products -> bindValue("delivery", $_POST["delivery"]);
					$products -> bindValue(":image", "./images/$output_file");
					$products -> execute();	
					echo "新增成功";
					break;  
				case 'adv':
					$sql="INSERT INTO `adv` (`ID`,  `IMG`,  `ONSALE`,`PRODUCT_ID`) 
									 VALUES (NULL, :image,  '1', :PRODUCT_ID);";
					$products = $pdo->prepare( $sql );
					$products -> bindValue(":image", "./images/$output_file");
					$products -> bindValue(":PRODUCT_ID", $_POST['product_no']);
					$products -> execute();	
					$pdo=null;
					echo "新增成功";
					break; 
			}
				
		}else{
			echo "新增圖片失敗";
		}
	}else{
		echo "圖片傳送錯誤，請重新嘗試或聯絡系統工程師。<br>";
	}
    
} catch (PDOException $e) {
    echo "錯誤行號 : " . $e->getLine() . "<br>"; 
    echo "錯誤原因 : " . $e->getMessage() . "<br>";
    $error=$e->getMessage();
    $str='from:'.basename(__FILE__).' error:'.$error.date("Y/m/d H:i:s", time())."\r\n";
    error_log($str,3,'errors.log');
};
?>
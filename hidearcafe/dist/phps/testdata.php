<?
    try {
    require_once("./connect.php");
    // $orderby =htmlspecialchars($_GET['orderby']);
        // $sql = "select * from adv a join product p on a.PRODUCT_ID = p.ID where a.ONSALE = 1 ;";
        for($i=65;$i<=74;$i++){
            $type="哥倫比亞";
            $img='cafe3';
            $class='咖啡';
            $price=450;
            $sql="INSERT INTO `product` (`ID`, `NAME`, `IMG`, `PRICE`, `TYPE`, `SIZE`, `INFO`, `ONSALE`, `CLASS`) 
                  VALUES (100$i, '商品名稱商品名稱商品名稱商品名稱商品名稱 $type $i', './images/$img.png', '$price', '$type', '1', '商品介紹 內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容', '1', '$class')";
            $products = $pdo->prepare($sql);
            $products->execute();
        }
                echo '執行完成。';
        } catch (PDOException $e) {
            echo "錯誤行號 : " . $e->getLine() . "<br>"; 
            echo "錯誤原因 : " . $e->getMessage() . "<br>";
        };
?>
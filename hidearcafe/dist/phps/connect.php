<?php
	$dsn = "mysql:host=localhost;port=3306;dbname=hidearcafe;charset=utf8";
	$user = "root";
	$password = "root";
// $options=array(3=>2,8=>0);
$options=array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING,PDO::ATTR_CASE => PDO::CASE_NATURAL);
$pdo=new PDO($dsn,$user,$password,$options);
?>
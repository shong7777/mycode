<?php
	// $dsn = "mysql:host=localhost;port=3306;dbname=personal_testdata;charset=utf8";
	// $user = "root";
	// $password = "root";
	//線上用
	$dsn = "mysql:host=localhost;port=3306;dbname=personal_testdata;charset=utf8";
	$user = "personal_user";
	$password = "Zr_}_QF5N%Gx";
// $options=array(3=>2,8=>0);
$options=array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING,PDO::ATTR_CASE => PDO::CASE_NATURAL);
$pdo=new PDO($dsn,$user,$password,$options);
?>
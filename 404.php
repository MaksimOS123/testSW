<?php 
    //Запускаем сессию
    session_start();
?>

<html>
    <head>
		<link rel="stylesheet" type="text/css" href="/css/error502.css">
		<link rel="stylesheet" type="text/css" href="/css/style.css">
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>404. Страница не найдена.</title>
		<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
	</head>
    <body>
		<div id="header">
			<div id="header-zglv">
				<h1><a href="/" class="home">МИР УСТРОЙСТВ</a></h1>
			</div>
			<div id="header-log">
	<?php 
        //Проверяем авторизован ли пользователь
        if(!isset($_SESSION['email']) && !isset($_SESSION['password'])){
            // если нет, то выводим блок с ссылками на страницу регистрации и авторизации
    ?>
		<h3><a href="/form_auth.php">Войти</a></h3>
    <?php
        }else{
            //Если пользователь авторизован, то выводим ссылку Выход
    ?>  
		<h3><a href="/logout.php">Выйти</a></h3>
    <?php
		}
    ?>
			</div>
		</div>
			<table>
				<td>
					<th>
						<blockquote><blockquote></blockquote></blockquote>
					</th>
					<th>
						<h2><b>Страница не найдена</b></h2>
						<p>
						<blockquote><h5>Неправильно набран адрес, или такой страницы больше не существует, а возможно, никогда
						<br>
						и не существовало.</h5></blockquote>
						<blockquote><h5><b>Проверьте адрес</b> или <a href="/">перейдите на главную страницу</a>.</h5></blockquote>
					</th>
					<th>
						<img src="/image/error404.jpg" align=top>
					</th>
				</td>
			</table>
</html>
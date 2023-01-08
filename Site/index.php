<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>K-POP DANCE</title>

	<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.6.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/styles.css">

</head>

<body>

	<header>
		<img url="assets/img/Screenshot_1.jpg">
		<a style="background-image: url(assets/img/Screenshot_1.jpg);"></a>
		<nav>
			<li><a href="#main">Главная</a></li>
			<!--<li><a href="#">Товар</a></li>-->
			<li><a href="#about-us">О нас</a></li>
			<li><a href="#contacts">Контакты</a></li>
		</nav>
	</header>


	<section class="hero">
		<div class="background-image" style="background-image: url(assets/img/glav.jpg);"></div>
		<h1>Танцевальный марафон K-POP<h1>
		<h3>Это не потому, что у нас есть сверхспособности или мы супер талантливы, супер красивы, а потому, что у нас есть страстное увлечение, энтузиазм и мы верим в себя.</h3>
		<a href="#contacts" class="btn">Записаться на марафон</a>
	</section>


	<section id="main" class="our-work">
		<h3 class="title">BTS,BLACKPINK,NCT,K.A.R.D,EXO И МНОГО ДРУГИХ ГРУПП</h3>
		<p>Попробуй себя в качестве звезды и станцуй вместе с любимым айдолом</p>
		<hr>

		<ul class="grid">
			<li class="small" style="background-image: url(assets/img/4.jpg);"></li>
			<li class="large" style="background-image: url(assets/img/1.jpg);"></li>
			<li class="large" style="background-image: url(assets/img/2.jpg);"></li>
			<li class="small" style="background-image: url(assets/img/3.jpg);"></li>
		</div>
	</section>
	

	<section id="about-us" class="features">
		<h3 class="title">Почему k-pop?</h3>
		<p>Южная Корея- это моя мечта,которая в дальнейшем станет моей реальностью</p>
		<hr>

		<ul class="grid">
			<li>
				<i class="fa fa-check-square-o"></i>
				<h4>Смешанные стили</h4>
				<p>Корейская поп-культура цепляет смешением стилей, яркими образами и запоминающимися мелодиями. K-pop ‒ это объединение хип-хопа, рэпа, танцевальной музыки и электропопа.</p>
			</li>
			<li>
				<i class="fa fa-check-square-o"></i>
				<h4>Танцы с айдолом</h4>
				<p>Покажи себя на марофоне и станцуй со своим любимым айдолом</p>
			</li>
			<li>
				<i class="fa fa-check-square-o"></i>
				<h4>Сеул</h4>
				<p>Удивительный город, который сочетает в себе традиционную архитектуру и современные здания. </p>
			</li>
		</div>
	</section>


	<section id="contacts" class="contact">
		<h3 class="title">НЕ УПУСТИ ВОЗМОЖНОСТЬ</h3>	
		<p>Прими участие в марафоне и окунись в мир корейской культуры, научусь танцевать, путешевствуй по корее и станцуй со своим айдолом</p>
		<hr>

		<form method="POST">
			<input name="email" type="text" placeholder="Email" required><br/>
			<input name="name" type="text" placeholder="Имя" required>
			<input type="submit" class="btn" value="Записаться">
			<?php
				//if (isset($_POST['name']) && isset($_POST['Email'])){
					if (!empty($_POST["name"])) {

						//Устанавливаем доступы к базе данных:
			$db_server = 'localhost'; //имя хоста, на локальном компьютере это localhost
			$db_user = 'root'; //имя пользователя, по умолчанию это root
			$db_password = ''; //пароль, по умолчанию пустой
			$db_name = 'k_pop'; //имя базы данных
		
			try {				
					//Соединяемся с базой данных используя наши доступы:
					//$mysqli  =  new mysqli($host, $user, $password, $db_name);
					$db = new PDO("mysql:host=$db_server;dbname=$db_name", $db_user, $db_password,array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET NAMES utf8"));

					$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

					$name = $_POST['name'];
					$email = $_POST['email'];

					//$mysqli->set_charset('utf8');
					$sql = "INSERT INTO `contacts`(`Name`, `Email`) VALUES ('".$name."','".$email."')";
					$result = $db->query($sql);
					/*
					Соединение записывается в переменную $link,
					которая используется дальше для работы mysqi_query.
					*/
				echo "Вы записаны!";
			}
			catch(PDOException $e) {
    			echo "Ошибка при создании записи в базе данных: " . $e->getMessage();
			}
				$db = null;
		}
			?>
		</form>
	</section>

	<footer>
		<ul>
			<li><a href="#"><i class="fa fa-twitter-square"></i></a></li>
			<li><a href="#"><i class="fa fa-facebook-square"></i></a></li>
			<li><a href="#"><i class="fa fa-snapchat-square"></i></a></li>
			<li><a href="#"><i class="fa fa-pinterest-square"></i></a></li>
			<li><a href="#"><i class="fa fa-github-square"></i></a></li>
		</ul>
	</footer>

</body>

</html>

// Ссылка на элемент веб страницы в котором будет отображаться графика
var container;
// Переменные "камера", "сцена" и "отрисовщик"
var camera, scene, renderer;
// Глобальная переменная для хранения карты высот
var imagedata;
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

var planets = [];
var N = 255;

var trigger = 0;
var clouds = 0;
var angle_hor = 0;
var angle_vert = 0;

var cam_x = 0;
var cam_y = 200;
var cam_z = -800;

// Функция инициализации камеры, отрисовщика, объектов сцены и т.д.
init();
// Обновление данных по таймеру браузера
animate();

// В этой функции можно добавлять объекты и выполнять их первичную настройку
function init()
{
	// Получение ссылки на элемент html страницы
	container = document.getElementById( 'container' );
	// Создание "сцены"
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
	45, window.innerWidth / window.innerHeight, 1, 4000 );
	// Создание отрисовщика
	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	// Закрашивание экрана синим цветом, заданным в 16ричной системе
	renderer.setClearColor( 0xffffff, 1);
	container.appendChild( renderer.domElement );
	// Добавление функции обработки события изменения размеров окна
	window.addEventListener( 'resize', onWindowResize, false );

// -----------------------------------------------------------------------------


	addShpere(1000, 0, 0, 'pic/starmap.jpg'); 							

    planets.push(addShpere(80, 0, 0, 'pic/11.jpg'));	
		
	planets.push(addShpere(8, 100+58, 47, 'pic/mercury/mercurymap.jpg'));	
	planets.push(addShpere(18, 100+108, 35, 'pic/venus/venusmap.jpg'));	
	planets.push(addShpere(23, 100+150, 29, 'pic/earth/earthmap1k.jpg'));	
	planets.push(addShpere(13, 100+235, 24, 'pic/mars/marsmap1k.jpg'));		
	planets.push(addShpere(5, 100+160+14, 12, 'pic/earth/moon/moonmap1k.jpg'));

	clouds = createEarthCloud(10.2);
	scene.add( clouds );

	addLight();
}
//---------------------------------------------------------------------------------
function addLight(){
	//создание точечного источника освещения заданного цвета
	var spotlight = new THREE.PointLight(0xffffff, 5, 1400, 2);

	//установка позиции источника освещения
	spotlight.position.set(0,0,0);
	//добавление источника в сцену
	scene.add(spotlight);

	const color = 0xFFFFFF;
	const intensity = 0.5;
	const light = new THREE.AmbientLight(color, intensity);
	scene.add(light);
}

function onWindowResize()
{
	// Изменение соотношения сторон для виртуальной камеры
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	// Изменение соотношения сторон рендера
	renderer.setSize( window.innerWidth, window.innerHeight );
}
// В этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate()
{
	// Добавление функции на вызов, при перерисовки браузером страницы
	requestAnimationFrame( animate );
	render();

	var delta = clock.getDelta();
	for (var i = 0; i < planets.length; i++) //перебор
	{
		planets[i].a += planets[i].as * delta;

		var x = 0 + planets[i].pos * Math.cos(planets[i].a*Math.PI/180);
		var z = 0 + planets[i].pos * Math.sin(planets[i].a*Math.PI/180);

		if(i == planets.length-1){
			var x = planets[3].planet.position.x + 35 * Math.cos(planets[i].a*Math.PI/180);
			var z = planets[3].planet.position.z + 35 * Math.sin(planets[i].a*Math.PI/180);
		}
		planets[i].planet.position.set(x, 0, z);
		planets[i].planet.rotation.y += 0.01;
	}

	clouds.position.set(planets[3].planet.position.x, 0, planets[3].planet.position.z);



	if (keyboard.pressed("0")){ trigger = 0; }
	if (keyboard.pressed("1")){ trigger = 1; }
	if (keyboard.pressed("2")){	trigger = 2; }
	if (keyboard.pressed("3")){	trigger = 3; }
	if (keyboard.pressed("4")){	trigger = 4; }

	if (keyboard.pressed("up")){ angle_vert += 1; }
	if (keyboard.pressed("down")){ angle_vert -= 1; }
	if (keyboard.pressed("left")){ angle_hor -= 1; }
	if (keyboard.pressed("right")){ angle_hor += 1;	}

	// задаем цель для камеры
	var target_x = planets[trigger].planet.position.x;
	var target_y = planets[trigger].planet.position.y;
	var target_z = planets[trigger].planet.position.z;

	//  задаем положение камеры
	cam_x = target_x+angle_hor;
	cam_y = 30+angle_vert;
	cam_z = target_z+80+angle_hor;

	if(trigger == 0){
		cam_x = 0;
		cam_y = 500;
		cam_z = -600;
	}

	// положение камеры
	camera.position.set(cam_x, cam_y, cam_z);
	// цель для камеры
	camera.lookAt(new THREE.Vector3(target_x, 0, target_z));
}

function render()
{
	// Рисование кадра
	renderer.render( scene, camera );
}

function addShpere(r, x, a1, tex_path){
	//создание геометрии сферы
	var geometry = new THREE.SphereGeometry( r, 32, 32 );
	//загрузка текстуры
	var loader = new THREE.TextureLoader();
	var tex = loader.load( tex_path );
	tex.minFilter = THREE.NearestFilter;

	//создание материала
	var material = new THREE.MeshLambertMaterial({
	map: tex,
	side: THREE.DoubleSide
	});

	//создание объекта
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(x, 0, 0);
	scene.add( sphere );

	addT(x);

	var planet = {}; //создание
	planet.planet = sphere; //добавление поля planet
	planet.pos = x; //добавление поля pos
	planet.a = 0.0;
	planet.as = a1;

	return planet
}

function addT(r){
	var lineGeometry = new THREE.Geometry();
	var vertArray = lineGeometry.vertices;

	for (var i=0; i < 360; i++) {
		var x = 0 + r * Math.cos(i*Math.PI/180);
		var z = 0 + r * Math.sin(i*Math.PI/180);

		//начало сегмента линии
		vertArray.push(new THREE.Vector3(x, 0, z));
	}

	var lineMaterial = new THREE.LineDashedMaterial( {
		color: 0xcccc00, dashSize: 1,
		gapSize: 1 } ); //параметры: цвет, размер черты, размер промежутка
	var line = new THREE.Line( lineGeometry, lineMaterial );
	line.computeLineDistances();
	scene.add(line);
}

function createEarthCloud(r)
{
	// создать холст назначения
	var canvasResult = document.createElement('canvas');
	canvasResult.width = 1024;
	canvasResult.height = 512;
	var contextResult = canvasResult.getContext('2d');
	// загрузить карту земли
	var imageMap = new Image();
	imageMap.addEventListener("load", function()
	{

	// create dataMap ImageData for earthcloudmap
	var canvasMap = document.createElement('canvas');
	canvasMap.width = imageMap.width;
	canvasMap.height = imageMap.height;
	var contextMap = canvasMap.getContext('2d');
	contextMap.drawImage(imageMap, 0, 0);
	var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);
	// load earthcloudmaptrans
	var imageTrans = new Image();
	imageTrans.addEventListener("load", function()
	{
	// create dataTrans ImageData for earthcloudmaptrans
	var canvasTrans = document.createElement('canvas');
	canvasTrans.width = imageTrans.width;
	canvasTrans.height = imageTrans.height;
	var contextTrans = canvasTrans.getContext('2d');
	contextTrans.drawImage(imageTrans, 0, 0);
	var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width,
	canvasTrans.height);
	// merge dataMap + dataTrans into dataResult
	var dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
	for(var y = 0, offset = 0; y < imageMap.height; y++)
	for(var x = 0; x < imageMap.width; x++, offset += 4)
	{
	dataResult.data[offset+0] = dataMap.data[offset+0];
	dataResult.data[offset+1] = dataMap.data[offset+1];
	dataResult.data[offset+2] = dataMap.data[offset+2];
	dataResult.data[offset+3] = 255-dataTrans.data[offset+0];
	}
	// update texture with result
	contextResult.putImageData(dataResult,0,0)
	material.map.needsUpdate = true;
	});

	imageTrans.src = 'pic/earth/earthcloudmaptrans.jpg';
	}, false);

	imageMap.src = 'pic/earth/earthcloudmap.jpg';

	var geometry = new THREE.SphereGeometry(r, 32, 32);
	var material = new THREE.MeshPhongMaterial({
	map: new THREE.Texture(canvasResult),
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 0.8,
	});

	var mesh = new THREE.Mesh(geometry, material);
	return mesh;
}

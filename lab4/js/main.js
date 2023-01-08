// Ссылка на элемент веб страницы в котором будет отображаться графика
var container;
//var keyboard = new THREEx.KeyboardState();

// Переменные "камера", "сцена" и "отрисовщик"
var camera, scene, renderer;


var N = 100;

var clock = new THREE.Clock();


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
 // Установка параметров камеры
 // 45 - угол обзора
 // window.innerWidth / window.innerHeight - соотношение сторон
 // 1 - 4000 - ближняя и дальняя плоскости отсечения
 camera = new THREE.PerspectiveCamera(
 45, window.innerWidth / window.innerHeight, 1, 4000 );
 // Установка позиции камеры
 camera.position.set(N/2, N, N*2);
//   camera.position.set(N/2, N*2, N/2);


 // Установка точки, на которую камера будет смотреть
 camera.lookAt(new THREE.Vector3( N/2, 0, N/2));
 // Создание отрисовщика
 renderer = new THREE.WebGLRenderer( { antialias: false } );
 renderer.setSize( window.innerWidth, window.innerHeight );
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = THREE.PCFShadowMap;
 // Закрашивание экрана синим цветом, заданным в 16ричной системе
 renderer.setClearColor( 0x000000ff, 1);
 container.appendChild( renderer.domElement );
 // Добавление функции обработки события изменения размеров окна
 window.addEventListener( 'resize', onWindowResize, false );

//====================================================================>
 // создание направленного источника освещения
 var light = new THREE.DirectionalLight(0xffffff);
 // позиция источника освещения
 light.position.set( N, N, N);
 // направление освещения
 light.target = new THREE.Object3D();
 light.target.position.set( 0, 0, N/2 );
 scene.add(light.target);
 // включение расчёта теней
 light.castShadow = true;
 // параметры области расчёта теней
 light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 100, 2500 ) );
 light.shadow.bias = 0.0001;
 // размер карты теней
 light.shadow.mapSize.width = 2048;
 light.shadow.mapSize.height = 2048;
 scene.add( light );
 var helper = new THREE.CameraHelper(light.shadow.camera);
 //scene.add( helper );
//======================================================================>
 

 // вызов функции загрузки модели (в функции Init)
 //loadModel('model/', "Palma 001.obj", "Palma 001.mtl");

//=======================================================================>
 
//==================================================================>

 //terrainGen();

}

function onWindowResize()
{
 // Изменение соотношения сторон для виртуальной камеры
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();
 // Изменение соотношения сторон рендера
 renderer.setSize( window.innerWidth, window.innerHeight );
}

var T = 10.0;
var t = 0.0;

// В этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate()
{
 // Добавление функции на вызов, при перерисовки браузером страницы
 var delta = clock.getDelta();
 
 requestAnimationFrame( animate );
 render();
}

 

function render()
{
 // Рисование кадра
 renderer.render( scene, camera );
}

function addTriangle()
{
    // Создание структуры для хранения вершин
    geometry = new THREE.Geometry();

    for(var i = 0; i < N; i++)
    for(var j = 0; j < N; j++)
    {
        var y = getPixel(imagedata, i, j) / 10;
        // Добавление координат вершин в массив вершин
        geometry.vertices.push(new THREE.Vector3( i, y, j));
    
    }
    // Добавление координат вершин в массив вершин
    // geometry.vertices.push(new THREE.Vector3( 1.0, 0.0, 3.0));
    


    for(var i = 0; i < N-1; i++)
    for(var j = 0; j < N-1; j++)
    {
        //Добавление индексов (порядок соединения вершин) в массив индексов
        geometry.faces.push(new THREE.Face3(i + j *N, (i+1) + j *N, (i+1) + (j+1) *N));
        geometry.faces.push(new THREE.Face3(i + j *N, (i+1) + (j+1) *N, i + (j+1) *N));

        geometry.faceVertexUvs[0].push([new THREE.Vector2(i/N, j/N),
            new THREE.Vector2(i/N, (j+1)/N),
            new THREE.Vector2((i+1)/N, (j+1)/N)]);

        geometry.faceVertexUvs[0].push([new THREE.Vector2(i/N, j/N),
            new THREE.Vector2((i+1)/N, (j+1)/N),
            new THREE.Vector2((i+1)/N, j/N)]);
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    // Создание загрузчика текстур
    var loader = new THREE.TextureLoader();
    // Загрузка текстуры grasstile.jpg из папки pics
    var tex = loader.load( 'pic/grasstile.jpg' );

    // Режим повторения текстуры
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    // Повторить текстуру 10х10 раз
    tex.repeat.set( 4, 4 );

    
    var triangleMaterial = new THREE.MeshLambertMaterial({
         // Источник цвета - текстура
        map: tex,
        wireframe: false,
        side: THREE.DoubleSide

       });
      
       

    
       
    // Создание объекта и установка его в определённую позицию
    var triangleMesh = new THREE.Mesh(geometry, triangleMaterial);
    triangleMesh.position.set(0.0, 0.0, 0.0);
    triangleMesh.receiveShadow = true;
    // Добавление объекта в сцену
    scene.add(triangleMesh);

}

function loadModel(path, oname, mname)
{
    // функция, выполняемая в процессе загрузки модели (выводит процент загрузки)
    var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
    };
    // функция, выполняющая обработку ошибок, возникших в процессе загрузки
    var onError = function ( xhr ) { };
    // функция, выполняющая обработку ошибок, возникших в процессе загрузки
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( path );
    // функция загрузки материала
    mtlLoader.load( mname, function( materials )
    {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( path );

        // функция загрузки модели
        objLoader.load( oname, function ( object )
    {
        object.traverse( function ( child )
        {
            if ( child instanceof THREE.Mesh )
            {
                child.castShadow = true;
            }
        } );

        for (var i = 0; i < 20; i++)
        {
            object.position.x = Math.random()*N;
            object.position.z = Math.random()*N;
            object.position.y = getPixel(imagedata, Math.floor(object.position.x),  Math.floor(object.position.z)) / 10.00;
            
            var s = ((Math.random()*20)/100)+0.1;

            object.scale.set(s, s, s);

            scene.add(object.clone());
        }
        
        
    }, onProgress, onError );
    });
}
  
// Ссылка на элемент веб страницы в котором будет отображаться графика
var container;
// Переменные "камера", "сцена" и "отрисовщик"
var camera, scene, renderer;


var sphere;

var a = 0;

var N = 255;

var light;

var cursor3D;

var circle;

var radius = 10;

var geometry;

var brVis = false;

var models = new Map();

var selected = null;

var objectsList = []; 

var clock = new THREE.Clock();

var mouse = { x: 0, y: 0 }; //переменная для хранения координат мыши
//массив для объектов, проверяемых на пересечение с курсором
var targetList = []; 

//объект интерфейса и его ширина
var gui = new dat.GUI();
gui.width = 200;

var brushDirection = 0;

var lmb = false;





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
 camera.position.set(N/2, N/2, N*1.5);

 // Установка точки, на которую камера будет смотреть
 camera.lookAt(new THREE.Vector3( N/2, 0, N/2));
 // Создание отрисовщика
 renderer = new THREE.WebGLRenderer( { antialias: false } );
 renderer.setSize( window.innerWidth, window.innerHeight );
 // Закрашивание экрана синим цветом, заданным в 16ричной системе
 renderer.setClearColor( 0x000000ff, 1);
 container.appendChild( renderer.domElement );
 // Добавление функции обработки события изменения размеров окна
 window.addEventListener( 'resize', onWindowResize, false );

 renderer.domElement.addEventListener('mousedown',onDocumentMouseDown,false);
 renderer.domElement.addEventListener('mouseup',onDocumentMouseUp,false);
 renderer.domElement.addEventListener('mousemove',onDocumentMouseMove,false);
 renderer.domElement.addEventListener('wheel',onDocumentMouseScroll,false);


 //создание точечного источника освещения заданного цвета
 light = new THREE.DirectionalLight(0xffffff);
 //установка позиции источника освещения
 light.position.set(N, N, N/2);
 //добавление источника в сцену
 scene.add(light);

//  var geometry = new THREE.SphereGeometry( 5, 32, 32 );
//  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
//  sphere = new THREE.Mesh( geometry, material );
//  scene.add( sphere );


    // Пользовательские функции а
    addTriangle();
    add3DCursor();
    addCircle();
    GUI();
    loadModel('models/', 'Palma 001.obj', 'Palma 001.mtl', 0.2, 'palma');
    loadModel('models/bush/', 'Bush1.obj', 'Bush1.mtl', 2, 'bush');
    loadModel('models/grade/', 'grade.obj', 'grade.mtl', 2, 'grade');
    loadModel('models/home/', 'Cyprys_House.obj', 'Cyprys_House.mtl', 3, 'home');

    

}


function onWindowResize()
{
 // Изменение соотношения сторон 
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();
 // Изменение соотношения сторон рендера
 renderer.setSize( window.innerWidth, window.innerHeight );
}

// В этой функции можно изменять параметры объектов и обрабатывать действия пользователя
function animate()
{
 var delta = clock.getDelta();
 if (brushDirection != 0)
 {
    sphereBrush(brushDirection, delta);
 }
 // Добавление функции на вызов, при перерисовки браузером страницы
 requestAnimationFrame( animate );
 render();

//  a += 0.01;

//  var x = N/2 + N * Math.cos(a);
//  var y = 0 + N * Math.sin(a);

//  spotlight.position.set(x, y, N/2);
//  sphere.position.set(x, y, N/2);

 
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
        
        // Добавление координат вершин в массив вершин
        geometry.vertices.push(new THREE.Vector3( i, 0.0, j));
    
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

        renderer.domElement.addEventListener("contextmenu",
                            function (event)
                                {
                                event.preventDefault();
                                });
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
    targetList.push(triangleMesh);
    // Добавление объекта в сцену
    scene.add(triangleMesh);

}


function add3DCursor()
{
    //параметры цилиндра: диаметр вершины, диаметр основания, высота, число сегментов
    var geometry = new THREE.CylinderGeometry( 3, 0, 10, 80 );
    var cyMaterial = new THREE.MeshLambertMaterial( {color: 0x888888} );
    cursor3D = new THREE.Mesh( geometry, cyMaterial );
    cursor3D.visible = false;
    scene.add(cursor3D);
}

function addCircle()
{
    var material = new THREE.LineBasicMaterial( { color: 0xffff00 } );
    
    var segments = 64;
    var circleGeometry = new THREE.CircleGeometry( 1, segments );
    //удаление центральной вершины
    circleGeometry.vertices.shift();

    for (var i = 0; i < circleGeometry.vertices.length; i++)
    {
        circleGeometry.vertices[i].z = circleGeometry.vertices[i].y;
        circleGeometry.vertices[i].y = 0;

    }

    circle = new THREE.Line( circleGeometry, material );

    circle.scale.set(radius, 1, radius);

    
    circle.visible = false;

    scene.add( circle );
}

function onDocumentMouseScroll( event )
{
    if (brVis == true)
    {
        if (radius > 1)
            if (event.wheelDelta < 0)
                radius--;
        if (radius < 50)
            if (event.wheelDelta > 0)
                radius++;

        circle.scale.set(radius, 1, radius);
    }
    
    
}
function onDocumentMouseMove( event )
{
    //определение позиции мыши
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

    //создание луча, исходящего из позиции камеры и проходящего сквозь позицию курсора мыши
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    vector.unproject(camera);

    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

   

    
    // создание массива для хранения объектов, с которыми пересечётся луч
    var intersects = ray.intersectObjects( targetList );

    if (brVis == true) 
    {

        // если луч пересёк какой-либо объект из списка targetList
        if ( intersects.length > 0 )
        {
            //печать списка полей объекта

            console.log(intersects[0]);
            if (cursor3D != null)
            {
                cursor3D.position.copy(intersects[0].point);
                cursor3D.position.y += 2.5;

                
            }
            if (circle != null)
            {
                circle.position.copy(intersects[0].point);
                circle.position.y += 0;

                for (var i = 0; i < circle.geometry.vertices.length; i++)
                {
                    //получение позиции в локальной системе координат
                    var pos = new THREE.Vector3();
                    pos.copy(circle.geometry.vertices[i]);
                    //нахождение позиции в глобальной системе координат
                    pos.applyMatrix4(circle.matrixWorld);

                    var x = Math.round(pos.x);
                    var z = Math.round(pos.z);

                    if (x >= 0 && x < N && z >= 0 && z < N)
                    {
                        var y = geometry.vertices[z + x * N].y;
                        circle.geometry.vertices[i].y = y + 0.01;
                    }  else 
                    {
                        circle.geometry.vertices[i].y = 0;
                    }
                    

                }


                circle.geometry.verticesNeedUpdate = true; //обновление вершин
                    }
                        
                }
    } else 
    {
        if ( intersects.length > 0)
        {
            if (selected != null && lmb == true)
            {
                selected.position.copy(intersects[0].point);

                selected.userData.box.setFromObject(selected);

                //получение позиции центра объекта
                var pos = new THREE.Vector3();
                selected.userData.box.getCenter(pos);
                selected.userData.obb.position.copy(pos);
                

                selected.userData.cube.position.copy(pos);

                for (var i = 0; i < objectsList.length; i++)
                {
                    if ( selected.userData.cube != objectsList[i] )
                    {
                        objectsList[i].material.visible = false;
                        objectsList[i].material.color = {r:1, g:1, b:0};

                    
                        if (intersect(selected.userData, objectsList[i].userData.model.userData) == true) 
                        {
                            objectsList[i].material.color = {r:1, g:0, b:0};
                            objectsList[i].material.visible = true;
                        } 
                    }
                }

            }
                
        }
    }
}
function onDocumentMouseDown( event )
{

    if (brVis === true)
    {
        console.log(event.which);
        if (event.which == 1)
            brushDirection = 1;
        if (event.which == 3)
            brushDirection = -1;
    } else 
    {
        lmb = true;
        //определение позиции мыши
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

        //создание луча, исходящего из позиции камеры и проходящего сквозь позицию курсора мыши
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        vector.unproject(camera);

        var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );        
        // создание массива для хранения объектов, с которыми пересечётся луч
        var intersects = ray.intersectObjects( objectsList, true );
        if ( intersects.length > 0 )
        {
            if (selected != null)
            {
                selected.userData.cube.material.visible = false;
                selected = intersects[0].object.userData.model;
                selected.userData.cube.material.visible = true;

            } else 
            {
                selected = intersects[0].object.userData.model;
                //console.log(selected);
                //отмена скрытия объекта
                selected.userData.cube.material.visible = true;
            }
            
        } else
        if (selected != null)
        {
            selected.userData.cube.material.visible = false;
            selected = null;
        }
    }

    
}
function onDocumentMouseUp( event )
{
    if (brVis === true)
    {
        brushDirection = 0;
    } else 
    {
        lmb = false;
    }
}

function sphereBrush(dir, delta)
{
    for (var i = 0; i < geometry.vertices.length; i++)
    {
        var x2 = geometry.vertices[i].x;
        var z2 = geometry.vertices[i].z;
        var r = radius;
        var x1 = cursor3D.position.x;
        var z1 = cursor3D.position.z;
        
        var h = r*r - (((x2 - x1 ) * (x2 - x1 )) + ((z2 - z1) * (z2 - z1)));

        if (h > 0)
        {
            geometry.vertices[i].y += Math.sqrt(h)*delta * dir;
        }
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals(); //пересчёт нормалей
    geometry.verticesNeedUpdate = true; //обновление вершин
    geometry.normalsNeedUpdate = true; //обновление нормалей

    
  
}


function GUI()
{
    //массив переменных, ассоциированных с интерфейсом
    var params =
    {
        sx: 0, sy: 0, sz: 0,
        brush: false,
        addPalm: function() { addMesh('palma') },
        addHome: function() { addMesh('home') },
        addBush: function() { addMesh('bush') },
        addGrade: function() { addMesh('grade') }
        
        //del: function() { delMesh() }
        // loadModel('models/', 'Palma 001.obj', 'Palma 001.mtl', 1);
        // loadModel('models/bush/', 'Bush1.obj', 'Bush1.mtl', 1);
        // loadModel('models/grade/', 'grade.obj', 'grade.mtl', 1);
        // loadModel('models/home/', 'Cyprys_House.obj', 'Cyprys_House.mtl', 1);

    };

    //создание вкладки
    var folder1 = gui.addFolder('Scale');
    //ассоциирование переменных отвечающих за масштабирование
    //в окне интерфейса они будут представлены в виде слайдера
    //минимальное значение - 1, максимальное – 100, шаг – 1
    //listen означает, что изменение переменных будет отслеживаться
    var meshSX = folder1.add( params, 'sx' ).min(1).max(100).step(1).listen();
    var meshSY = folder1.add( params, 'sy' ).min(1).max(100).step(1).listen();

    var meshSZ = folder1.add( params, 'sz' ).min(1).max(100).step(1).listen();
    //при запуске программы папка будет открыта
    folder1.open();
    //описание действий совершаемых при изменении ассоциированных значений
   // meshSX.onChange(function(value) {…});
   // meshSY.onChange(function(value) {…});
   // meshSZ.onChange(function(value) {…});
    //добавление чек бокса с именем brush
    var cubeVisible = gui.add( params, 'brush' ).name('brush').listen();

    cubeVisible.onChange(function(value)
    {
        brVis = value;
        cursor3D.visible = value;
        circle.visible = value;
    });
    //добавление кнопок, при нажатии которых будут вызываться функции addMesh
    //и delMesh соответственно. Функции описываются самостоятельно.
    gui.add( params, 'addHome' ).name( "add home" );
    gui.add( params, 'addBush' ).name( "add bush" );
    gui.add( params, 'addGrade' ).name( "add grade" );
    gui.add( params, 'addPalm' ).name( "add palm" );
   // gui.add( params, 'del' ).name( "delete" );

    //при запуске программы интерфейс будет раскрыт
    gui.open();

}

function loadModel(path, oname, mname, s, name)
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
            object.castShadow = true;


            object.traverse( function (child )
            {
                if (child instanceof THREE.Mesh)
                {
                    child.castShadow = true;
                    child.parent = object;
                }
            } );

            object.parent = object;
            
            
                var x = Math.random() * N;
                var z = Math.random() * N;

                var y = geometry.vertices[ Math.round(z) + Math.round(x) * N ].y;

                object.position.x = x;
                object.position.y = y;
                object.position.z = z;

                
                object.scale.set(s, s, s);
                //scene.add(object);
                models.set(name, object);
                //models.push(object);

            
        }, onProgress, onError );

        // {
            
        //     object.traverse( function ( child )
        //     {
        //         if ( child instanceof THREE.Mesh )
        //         {
        //             child.castShadow = true;
        //         }
        //     } );

            
        //         object.position.x = Math.random()*N;
        //         object.position.z = Math.random()*N;
        //         object.position.y = getPixel(imagedata, Math.floor(object.position.x),  Math.floor(object.position.z)) / 10.00;
                

        //         object.scale.set(s, s, s);

        //         //scene.add(object);
        //         models.push(object);
            
            
        // }, onProgress, onError );
    });
}

function addMesh(name)
{
    // console.log(models.get(name));
    var model = models.get(name).clone();

    var box = new THREE.Box3();
    box.setFromObject(model);
    model.userData.box = box;
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    var cube = new THREE.Mesh( geometry, material);
    scene.add( cube );

    //скрытие объекта
    cube.material.visible = false;

    

    //получение позиции центра объекта
    var pos = new THREE.Vector3();
    box.getCenter(pos);
    //получение размеров объекта
    var size = new THREE.Vector3();
    box.getSize(size);
     
    //установка позиции и размера объекта в куб
    cube.position.copy(pos);
    cube.scale.set(size.x, size.y, size.z);

    model.userData.cube = cube;
    cube.userData.model = model;
    var obb = {};
    //структура состоит из матрицы поворота, позиции и половины размера
    obb.basis = new THREE.Matrix4();
    obb.halfSize = new THREE.Vector3();
    obb.position = new THREE.Vector3();
    //получение позиции центра объекта
    box.getCenter(obb.position);
    //получение размеров объекта
    box.getSize(obb.halfSize).multiplyScalar(0.5);
    //получение матрицы поворота объекта
    obb.basis.extractRotation(model.matrixWorld);

    model.userData.obb = obb;
    
    objectsList.push(cube);
    scene.add(model);
}



//оригинал алгоритма и реализацию класса OBB можно найти по ссылке:
//https://github.com/Mugen87/yume/blob/master/src/javascript/engine/etc/OBB.js
function intersect(ob1, ob2)
{
    var xAxisA = new THREE.Vector3();
    var yAxisA = new THREE.Vector3();
    var zAxisA = new THREE.Vector3();
    var xAxisB = new THREE.Vector3();
    var yAxisB = new THREE.Vector3();
    
    var zAxisB = new THREE.Vector3();
    var translation = new THREE.Vector3();
    var vector = new THREE.Vector3();

    var axisA = [];
    var axisB = [];
    var rotationMatrix = [ [], [], [] ];
    var rotationMatrixAbs = [ [], [], [] ];
    var _EPSILON = 1e-3;

    var halfSizeA, halfSizeB;
    var t, i;

    ob1.obb.basis.extractBasis( xAxisA, yAxisA, zAxisA );
    ob2.obb.basis.extractBasis( xAxisB, yAxisB, zAxisB );

    // push basis vectors into arrays, so you can access them via indices
    axisA.push( xAxisA, yAxisA, zAxisA );
    axisB.push( xAxisB, yAxisB, zAxisB );
    // get displacement vector
    vector.subVectors( ob2.obb.position, ob1.obb.position );
    // express the translation vector in the coordinate frame of the current
    // OBB (this)
    for ( i = 0; i < 3; i++ )
    {
    translation.setComponent( i, vector.dot( axisA[ i ] ) );
    }
    // generate a rotation matrix that transforms from world space to the
    // OBB's coordinate space
    for ( i = 0; i < 3; i++ )
    {
    for ( var j = 0; j < 3; j++ )
    {
    rotationMatrix[ i ][ j ] = axisA[ i ].dot( axisB[ j ] );
    rotationMatrixAbs[ i ][ j ] = Math.abs( rotationMatrix[ i ][ j ] ) + _EPSILON;
    }
    }
    // test the three major axes of this OBB
    for ( i = 0; i < 3; i++ )
    {
    vector.set( rotationMatrixAbs[ i ][ 0 ], rotationMatrixAbs[ i ][ 1 ], rotationMatrixAbs[ i ][ 2 ]
    );
    halfSizeA = ob1.obb.halfSize.getComponent( i );
    halfSizeB = ob2.obb.halfSize.dot( vector );
    

    if ( Math.abs( translation.getComponent( i ) ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    }
    // test the three major axes of other OBB
    for ( i = 0; i < 3; i++ )
    {
    vector.set( rotationMatrixAbs[ 0 ][ i ], rotationMatrixAbs[ 1 ][ i ], rotationMatrixAbs[ 2 ][ i ] );
    halfSizeA = ob1.obb.halfSize.dot( vector );
    halfSizeB = ob2.obb.halfSize.getComponent( i );
    vector.set( rotationMatrix[ 0 ][ i ], rotationMatrix[ 1 ][ i ], rotationMatrix[ 2 ][ i ] );
    t = translation.dot( vector );
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    }
    // test the 9 different cross-axes
    // A.x <cross> B.x
    halfSizeA = ob1.obb.halfSize.y * rotationMatrixAbs[ 2 ][ 0 ] + ob1.obb.halfSize.z *
    rotationMatrixAbs[ 1 ][ 0 ];
    halfSizeB = ob2.obb.halfSize.y * rotationMatrixAbs[ 0 ][ 2 ] + ob2.obb.halfSize.z *
    rotationMatrixAbs[ 0 ][ 1 ];
    t = translation.z * rotationMatrix[ 1 ][ 0 ] - translation.y * rotationMatrix[ 2 ][ 0 ];
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    // A.x < cross> B.y
    halfSizeA = ob1.obb.halfSize.y * rotationMatrixAbs[ 2 ][ 1 ] + ob1.obb.halfSize.z *
    rotationMatrixAbs[ 1 ][ 1 ];
    halfSizeB = ob2.obb.halfSize.x * rotationMatrixAbs[ 0 ][ 2 ] + ob2.obb.halfSize.z *
    rotationMatrixAbs[ 0 ][ 0 ];
    t = translation.z * rotationMatrix[ 1 ][ 1 ] - translation.y * rotationMatrix[ 2 ][ 1 ];
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    // A.x <cross> B.z
    halfSizeA = ob1.obb.halfSize.y * rotationMatrixAbs[ 2 ][ 2 ] + ob1.obb.halfSize.z *
    rotationMatrixAbs[ 1 ][ 2 ];
    halfSizeB = ob2.obb.halfSize.x * rotationMatrixAbs[ 0 ][ 1 ] + ob2.obb.halfSize.y *
    rotationMatrixAbs[ 0 ][ 0 ];
    t = translation.z * rotationMatrix[ 1 ][ 2 ] - translation.y * rotationMatrix[ 2 ][ 2 ];
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    // A.y <cross> B.x
    halfSizeA = ob1.obb.halfSize.x * rotationMatrixAbs[ 2 ][ 0 ] + ob1.obb.halfSize.z *
    rotationMatrixAbs[ 0 ][ 0 ];
    halfSizeB = ob2.obb.halfSize.y * rotationMatrixAbs[ 1 ][ 2 ] + ob2.obb.halfSize.z *
    rotationMatrixAbs[ 1 ][ 1 ];
    t = translation.x * rotationMatrix[ 2 ][ 0 ] - translation.z * rotationMatrix[ 0 ][ 0 ];
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    // A.y <cross> B.y
    halfSizeA = ob1.obb.halfSize.x * rotationMatrixAbs[ 2 ][ 1 ] + ob1.obb.halfSize.z *
    rotationMatrixAbs[ 0 ][ 1 ];
    halfSizeB = ob2.obb.halfSize.x * rotationMatrixAbs[ 1 ][ 2 ] + ob2.obb.halfSize.z *
    rotationMatrixAbs[ 1 ][ 0 ];
    t = translation.x * rotationMatrix[ 2 ][ 1 ] - translation.z * rotationMatrix[ 0 ][ 1 ];
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    // A.y <cross> B.z
    halfSizeA = ob1.obb.halfSize.x * rotationMatrixAbs[ 2 ][ 2 ] + ob1.obb.halfSize.z *
    rotationMatrixAbs[ 0 ][ 2 ];
    halfSizeB = ob2.obb.halfSize.x * rotationMatrixAbs[ 1 ][ 1 ] + ob2.obb.halfSize.y *
    rotationMatrixAbs[ 1 ][ 0 ];
    t = translation.x * rotationMatrix[ 2 ][ 2 ] - translation.z * rotationMatrix[ 0 ][ 2 ];
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    // A.z <cross> B.x
    halfSizeA = ob1.obb.halfSize.x * rotationMatrixAbs[ 1 ][ 0 ] + ob1.obb.halfSize.y *
    rotationMatrixAbs[ 0 ][ 0 ];
    halfSizeB = ob2.obb.halfSize.y * rotationMatrixAbs[ 2 ][ 2 ] + ob2.obb.halfSize.z *
    rotationMatrixAbs[ 2 ][ 1 ];
    t = translation.y * rotationMatrix[ 0 ][ 0 ] - translation.x * rotationMatrix[ 1 ][ 0 ];
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    // A.z <cross> B.y
    halfSizeA = ob1.obb.halfSize.x * rotationMatrixAbs[ 1 ][ 1 ] + ob1.obb.halfSize.y *
    rotationMatrixAbs[ 0 ][ 1 ];
    halfSizeB = ob2.obb.halfSize.x * rotationMatrixAbs[ 2 ][ 2 ] + ob2.obb.halfSize.z *
    rotationMatrixAbs[ 2 ][ 0 ];
    t = translation.y * rotationMatrix[ 0 ][ 1 ] - translation.x * rotationMatrix[ 1 ][ 1 ];
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    // A.z <cross> B.z
    halfSizeA = ob1.obb.halfSize.x * rotationMatrixAbs[ 1 ][ 2 ] + ob1.obb.halfSize.y *
    rotationMatrixAbs[ 0 ][ 2 ];
    halfSizeB = ob2.obb.halfSize.x * rotationMatrixAbs[ 2 ][ 1 ] + ob2.obb.halfSize.y *
    rotationMatrixAbs[ 2 ][ 0 ];
    t = translation.y * rotationMatrix[ 0 ][ 2 ] - translation.x * rotationMatrix[ 1 ][ 2 ];
    if ( Math.abs( t ) > halfSizeA + halfSizeB )
    {
    return false;
    }
    // no separating axis exists, so the two OBB don't intersect
    return true;
}
let canvas_container, camera, controls, scene, renderer, slice_object;
let raycaster;
let main_model = null, empty_pusher_board_model = null, pusher_model = null;
let object_confuguration = {}
let mouse = new THREE.Vector2(), INTERSECTED;
let fbx_loader = new THREE.FBXLoader();
var clock = new THREE.Clock();
let mixers = [];
let stats = null;

let e3d_clicked = null;
let e3d_dblClicked = null;

let world = null;

let water;

function init_3d_components() {

    // 3D Canvas part 
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202040);
    scene.fog = new THREE.Fog(0x202040, 100, 500);

    // Канвас
    canvas_container = document.getElementById("container3d");
    let w = canvas_container.offsetWidth;
    let h = canvas_container.offsetHeight;
    let width = w;
    let height = h;

    raycaster = new THREE.Raycaster();

    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.transparency = THREE.OrderIndependentTransperancy;
    renderer.setSize(w, h);
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    canvas_container.appendChild(renderer.domElement);


    camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2000);

    camera.position.x = 100;
    camera.position.y = 24;
    camera.position.z = 110;

    // Контроллер камеры - орбитальный
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableKeys = false;
    controls.keys = {};
    controls.target = new THREE.Vector3(0, 28, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.2;
    controls.panningMode = THREE.HorizontalPanning;
    controls.minDistance = 50;
    controls.maxDistance = 500;
    controls.maxPolarAngle = Math.PI / 1.7;
    controls.minPolarAngle = Math.PI / 8;
    controls.target_offset = 40;
    controls.mouseButtons = {
        ORBIT: THREE.MOUSE.LEFT,
        ZOOM: THREE.MOUSE.MIDDLE,
        PAN: THREE.MOUSE.RIGHT
    };





    // let light = new THREE.PointLight(0x8080FF, 3.0, 1000);
    // light.position.set(0, 100, 0);
    // scene.add(light);

    let light2 = new THREE.PointLight(0xFFFF55, 2.0, 100);
    light2.position.set(0, 30, 30);
    scene.add(light2);

    let light3 = new THREE.PointLight(0x33FF55, 2.0, 50);
    light3.position.set(0, 30, 0);
    scene.add(light3);

    var ambientLight = new THREE.AmbientLight( 0x8080FF, 0.9 );
	scene.add( ambientLight );

    // water

    var waterGeometry = new THREE.PlaneBufferGeometry( 10, 10 );
    water = new THREE.Water( waterGeometry, {
        color: 0x5050FF,
        scale: 1.0,
        flowDirection: new THREE.Vector2( 0.2, 0.2),
        textureWidth: 512,
        textureHeight: 512,
        reflectivity: 0.99
    } );

    water.scale.set(100, 100, 100);
    water.position.y = 2.5;
    water.rotation.x = Math.PI * - 0.5;
    scene.add(water);

    // let plane_geometry = new THREE.PlaneBufferGeometry(500, 500);
    // let plane_material = new THREE.MeshStandardMaterial({ color: 0x335533 });
    // let plane_mesh = new THREE.Mesh(plane_geometry, plane_material);
    // plane_mesh.position.y = -0.1;
    // plane_mesh.rotation.x = - Math.PI * 0.5;
    // plane_mesh.castShadow = true;
    // plane_mesh.receiveShadow = true;
    // scene.add(plane_mesh);

    // let grid = new THREE.GridHelper(250, 10, 0x88FF88, 0x00AA00);
    // grid.material.opacity = 0.25;
    // grid.material.transparent = true;
    // scene.add(grid);

    canvas_container.addEventListener('mousemove', onCanvasMouseMove, false);
    canvas_container.addEventListener('mousedown', onCanvasMouseDown, false);
    canvas_container.addEventListener('dblclick', onCanvasMouseDoubleClick, false);

    window.addEventListener('resize', onWindowResize, false);

    // Prepare stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '50px';
    stats.domElement.style.bottom = '50px';
    stats.domElement.style.zIndex = 1;
    canvas_container.appendChild(stats.domElement);

    world.scene = scene;
    world.controls = controls;
    world.camera = camera;
    world.load_all_models(world.init);
}


function onWindowResize() {
    camera.aspect = canvas_container.offsetWidth / canvas_container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas_container.offsetWidth, canvas_container.offsetHeight);
}

function onCanvasMouseMove(event) {
    event.preventDefault();
    mouse.x = ((event.clientX) / canvas_container.offsetWidth) * 2 - 1;
    mouse.y = - ((event.clientY) / canvas_container.offsetHeight) * 2 + 1;
}

function onCanvasMouseDown(event) {
    event.preventDefault();

    e3d_clicked = null;

    if (INTERSECTED != null) {
        let intersected_root = findParentPreSceneObject(scene, INTERSECTED);

        if(intersected_root.hasOwnProperty('name')) {
            e3d_clicked = intersected_root.name;
        }
    }

    // console.log('e3d_clicked:', e3d_clicked, '  e3d_dblClicked:', e3d_dblClicked);
}

function onCanvasMouseDoubleClick(event) {
    event.preventDefault();

    console.log('Camera POS:', camera.position);
    e3d_dblClicked = null;

    if (INTERSECTED != null) {


    }

}

function animate() {
    requestAnimationFrame(animate);

    // let delta = clock.getDelta();

    // if (mixers.length > 0) {
    //     for (var i = 0; i < mixers.length; i++) {
    //         mixers[i].update(delta);
    //     }
    // }

    controls.update();
    render();
}

function render() {
    //camera.updateMatrixWorld();
    raycaster.setFromCamera(mouse, camera);

   

    stats.update();
    //renderer.clear();
    renderer.render( scene, camera );
}

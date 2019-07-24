let camera, scene, Renderer, controls, geometry;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    let container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 500;

    controls = new THREE.OrbitControls(camera, renderer.domElement)

    let texture = (new THREE.TextureLoader).load("../img/sombra-logo.svg")
    let material = new THREE.PointsMaterial({
        size: 10,
        // VertexColors: THREE.VertexColors,
        map: texture
    });

    geometry = new THREE.Geometry();

    let x, y, z;

    for (let i = 0; i <= 1; i++) {
        x = 0;
        y = 0;
        z = 0;

        geometry.vertices.push(new THREE.Vector3(z, y, z));
        geometry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
    };


    let pointCloud = new THREE.Points(geometry, material);

    scene.add(pointCloud);


    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectMatrix();
    renderer.setSize(window.innerWidth / window.innerHeight)
}

let i = 0;

function animate() {
    i++;
    requestAnimationFrame(animate);

    geometry.verticesNeedUpdate = true;

    render();
}

function render() {
    renderer.render(scene, camera);
}

init();
animate();
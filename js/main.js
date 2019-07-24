let camera, scene, Renderer, controls, geometry;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    let container = document.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 500;

    controls = new THREE.OrbitConrols(camera, renderer.domElement)
}
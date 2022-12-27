import * as THREE from 'three';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';

/* Basic Setting*/
var myRenderer;
var myCamera;
var myScene;
var myLight;

//*renderer setting    
myRenderer = new THREE.WebGL1Renderer();
let rd_w = window.innerWidth;
let rd_h = window.innerHeight;
myRenderer.setSize(rd_w, rd_h);
myRenderer.setViewport(0, 0, rd_w, rd_h);
const container = document.getElementById('universe');
container.appendChild(myRenderer.domElement);
//*camera setting
myCamera = new THREE.PerspectiveCamera(45, rd_w / rd_h, 1, 500);
myCamera.position.set(0, 0, 80);
myCamera.up.set(0, 1, -10);
myCamera.lookAt(0, 0, 0);
//*scene setting
myScene = new THREE.Scene();
myLight = new THREE.DirectionalLight(0xffffff, 0.5);
myLight.position.set(0, 0, 20);
myScene.add(myLight);
myScene.add(myCamera);

myScene.background = new THREE.Color('#FAF7F0');



/*Controller / Loader*/
const ctrl = new OrbitControls(myCamera, myRenderer.domElement);
ctrl.update();


const objLoader = new OBJLoader();
objLoader.load('./obj/earth.obj', function (object) {
    myScene.add(object);
});

//* Events
animate();
//*create animation
function animate() {
    requestAnimationFrame(animate);
    ctrl.update();
    myRenderer.render(myScene, myCamera);
}

//*add resize event
function onResize() {
    myCamera.aspect = window.innerWidth / window.innerHeight;
    myCamera.updateProjectionMatrix();
    myRenderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);
import * as THREE from "three";
import { MaterialLoader, Mesh } from "three";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "../node_modules/three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "../node_modules/three/examples/jsm/loaders/MTLLoader.js";

/* Basic Setting*/
var myRenderer;
var myCamera;
var myScene;
var myLight1;
var myLight2;

//*renderer setting
myRenderer = new THREE.WebGL1Renderer();
let rd_w = window.innerWidth;
let rd_h = window.innerHeight;
myRenderer.setSize(rd_w, rd_h);
myRenderer.setViewport(0, 0, rd_w, rd_h);

const container = document.getElementById("universe");
container.appendChild(myRenderer.domElement);
//*camera setting
myCamera = new THREE.PerspectiveCamera(45, rd_w / rd_h, 1, 500);
myCamera.position.set(0, 0, 12);
myCamera.up.set(0, 1, -10);
myCamera.lookAt(0, 0, 0);
//*scene setting
myScene = new THREE.Scene();
myLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
myLight1.position.set(0, 20, 30);
myScene.add(myLight1);

myLight2 = new THREE.AmbientLight(0xffffff, 0.9);
myLight2.position.set(0, 20, -10);
myScene.add(myLight2);
myScene.add(myCamera);

myScene.background = new THREE.Color("#150050");

/*Controller / Loader*/
const ctrl = new OrbitControls(myCamera, myRenderer.domElement);
ctrl.update();

/*Mtl Load */
const mtlLoader = new MTLLoader();
mtlLoader.load("./obj/sun.mtl", function (materials) {
  materials.preload();
  objLoader(materials);
});
//why work?

/*Obj Load */
// 호출 위해 전역변수 선언 필요
let earth,
  sun,
  ufo,
  et,
  light1,
  light2,
  light3,
  moon,
  saturn,
  rckt,
  train999 = new THREE.Mesh();
// sun = new THREE.Object3D(myScene.getObjectByName("sun"));
sun = new THREE.Mesh();

function objLoader(materials) {
  objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  // objLoader.setPath('./obj/');

  objLoader.load("./obj/earth.obj", function (earth) {
    //로드 후 실행 함수
    console.log(earth.position);
    earth.position.set(2, -2.5, 0);
    earth.rotation.y += 0.5;
    myScene.add(earth);
  });

  objLoader.load("./obj/sun.obj", function (loadedSun) {
    //sun => loadedSun
    sun = loadedSun; //대입 추가
    console.log(sun.position);
    // let box = new THREE.Box3().setFromObject(sun);
    // let sunSize=box.max.x- box.min.y;
    // console.log("sunSize", sunSize);
    // console.log("sun", sun.position);
    sun.position.set(0, -0.5, 0);
    myScene.add(sun);
  });
  objLoader.load("./obj/ufo.obj", function (ufo) {
    ufo.position.set(-4.5, 1.3, 0);
    ufo.rotation.z += 0.2;
    ufo.rotation.x += 0.3;
    myScene.add(ufo);
  });
  objLoader.load("./obj/et.obj", function (et) {
    //console.log(et.position);
    et.position.set(-3.5, 0, 0);
    myScene.add(et);
  });

  //big light
  objLoader.load("./obj/light1.obj", function (light1) {
    console.log(light1.position);
    light1.position.set(4.3, 3.3, 0);
    myScene.add(light1);
  });

  //middle light
  objLoader.load("./obj/light2.obj", function (light2) {
    console.log(light2.position);
    light2.position.set(3.3, 2.3, 0);
    myScene.add(light2);
  });

  //small light
  objLoader.load("./obj/light3.obj", function (light3) {
    console.log(light3.position);
    light3.position.set(2.5, 1.5, 0);
    myScene.add(light3);
  });
  objLoader.load("./obj/moon.obj", function (moon) {
    console.log(moon.position);
    moon.position.set(-1.8, 2.3, 0);
    moon.rotation.x += 0.1;
    myScene.add(moon);
  });
  objLoader.load("./obj/saturn.obj", function (saturn) {
    console.log(saturn.position);
    saturn.position.set(0, 3.8, 0);
    saturn.rotation.z -= 0.2;
    saturn.rotation.x += 0.5;
    myScene.add(saturn);
  });
  objLoader.load("./obj/rckt.obj", function (rckt) {
    console.log(rckt.position);
    rckt.position.set(4, -4, 0);
    rckt.rotation.z += 0.5;
    rckt.rotation.y += 0.3;
    myScene.add(rckt);
  });
  objLoader.load("./obj/train999.obj", function (train999) {
    console.log(train999.position);
    train999.position.set(-3, -3.5, 0);
    train999.rotation.z += 0.7;
    train999.rotation.x += 0.5;
    myScene.add(train999);
  });
}

//* Events
train999 = train999.addEventListener("click", R);
function R() {
  train999.rotation.x += 0.5;
  console.log("RR");
}
const rc = new THREE.Raycaster();
const pt = new THREE.Vector2();
function P(e) {
  pt.x = (e.clientX / window.innerWidth) * 2 - 1;
  pt.y = (e.clientX / window.innerHeight) * 2 - 1;
}

function rd() {
  if (typeof scene != "undefined") {
    //null check
    rc.setFromCamera(pt, myCamera);
    const it = rc.intersectObject(myScene.children);
    it.train999.position.set(20);
    myRenderer.render(myScene, myCamera);
  }
}
rd();

//*create animation
function animate() {
  //정상 동작 함: transform은 왜 동작 x? => Mesh로 변환
  ctrl.update();
  sun.rotation.y += 0.02;
  requestAnimationFrame(animate);
  myRenderer.render(myScene, myCamera);
}

//*add resize event
function onResize() {
  myCamera.aspect = window.innerWidth / window.innerHeight;
  myCamera.updateProjectionMatrix();
  myRenderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize);
animate();

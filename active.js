import * as THREE from "three";
import { MaterialLoader, Mesh } from "three";
// import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
// import { OBJLoader } from "../node_modules/three/examples/jsm/loaders/OBJLoader.js";
// import { MTLLoader } from "../node_modules/three/examples/jsm/loaders/MTLLoader.js";
// import {
//   CSS2DRenderer,
//   CSS2DObject,
// } from "../node_modules/three/examples/jsm/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

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

/*Objs load */
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
earth = new THREE.Mesh();
sun = new THREE.Mesh();
ufo = new THREE.Mesh();
et = new THREE.Mesh();
light1 = new THREE.Mesh();
light2 = new THREE.Mesh();
moon = new THREE.Mesh();
saturn = new THREE.Mesh();
rckt = new THREE.Mesh();
train999 = new THREE.Mesh();

function objLoader(materials) {
  objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  // objLoader.setPath('./obj/');

  objLoader.load("./obj/earth.obj", function (loadedEarth) {
    //로드 후 실행 함수
    earth = loadedEarth;
    console.log(earth.position);
    earth.position.set(4, -0.5, 0);
    earth.rotation.y += 0.5;
    myScene.add(earth);
  });

  objLoader.load("./obj/sun.obj", function (loadedSun) {
    //sun => loadedSun
    sun = loadedSun; //대입 추가
    // console.log(sun.position);
    // let box = new THREE.Box3().setFromObject(sun);
    // let sunSize=box.max.x- box.min.y;
    // console.log("sunSize", sunSize);
    // console.log("sun", sun.position);
    sun.position.set(0, -0.5, 0);
    myScene.add(sun);
  });
  objLoader.load("./obj/ufo.obj", function (loadedUfo) {
    ufo = loadedUfo;
    ufo.position.set(-4.5, 1.3, 0);
    ufo.rotation.z += 0.2;
    ufo.rotation.x += 0.3;
    myScene.add(ufo);
  });
  objLoader.load("./obj/et.obj", function (loadedEt) {
    //console.log(et.position);
    et = loadedEt;
    et.position.set(-3.5, 0, 0);
    myScene.add(et);
  });

  //big light
  objLoader.load("./obj/light1.obj", function (loadedLight1) {
    light1 = loadedLight1;
    console.log(light1.position);
    light1.position.set(4.3, 3.3, 0);
    myScene.add(light1);
  });

  //middle light
  objLoader.load("./obj/light2.obj", function (loadedLight2) {
    light2 = loadedLight2;
    console.log(light2.position);
    light2.position.set(3.3, 2.3, 0);
    myScene.add(light2);
  });

  //small light
  objLoader.load("./obj/light3.obj", function (loadedLight3) {
    light3 = loadedLight3;
    console.log(light3.position);
    light3.position.set(2.5, 1.5, 0);
    myScene.add(light3);
  });
  objLoader.load("./obj/moon.obj", function (loadedMoon) {
    moon = loadedMoon;
    console.log(moon.position);
    moon.position.set(-4, 3, 0);
    moon.rotation.x += 0.1;
    myScene.add(moon);
  });
  objLoader.load("./obj/saturn.obj", function (loadedSaturn) {
    saturn = loadedSaturn;
    console.log(saturn.position);
    saturn.position.set(0, 3.8, 0);
    saturn.rotation.z -= 0.2;
    saturn.rotation.x += 0.5;
    myScene.add(saturn);
  });
  objLoader.load("./obj/rckt.obj", function (loadedRckt) {
    rckt = loadedRckt;
    console.log(rckt.position);
    rckt.position.set(8, -3.5, 0);
    rckt.rotation.z += 0.5;
    rckt.rotation.y += 0.3;
    myScene.add(rckt);
  });
  objLoader.load("./obj/train999.obj", function (loadedTrain999) {
    train999 = loadedTrain999;
    console.log(train999.position);
    train999.position.set(-5, -3, 0);
    train999.rotation.z += 0.7;
    train999.rotation.x += 0.5;
    myScene.add(train999);
  });
}

/*a tag renderer */
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(rd_w, rd_h);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointEvents = "none";
document.body.appendChild(labelRenderer.domElement);

//function for creating a tags
function createLink(txtContent, href, x, y, z, color) {
  const a = document.createElement("a");
  const cPointLabel = new CSS2DObject(a);
  cPointLabel.position.set(x, y, z);
  a.textContent = txtContent;
  a.href = href;
  a.target = "_blink";
  a.style.color = color;
  a.className = "tooltip";
  myScene.add(cPointLabel);
}

//create text, a tags + set attributes
const h = document.createElement("h1");
const hPointLabel = new CSS2DObject(h);
hPointLabel.position.set(-0.05, 2, 0);
h.textContent = "Click Texts !";
h.style.color = "#38E54D";
h.className = "tooltip";
myScene.add(hPointLabel);

let githubLink = createLink(
  "Universe",
  "https://github.com/ch0rckbean/Universe",
  sun.position.x + 0.05,
  sun.position.y - 1.7,
  sun.position.z,
  "#F6F4EB"
);
let github = createLink(
  "Github",
  "https://github.com/ch0rckbean",
  // light1.position.x,
  // light1.position.y - 1.5,
  // light1.position.z,
  4.5,
  3.1,
  0,
  "#F6F4EB"
);
let notion = createLink(
  "Notion",
  "https://incongruous-larkspur-017.notion.site/bcb4a77192c54185a6e14fef0750fd0d?pvs=4",
  // ufo.position.x + 0.05,
  // ufo.position.y - 1.5,
  // ufo.position.z
  -4,
  2.8,
  0,
  "#F6F4EB"
);
let nBlog = createLink(
  "Naver Blog",
  "https://blog.naver.com/ch0rckbean",
  -6,
  -1.5,
  0,
  "#F6F4EB"
);

let velog = createLink(
  "Velog",
  "https://velog.io/@chr0ckbean",
  4,
  -1,
  0,
  "#F6F4EB"
);

//* Events

//*create animation
// define specifications for animating
//direction 1개만 쓰면 -1이 곱해져 obj별 애니메이션이
//중첩되므로 각 obj별로 direction을 선언 해 애니메이션 제어
//direction: 애니메이션 반복 위한 변수
let lightDirection = 1;
let ufoDirection = 1;
let etDirection = 1;
let trainDirection = 1;
let rcktDirection = 1;
const scaleSpeed = 0.005;
light1.scale.set((1, 1, 1));

function animate() {
  //정상 동작 함: transform은 왜 동작 x? => Mesh로 변환

  sun.rotation.y += 0.04;
  earth.rotation.y -= 0.02;

  light1.scale.x += lightDirection * scaleSpeed;
  light1.scale.y += lightDirection * scaleSpeed;
  light1.scale.z += lightDirection * scaleSpeed;
  if (light1.scale.x >= 1.5 || light1.scale.x <= 1) {
    lightDirection *= -1;
  }

  ufo.scale.x += ufoDirection * 0.01;
  ufo.scale.y -= ufoDirection * 0.01;
  ufo.rotation.y += 0.05;
  ufo.position.x += ufoDirection * -0.04;
  if (ufo.position.x >= -2.5 || ufo.position.x <= -7.5) {
    ufoDirection *= -1;
  }

  // (-3.5, 0, 0)
  et.position.z += etDirection * 0.05;
  if (et.position.z >= 4 || et.position.z <= -0.1) {
    etDirection *= -1;
  }

  saturn.rotation.y += 0.05;
  train999.scale.x += trainDirection * 0.01;
  if (train999.scale.x >= 1.7 || train999.scale.x <= 0.8) {
    trainDirection *= -1;
  }
  // console.log(train999.scale.x);

  // (8, -3.5, 0)
  rckt.position.x += rcktDirection * 0.02;
  rckt.position.y -= rcktDirection * 0.02;
  if (rckt.position.y >= -1.5 || rckt.position.y <= -4) {
    rcktDirection *= -1;
  }
  // console.log(rckt.position.y);

  requestAnimationFrame(animate);
  ctrl.update();
  myRenderer.render(myScene, myCamera);
  labelRenderer.render(myScene, myCamera);
}

//*add resize event
function onResize() {
  //resize event는 변경되는 size 기준이기 때문에 rd_w, rd_h 변수 사용 x
  myCamera.aspect = window.innerWidth / window.innerHeight;
  myCamera.updateProjectionMatrix();
  myRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize);
animate();

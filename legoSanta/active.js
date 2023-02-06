import * as THREE from 'three';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../node_modules/three/examples/jsm/loaders/MTLLoader.js';

/* Basic Setting*/
var myRenderer;
var myCamera;
var myScene;
var myLight1;
var myLight2;

//*renderer setting    
myRenderer=new THREE.WebGL1Renderer();
let rd_w=window.innerWidth;
let rd_h=window.innerHeight;
myRenderer.setSize(rd_w,rd_h);
myRenderer.setViewport(0,0,rd_w,rd_h);
const container=document.getElementById('legoSanta');
container.appendChild(myRenderer.domElement);
//*camera setting
myCamera=new THREE.PerspectiveCamera(45,rd_w/rd_h,1,500);
myCamera.position.set(0,0,12);
myCamera.up.set(0,1,-10);
myCamera.lookAt(0,0,0);
//*scene setting
myScene=new THREE.Scene();
myLight1= new THREE.DirectionalLight( 0xffffff, 0.9 );
myLight1.position.set(0, 20, 30);
myScene.add(myLight1);

myLight2= new THREE.AmbientLight( 0xffffff, 0.9 );
myLight2.position.set(0, 20, -10);
myScene.add(myLight2);
myScene.add(myCamera);

myScene.background = new THREE.Color('#FCC2FC');

// /*Controller / Loader*/
const ctrl=new OrbitControls(myCamera,myRenderer.domElement);


/*Mtl Load */
const mtlLoader=new MTLLoader();

mtlLoader.load('./obj/earth.mtl', function (materials){
    materials.preload();
    objLoader(materials);
});

/*Obj Load */
var earth,sun=new THREE.Mesh;


function objLoader(materials){
    objLoader=new OBJLoader();
    objLoader.setMaterials(materials);
    // objLoader.setPath('./obj/');

    objLoader.load('./obj/earth.obj',function (obj){
        earth=obj;
        earth.position.set(2,-2.5,0);
        myScene.add(earth);
        console.log("earth: " ,earth.position);
        earth.name='earth';
    });

    objLoader.load('./obj/sun.obj',function (obj){
        sun=obj;
        sun.position.set(2,1,0);
        myScene.add(sun);
        console.log("sun: " ,sun.position);
        sun.name='sun';
    });
}
//*ERR-2
// earth=myScene.getObjectByName('earth');
// sun=myScene.getObjectByName('sun');

// //*ERR-1
// earth=new THREE.Object3D();  //Mesh랑 차이?
// sun=new THREE.Object3D();
// // earth=new THREE.Mesh();
// // sun=new THREE.Mesh();
//=> 아래와 같이 단축. 순서는 왜?
earth=new THREE.Object3D(myScene.getObjectByName('earth'));
sun=new THREE.Object3D(myScene.getObjectByName('sun')); 


console.log("Components: " , myScene.children);  //group 누군지 아는 법

//*obj event
// myScene.child.addEventListener('click',R); //obj


function R(e){
    if(e.button<=1)console.log("Earth Clicked");
    // earth.rotation.y+=.05;
    // console.log(earth.position);
}

//*create animation
function animate(){
    ctrl.update();
    requestAnimationFrame(animate);
    myRenderer.render(myScene,myCamera);
    earth.rotation.y+=.05;  //여기 써야 작동 됨
}
animate();

//*add resize event
function onResize(){
    myCamera.aspect=window.innerWidth/window.innerHeight;
    myCamera.updateProjectionMatrix();
    myRenderer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener('resize',onResize);
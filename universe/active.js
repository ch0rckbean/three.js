import * as THREE from 'three';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { Object3D } from 'three';
import { BoxHelper } from '../node_modules/three/src/helpers/BoxHelper.js';


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
const container=document.getElementById('universe');
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

myScene.background = new THREE.Color('#150050');



// /*Controller / Loader*/
// const ctrl=new OrbitControls(myCamera,myRenderer.domElement);
// ctrl.update();


/*Mtl Load */
const mtlLoader=new MTLLoader();

mtlLoader.load('./obj/earth.mtl', function (materials){
    materials.preload();
    objLoader(materials);
});
//why work?    

var earth, sun, ufo, et, light1, light2, light2, light3, moon, saturn, train999, rckt;

/*Obj Load */
 function objLoader(materials){
     objLoader=new OBJLoader();
     objLoader.setMaterials(materials);
     // objLoader.setPath('./obj/');

     objLoader.load('./obj/earth.obj',function (obj){
         earth=obj;
         earth.position.set(2,-2.5,0);
         earth.rotation.y+=0.5;
         myScene.add(earth);
         console.log("earth: " ,earth.position);
     });
    objLoader.load('./obj/sun.obj',function (obj){
        sun=obj;
        sun.position.set(0,-0.5,0);
        sun.scale.x=1.5;
        sun.scale.y=1.5;
        myScene.add(sun);
        console.log("sun: ",sun.position);
    });
    objLoader.load('./obj/ufo.obj',function (obj){
        ufo=obj;
        ufo.position.set(-4.5,1.3,0);
        ufo.rotation.z+=0.2;
        ufo.rotation.x+=0.3;
        ufo.scale.x=1.5;
        ufo.scale.y=1.5;
        myScene.add(ufo);
        console.log("ufo: ",ufo.position);
    });
    objLoader.load('./obj/et.obj',function (obj){
        et=obj;
        et.position.set(-3.5,0,0);
        myScene.add(et);
        console.log("et: ",et.position);
    });
    //big light
    objLoader.load('./obj/light1.obj',function (obj){
        light1=obj;
        light1.position.set(4.3,3.3,0);
        myScene.add(light1);
        console.log("light1: ",light1.position);
    });
    //middle light
    objLoader.load('./obj/light2.obj',function (obj){
        light2=obj;
        light2.position.set(3.3,2.3,0);
        myScene.add(light2);
        console.log("light2: ",light2.position);
    });
    //small light
    objLoader.load('./obj/light3.obj',function (obj){
        light3=obj;
        light3.position.set(2.5,1.5,0);
        myScene.add(light3); 
        console.log("light3: ",light3.position);
    });
    objLoader.load('./obj/moon.obj',function (obj){
        moon=obj;
        moon.position.set(-1.8,2.3,0);
        moon.rotation.x+=0.1;
        moon.scale.x=1.5;
        moon.scale.y=1.5;
        myScene.add(moon);
        console.log("moon: ",moon.position);
    });
    objLoader.load('./obj/saturn.obj',function (obj){
        saturn=obj;
        saturn.position.set(0,3.6,0);
        saturn.rotation.z-=0.2;
        saturn.rotation.x+=0.5;
        saturn.scale.x*=2;
        saturn.scale.y*=2;
        myScene.add(saturn);
        console.log("saturn: ",saturn.position);
    });
    objLoader.load('./obj/rckt.obj',function (obj){
        rckt=obj;
        rckt.position.set(4,-4,0);
        rckt.rotation.z+=0.5;
        rckt.rotation.y+=0.3;
        myScene.add(rckt);
        console.log("rckt: ",rckt.position);
    });
    objLoader.load('./obj/train999.obj',function (obj){
        train999=obj;
        train999.position.set(-3,-3.5,0);
        train999.rotation.z+=0.7;
        train999.rotation.x+=0.5;
        train999.name="train999";
        myScene.add(train999);
        console.log("train: ",train999.position);
        train999.addEventListener('mousedown',R());
    });
}
console.log(et);
function R(obj){
    // obj.rotation.x+=0.8;
    console.log(3);
}

console.log("Components: " , myScene.children);  //group 누군지 아는 법

var t=myScene.getObjectByName("rckt");
console.log("t: ",t);
console.log(1, rckt);  //undefined
    


//* Events


//*create animation
function animate(){
    // ctrl.update();
    requestAnimationFrame(animate);
    // myScene.children.rotation.x+=0.2;
    myRenderer.render(myScene,myCamera);

}
animate();

//*add resize event
function onResize(){
    myCamera.aspect=window.innerWidth/window.innerHeight;
    myCamera.updateProjectionMatrix();
    myRenderer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener('resize',onResize);
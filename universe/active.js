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


/*Obj Load */
 function objLoader(materials){
     objLoader=new OBJLoader();
     objLoader.setMaterials(materials);
     // objLoader.setPath('./obj/');

     var earth= objLoader.load('./obj/earth.obj',function (earth){
         console.log(earth.position);
         earth.position.set(2,-2.5,0);
         earth.rotation.y+=0.5;
         myScene.add(earth);
     });

    var sun = objLoader.load('./obj/sun.obj',function (sun){
        console.log(sun.position);
        sun.position.set(0,-0.5,0);
        sun.scale.x=1.5;
        sun.scale.y=1.5;
        myScene.add(sun);
    });
    var ufo = objLoader.load('./obj/ufo.obj',function (ufo){
        ufo.position.set(-4.5,1.3,0);
        ufo.rotation.z+=0.2;
        ufo.rotation.x+=0.3;
        ufo.scale.x=1.5;
        ufo.scale.y=1.5;
        myScene.add(ufo);
    });
    var et = objLoader.load('./obj/et.obj',function (et){
        //console.log(et.position);
        et.position.set(-3.5,0,0);
        myScene.add(et);
    });
    
    //big light
    var light1 = objLoader.load('./obj/light1.obj',function (light1){
        console.log(light1.position);
        light1.position.set(4.3,3.3,0);
        myScene.add(light1);
    });

    //middle light
    var light2 = objLoader.load('./obj/light2.obj',function (light2){
        console.log(light2.position);
        light2.position.set(3.3,2.3,0);
        myScene.add(light2);
    });

    //small light
    var light3 = objLoader.load('./obj/light3.obj',function (light3){
        console.log(light3.position);
        light3.position.set(2.5,1.5,0);
        myScene.add(light3); 
    });
    var moon = objLoader.load('./obj/moon.obj',function (moon){
        console.log(moon.position);
        moon.position.set(-1.8,2.3,0);
        moon.rotation.x+=0.1;
        moon.scale.x=1.5;
        moon.scale.y=1.5;
        myScene.add(moon);
    });
    var saturn = objLoader.load('./obj/saturn.obj',function (saturn){
        console.log(saturn.position);
        saturn.position.set(0,3.6,0);
        saturn.rotation.z-=0.2;
        saturn.rotation.x+=0.5;
        saturn.scale.x*=2;
        saturn.scale.y*=2;
        myScene.add(saturn);
    });
    var rckt = objLoader.load('./obj/rckt.obj',function (rckt){
        console.log(rckt.position);
        rckt.position.set(4,-4,0);
        rckt.rotation.z+=0.5;
        rckt.rotation.y+=0.3;
        myScene.add(rckt);
    });
    
   
     var train999 = objLoader.load('./obj/train999.obj',function (train999){
        console.log(train999.position);
        train999.position.set(-3,-3.5,0);
        train999.rotation.z+=0.7;
        train999.rotation.x+=0.5;
        myScene.add(train999);
    });
}
console.log(myScene.children);  //group 누군지 아는 법
var t=myScene.getObjectByName("train999");
console.log("t: "+t);
    


function loadModel(){
    var pst=new THREE.Vector3();
    myScene.traverse(function (child){
        if(child){
            child.geometry.computeBoundingBox();
            var bdBox=new THREE.BoxHelper(child, 0xfffff00);
            bdBox=child.geometry.bdBox;
            pst.subVectors(bdBox.max, bdBox.min);
            pst.multiplyScalar(0.5);
            pst.add(bdBox.min);
            pst.applyMatrix4(Object3D.matrixWorld);
            child.geometry.applyMatrix4(
                new THREE.Matrix4().makeTranslation(
                    -(pst.x),
                    -(pst.y),
                    -(pst.z),
                )
            );
            child.verticesNeedUpdate=true;
            child.pst.set(pst.x, pst.y, pst.z);
            child.rotation.z=2 * Math.PI * Math.random();
            console.log("tt");
        } //https://www.google.co.kr/search?q=+boxhelper+threejs+import&sxsrf=AJOqlzXzlJ5mUYjKNm7ASMHi5ljuIZfLFQ%3A1674312718565&ei=DvzLY-GEIrzh2roPwZGj2AY&ved=0ahUKEwjhw9T29Nj8AhW8sFYBHcHICGsQ4dUDCA8&uact=5&oq=+boxhelper+threejs+import&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQA0oECEEYAEoECEYYAFAAWABglQFoAHAAeACAAQCIAQCSAQCYAQCgAQHAAQE&sclient=gws-wiz-serp
        //https://discourse.threejs.org/t/how-to-rotate-each-mesh-in-the-object-which-is-loaded-by-objloader-around-each-axis/23242/7
    });
}
//* Events

loadModel();


//*create animation
function animate(){
    // ctrl.update();
    
    requestAnimationFrame(animate);
    // myScene.children.rotation.x+=0.2;
    myRenderer.render(myScene,myCamera);
    bdBox.update();

}
animate();

//*add resize event
function onResize(){
    myCamera.aspect=window.innerWidth/window.innerHeight;
    myCamera.updateProjectionMatrix();
    myRenderer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener('resize',onResize);
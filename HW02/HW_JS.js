import * as THREE from 'three';
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

var myRenderer;
var myScene;
var myCamera;

//renderer setting    
myRenderer=new THREE.WebGL1Renderer();
const rd_w=640; //window.innerWidth;
const rd_h=480; //window.innerHeight;
myRenderer.setSize(rd_w,rd_h);
myRenderer.setSize(rd_w,rd_h);
myRenderer.setViewport(0,0,rd_w,rd_h);

const container=document.getElementById('myContainer');
container.appendChild(myRenderer.domElement);
//camera setting
myCamera=new THREE.PerspectiveCamera(45,rd_w/rd_h,1,500);
myCamera.position.set(0,0,50);
myCamera.up.set(0,1,0);
myCamera.lookAt(0,0,0);
//scene setting
myScene=new THREE.Scene();

//거리 체크
// myScene.updateMatrixWorld(true);
// cps.setFromMatrixPosition(camera.matrixWorld);
// ops.setFromMatrixPosition(myMesh.matrixWorld);
// console.log(cps.z-ops.z);

const controls=new OrbitControls(myCamera,myRenderer.domElement);

//geometry setting: Make a Cube!
const points=[ //cubeSize==10
    5,5,5,  //1
    5,5,-5,  //0
    5,-5,5, //4
    5,-5,-5, //5
    -5,5,-5,//2    
    -5,5,5,  //3
    -5,-5,-5, //6
    -5,-5,5 //7

    // 0,0,0,  10,0,0, 10,10,0,    0,10,0,
    // 0,0,10, 10,0,10,    10,10,10,   0,10,10,
    
];
const indicies=[
    // 2,1,3,  6,1,2,  6,5,1,  6,4,5,
    // 3,5,0,  3,1,5,  7,6,2,  7,4,6,
    // 7,3,0,  7,2,3,  5,7,0,  5,4,7

    //대충 맞음
    // 1,3,6,  3,2,6,  3,1,2,  //6,1,2, 
    //  1,6,4,  5,1,4,  5,4,6,  //1,5,6,
    // 6,2,7,  7,2,3,  7,5,6, // 5,2,6,
    // 5,2,0,  5,0,1,  2,1,0,  //1,2,5,      
    0,2,1, 2,3,1, //front
    4,5,1, 5,0,1,  //right
    7,6,2,  6,3,2,  //left
    4,6,5, 6,7,5,  //back
    5,7,0,  7,2,0,  //top
    1,3,4,  3,6,4,  //bottom     
]

const cubeGeo=new THREE.BufferGeometry();
const pointsArray=new Float32Array(points);

cubeGeo.setAttribute('position',new THREE.BufferAttribute(pointsArray,3));
cubeGeo.setIndex(indicies);

const cubeMaterial=new THREE.MeshBasicMaterial( { color: '#38E54D', wireframe:true } );
const myMesh = new THREE.Mesh( cubeGeo, cubeMaterial );

myScene.add(myMesh);
controls.update();
myRenderer.render(myScene,myCamera);
//여기까지 object 생성 및 scene에 render


//* Event
animate();
//*create animation
function animate(){
requestAnimationFrame(animate);
controls.update();
myRenderer.render(myScene,myCamera);
}

myRenderer.domElement.style="touch-action:none";

myRenderer.domElement.onpointerdown=mouseDownHandler;
// myRenderer.domElement.oncontextmenu=RbtnHandler;
// myRenderer.domElement.onpointermove=mouseMoveHandler;
// myRenderer.domElement.onpointerup=mouseUpHandler;
// myRenderer.domElement.onpointercancel=mouseUpHandler;
// myRenderer.domElement.onpointerout=mouseUpHandler;
// myRenderer.domElement.onpointerleave=mouseUpHandler;

//Compute SS -> WS position
function compute_pos_ss2ws(x_ss,y_ss){
    return new THREE.Vector3(x_ss/rd_w*2-1, -y_ss/rd_h*2+1,-1).unproject(myCamera);
}

//*Check MouseBtn
// document.addEventListener('mouseup', function(e) {
//     var e = e || window.event;
//     var btnCode = e.button;
//     switch(btnCode){
//         case 0: console.log('left'); break; //btnCode == 0
//         case 1: console.log('middle'); break;  //btnCode == 1
//         case 2: console.log('right'); break;  //btnCode == 2
//     }
// });
let mouse_btn_flag=false;
function mouseDownHandler(e){
    // var e = e || window.event;
    // var btnCode = e.button;
    if(e.pointerType =='mouse'){
        mouse_btn_flag=true;
        //LBtn
        if(e.button==0){
            console.log('Mouse Left Btn Down');
        }
        else if(e.button==1 ){
            //Wheel
            console.log('Mouse Middle Btn(Wheel) Down');

        }
        else if(e.button==2){
            //RBtn
            console.log('Mouse Right Btn Down');

        }
    }
}


//MouseEvent(1-1)  Move Object: Rotate by Lbtn mouse drag


//MouseEvent(1-2)  Move Object: Move the cube parallel to the image plane by Rbtn mouse drag

//MouseEvent(2-1)  Move Camera: Rotate by Lbtn mouse drag

//MouseEvent(2-2)  Move Camera : Move the camera by mouse wheels

//MouseEvent(2-3)  Move Camera : Move the camera parallel to the image plane by by Rbtn mouse drag


//나중에 리사이즈 이벤트 추가하기
import * as THREE from 'three';
import { Camera, Mesh } from 'three';
import {AxesHelper} from 'three/src/helpers/AxesHelper.js'

//*Basic setting
var myRenderer;
var myCamera;
var myScene;

//*renderer setting    
myRenderer=new THREE.WebGL1Renderer();
let rd_w=window.innerWidth;
let rd_h=window.innerHeight;
myRenderer.setSize(rd_w,rd_h);
myRenderer.setViewport(0,0,rd_w,rd_h);
const container=document.getElementById('myContainer');
container.appendChild(myRenderer.domElement);
//*camera setting
myCamera=new THREE.PerspectiveCamera(45,rd_w/rd_h,1,500);
myCamera.position.set(0,0,40);
myCamera.up.set(0,1,0);
myCamera.lookAt(0,0,0);
//*scene setting
myScene=new THREE.Scene();
//*보조축 추가 및 배경색 지정
var axes=new THREE.AxesHelper(20); 
myScene.add(axes);  
myScene.background = new THREE.Color('#FAF7F0');

//*geometry setting: Make a Cube!
const points=[ //cubeSize==10, origin point=(0,0,0)
    5,5,5,  //0
    5,5,-5,  //1
    5,-5,5, //2
    5,-5,-5, //3
    -5,5,-5,//4  
    -5,5,5,  //5
    -5,-5,-5, //6
    -5,-5,5 //7   
];

const indicies=[  
    5,6,7, 4,6,5, //front
    2,0,5, 2,5,7, //right
    6,4,1, 6,1,3, //left
    3,1,2, 2,1,0, //back
    5,0,1, 5,1,4, //top
    2,7,6, 2,6,3, //bottom
]
    
const cubeGeo=new THREE.BufferGeometry();
const pointsArray=new Float32Array(points);

cubeGeo.setAttribute('position',new THREE.BufferAttribute(pointsArray,3));
cubeGeo.setIndex(indicies);

const cubeMaterial=new THREE.MeshBasicMaterial( { color: '#277BC0', wireframe:true } );
let myMesh = new THREE.Mesh( cubeGeo, cubeMaterial );

myScene.add(myMesh);
myRenderer.render(myScene,myCamera);
//여기까지 object 생성 및 scene에 render

//*camera - object 간 거리 체크 => 20
console.log(myCamera.position.distanceTo(myMesh.position));
console.log((myCamera.position.z)-(myMesh.position.z)); 

//* Events
animate();
//*create animation
function animate(){
    requestAnimationFrame(animate);
    myRenderer.render(myScene,myCamera);
}

//*register events to keyboard and mouse
document.addEventListener('keydown',keyDownHandler);
myRenderer.domElement.onpointerup=mouseUpHandler;
myRenderer.domElement.onpointercancel=mouseUpHandler;
myRenderer.domElement.onpointerout=mouseUpHandler;
myRenderer.domElement.onpointerleave=mouseUpHandler;

// *Check MouseBtn
// document.addEventListener('mouseup', function(e) {
//     var e = e || window.event;
//     var btnCode = e.button;
//     switch(btnCode){
//         case 0: console.log('left'); break; //btnCode == 0
//         case 1: console.log('middle'); break;  //btnCode == 1
//         case 2: console.log('right'); break;  //btnCode == 2
//     }
// });
function mouseUpHandler(e){
    mouse_btn_flag=false;
    console.log('mouse up');
}

function keyDownHandler(e){
    console.log(e.key); 
    
    if(e.key=='O' | e.key=='o'){
        console.log('Obj Transform');
        myRenderer.domElement.onpointerdown=objL_MouseDownHandler;
        myRenderer.domElement.oncontextmenu=objR_MouseDownHandler;
        objL_MouseDownHandler(e);
        objR_MouseDownHandler(e);
    }   
    else if(e.key=='C' | e.key=='c'){
        console.log('Cmr Transform');
        myRenderer.domElement.onpointerdown=cmrL_MouseDownHandler;
        myRenderer.domElement.onwheel=cmr_MouseScrollHandler;
        myRenderer.domElement.oncontextmenu=cmrR_MouseDownHandler;
        cmrL_MouseDownHandler(e);
        cmrR_MouseDownHandler(e);
        cmr_MouseScrollHandler(e);
    }
}

//*Object Transform Function
let mouse_btn_flag=false;  //mouse down 여부

//*MouseEvent(1-1)  Move Object: Rotate by Lbtn mouse drag
function objL_MouseDownHandler(e){
    if(e.pointerType =='mouse'){
        mouse_btn_flag=true;     
        myRenderer.domElement.onpointerdown=objL_MouseDownHandler;
        if(e.button==0){
            console.log('objM_Mouse Left Btn Down');
            objL_MouseMoveHandler(e);
        }
    }
}
//*MouseEvent(1-2)  Move Object: Move the cube parallel to the image plane by Rbtn mouse drag
function objR_MouseDownHandler(e){
    if(e.button==2){
        myRenderer.domElement.oncontextmenu=objR_MouseDownHandler;
        console.log('objM_Mouse Right Btn Down');
        objR_MouseMoveHandler(e);
       }
}

//Compute SS -> WS position
// function compute_pos_ss2ws(x_ss,y_ss){
//     return new THREE.Vector3(x_ss/rd_w*2-1, -y_ss/rd_h*2+1,-1).unproject(myCamera);
// }

function objL_MouseMoveHandler(e){
    if(e.pointerType=='mouse'){
        myRenderer.domElement.onpointermove=objL_MouseMoveHandler;
        const myPosPS=new THREE.Vector3(
            e.clientX/rd_w * 2 - 1,  //0~ 1 -> 0~ 2 , -1 ==1  => x를 -1~ 1로 매핑
            -e.clientY/rd_h*2+1, //screen(아래쪽) 과 proj y방향 반대
            -1);
        const myPosWS=myPosPS.clone();
        myPosWS.unproject(myCamera);//WS에 매핑 위한 unprojection : SS -> WS로 inverse (view, projection) T 해줌
        
        // console.log("Mouse Pos PS:",myPosPS.x, myPosPS.y, myPosPS.z);
        // console.log("Mouse Pos WS:",myPosWS.x, myPosWS.y, myPosWS.z);
        // console.log(e.button);
            
        if(mouse_btn_flag&&e.button<=0 ){ 
            console.log('objM_Mouse Left Btn Move');
            myMesh.rotation.x+=-(myPosPS.y/rd_h*30);
            myMesh.rotation.y+=(myPosPS.x/rd_w*30);
            // console.log(myMesh.matrix.elements);
            // console.log('left');
            //한계: Euler 연산을 사용했기에 Gimbal Lock 이슈가 있을 수 있음. 
        }
    }
}

function objR_MouseMoveHandler(e){
    myRenderer.domElement.onpointermove=objR_MouseMoveHandler;
    const myPosPS=new THREE.Vector3(
        e.clientX/rd_w * 2 - 1,  //0~ 1 -> 0~ 2 , -1 ==1  => x를 -1~ 1로 매핑
        -e.clientY/rd_h*2+1, //screen(아래쪽) 과 proj y방향 반대
        -1);
    const myPosWS=myPosPS.clone();
    myPosWS.unproject(myCamera);
    // console.log('right');
    if(mouse_btn_flag){
        console.log('objM_Mouse Right Btn Move');
        myMesh.translateX(myPosPS.x/5);
        myMesh.translateY(myPosPS.y/5);
        myMesh.position.z=0;
    }
    // console.log(myMesh.matrix.elements);
}

//*Camera Mode
//*MouseEvent(2-1)  Move Camera: Rotate by Lbtn mouse drag
function cmrL_MouseDownHandler(e){
    if(e.pointerType=='mouse'){
        mouse_btn_flag=true;     
        myRenderer.domElement.onpointerdown=cmrL_MouseDownHandler;
        if(e.button==0){
            console.log('cmrM_Mouse Left Btn Down');
            cmrL_MouseMoveHandler(e);
        }
    }
}

//*MouseEvent(2-3)  Move Camera : Move the camera parallel to the image plane by Rbtn mouse drag
function cmrR_MouseDownHandler(e){
    if(e.button==2){
        myRenderer.domElement.oncontextmenu=cmrR_MouseDownHandler;
        console.log('cmrM_Mouse Right Btn Down');
        cmrR_MouseMoveHandler(e);
    }
}

function cmrL_MouseMoveHandler(e){
    if(e.pointerType=='mouse'){
        myRenderer.domElement.onpointermove=cmrL_MouseMoveHandler;
        const myPosPS=new THREE.Vector3(
            e.clientX/rd_w * 2 - 1,  //0~ 1 -> 0~ 2 , -1 ==1  => x를 -1~ 1로 매핑
            -e.clientY/rd_h*2+1, //screen(아래쪽) 과 proj y방향 반대
            -1);
        const myPosWS=myPosPS.clone();
        myPosWS.unproject(myCamera);//WS에 매핑 위한 unprojection : SS -> WS로 inverse (view, projection) T 해줌

        if(mouse_btn_flag&& e.button<=0){
            console.log('cmrM_Mouse Left Btn Move');
            myCamera.rotation.x-=myPosWS.y*Math.PI/45;
            myCamera.rotation.y+=myPosWS.x*Math.PI/45;
            myCamera.rotation.z+=myPosWS.y*Math.PI/45;
            // console.log(myCamera.matrix.elements);
        }
    }
}

function cmrR_MouseMoveHandler(e){
    myRenderer.domElement.onpointermove=cmrR_MouseMoveHandler;
    const myPosPS=new THREE.Vector3(
        e.clientX/rd_w * 2 - 1,  
        -e.clientY/rd_h*2+1);
    const myPosWS=myPosPS.clone();
    myPosWS.unproject(myCamera);

    if(mouse_btn_flag){
        console.log('cmrM_Mouse Right Btn Move');
        myCamera.translateX(-myPosPS.x/5);
        myCamera.translateY(-myPosPS.y/5);
        myCamera.position.z=myCamera.position.z;
    }
}

// *MouseEvent(2-2)  Move Camera : Move the camera by mouse wheels
function cmr_MouseScrollHandler(e){
    //*check mouse scroll amount
    var scrDir=e.deltaY;
    console.log(scrDir); //150,-150
    
    if(scrDir<=-150){
        console.log('get bigger');
        // myCamera.position.z+=0.3;
        myCamera.position.z-=rd_w/rd_h;
    }
    else if(scrDir>=150){
        console.log('get smaller');
        myCamera.position.z+=rd_w/rd_h;
    }
    console.log(myCamera.position.z);   
    // console.log(myCamera.position.y);   
}

//*add resize event
function onResize(){
    myCamera.aspect=window.innerWidth/window.innerHeight;
    myCamera.updateProjectionMatrix();
    myRenderer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener('resize',onResize);
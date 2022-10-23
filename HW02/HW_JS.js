import * as THREE from 'three';
// import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import {AxesHelper} from '../node_modules/three/src/helpers/AxesHelper.js'

var myRenderer;
var myCamera;
var myScene;

//*renderer setting    
myRenderer=new THREE.WebGL1Renderer();
const rd_w=window.innerWidth;
const rd_h=window.innerHeight;
myRenderer.setSize(rd_w,rd_h);
myRenderer.setViewport(0,0,rd_w,rd_h);
const container=document.getElementById('myContainer');
container.appendChild(myRenderer.domElement);
//*camera setting
myCamera=new THREE.PerspectiveCamera(45,rd_w/rd_h,1,500);
myCamera.position.set(0,0,50);
myCamera.up.set(0,1,0);
myCamera.lookAt(0,0,0);
//*scene setting
myScene=new THREE.Scene();
//*보조축 추가
var axes=new THREE.AxesHelper(20); 
myScene.add(axes);  

// const controls=new OrbitControls(myCamera,myRenderer.domElement);

//geometry setting: Make a Cube!
const points=[ //cubeSize==10
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

    // 0,2,1, 2,3,1, //front
    // 4,5,1, 5,0,1,  //right
    // 7,6,2,  6,3,2,  //left
    // 4,6,5, 6,7,5,  //back
    // 5,7,0,  7,2,0,  //top
    // 1,3,4,  3,6,4,  //bottom     
    
const cubeGeo=new THREE.BufferGeometry();
const pointsArray=new Float32Array(points);

cubeGeo.setAttribute('position',new THREE.BufferAttribute(pointsArray,3));
cubeGeo.setIndex(indicies);

const cubeMaterial=new THREE.MeshBasicMaterial( { color: '#38E54D', wireframe:true } );
const myMesh = new THREE.Mesh( cubeGeo, cubeMaterial );

myScene.add(myMesh);
// controls.update();
myRenderer.render(myScene,myCamera);
//여기까지 object 생성 및 scene에 render

//*camera -object 간 거리 체크 => 15
console.log(myCamera.position.distanceTo(myMesh.position));

//* Event
animate();
//*create animation
function animate(){
    
    requestAnimationFrame(animate);
    // controls.update();
    myRenderer.render(myScene,myCamera);
}

//*register events to keyboard and mouse
document.addEventListener('keydown',keyDownHandler);
// myRenderer.domElement.onkeyup=keyUpHandler;
// myRenderer.domElement.oncontextmenu=RbtnHandler;

myRenderer.domElement.onpointerup=mouseUpHandler;
myRenderer.domElement.onpointercancel=mouseUpHandler;
myRenderer.domElement.onpointerout=mouseUpHandler;
myRenderer.domElement.onpointerleave=mouseUpHandler;

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

function keyDownHandler(e){
    console.log(e.key); 
    if(e.key=='O' | e.key=='o'){
        console.log('Obj Transform');
        myRenderer.domElement.onpointerdown=obj_MouseDownHandler;
        obj_MouseDownHandler(e);
    }
    else if(e.key=='C' | e.key=='c'){
        console.log('Cmr Transform');
        myRenderer.domElement.onpointerdown=cmr_MouseDownHandler;
        cmr_MouseDownHandler(e);
    }
}

//*Object Transform Function
let mouse_btn_flag=false;  //mouse down 여부

function obj_MouseDownHandler(e){
    if(e.pointerType =='mouse'){
        mouse_btn_flag=true;     

        myRenderer.domElement.onpointerdown=obj_MouseDownHandler;
        if(e.button==0){
        //LBtn
//*MouseEvent(1-1)  Move Object: Rotate by Lbtn mouse drag
            console.log('objM_Mouse Left Btn Down');
           
            MouseMoveHandler(e);
            
        }
        else if(e.button==2){
        //RBtn
        //MouseEvent(1-2)  Move Object: Move the cube parallel to the image plane by Rbtn mouse drag
            console.log('objM_Mouse Right Btn Down');
            
            
            
            
            MouseMoveHandler(e);

        }
    }
}

let x_prev=rd_w/2;
let y_prev=rd_h/2;
//Compute SS -> WS position
function compute_pos_ss2ws(x_ss,y_ss){
    return new THREE.Vector3(x_ss/rd_w*2-1, -y_ss/rd_h*2+1,-1).unproject(myCamera);
}

let mouseX,mouseY=0;
function MouseMoveHandler(e){
    //마우스 움직일 시 함수
    //L, R 버튼 if문으로 구분해서 추가하기
    
    if(e.pointerType=='mouse'){
            if(!mouse_btn_flag){
                return;
            }
           
            const myPosPS=new THREE.Vector3(
                e.clientX/rd_w * 2 - 1,  //0~ 1 -> 0~ 2 , -1 ==1  => x를 -1~ 1로 매핑
                -e.clientY/rd_h*2+1, //screen(아래쪽) 과 proj y방향 반대
                -1);
            const myPosWS=myPosPS.clone();
            myPosWS.unproject(myCamera);
            
            console.log("Mouse Pos PS:",myPosPS.x, myPosPS.y, myPosPS.z);
            console.log("Mouse Pos WS:",myPosWS.x, myPosWS.y, myPosWS.z);

            
            if(mouse_btn_flag==true &e.button==1  ){ 
                    //마우스 Lbtn 다운이면
                myRenderer.domElement.onpointermove=MouseMoveHandler;

                let posNp=compute_pos_ss2ws(e.clientX, e.clientY);
                // myMesh.setRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4));
            
                // let matLocal=new THREE.Matrix4();
                // const matR=new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0,1,0),Math.PI/4); 
                // matLocal.premultiply(matR);
                // myMesh.matrix=matLocal.clone();
                // myMesh.matrixAutoUpdate=false;
               
                myMesh.rotation.x+=myPosPS.y/10 *-1;
                myMesh.rotation.y+=myPosPS.x/10 *-1;
                // myMesh.rotation.z+=0.02;
                console.log(myMesh.matrix.elements);
                console.log(e.button);
                
                x_prev=e.clientX;
                y_prev=e.clientY;
                
            }
            else if(mouse_btn_flag==true & e.button==2){

            }
         }
    }
function mouseUpHandler(e){
    e.preventDefault();
    mouse_btn_flag=false;
   
}

//*Camera Transform Function
function cmr_MouseDownHandler(e){
    if(e.pointerType =='mouse'){
        mouse_btn_flag=true;
        // myRenderer.domElement.onpointerdown=cmr_MouseDownHandler;
//카메라도 마우스 무브 추가하기
        if(e.button==0){
        //LBtn
            console.log('cmrM_Mouse Left Btn Down');
        }
        else if(e.button==1 ){
        //Wheel
            console.log('cmrM_Mouse Middle Btn(Wheel) Down');

        }
        else if(e.button==2){
        //RBtn
            console.log('cmrM_Mouse Right Btn Down');

        }
    }
}





function onResize(){
    myCamera.aspect=window.innerWidth/window.innerHeight;
    myCamera.updateProjectionMatrix();
    myRenderer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener('resize',onResize);

//MouseEvent(2-1)  Move Camera: Rotate by Lbtn mouse drag
//MouseEvent(2-2)  Move Camera : Move the camera by mouse wheels
//MouseEvent(2-3)  Move Camera : Move the camera parallel to the image plane by by Rbtn mouse drag


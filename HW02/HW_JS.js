import * as THREE from 'three';
import { Camera, Mesh } from 'three';
// import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import {AxesHelper} from '../node_modules/three/src/helpers/AxesHelper.js'

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

    
const cubeGeo=new THREE.BufferGeometry();
const pointsArray=new Float32Array(points);

cubeGeo.setAttribute('position',new THREE.BufferAttribute(pointsArray,3));
cubeGeo.setIndex(indicies);

const cubeMaterial=new THREE.MeshBasicMaterial( { color: '#38E54D', wireframe:true } );
let myMesh = new THREE.Mesh( cubeGeo, cubeMaterial );

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
    myRenderer.render(myScene,myCamera);
}

//*register events to keyboard and mouse
document.addEventListener('keydown',keyDownHandler);

// myRenderer.domElement.onkeyup=keyUpHandler;
// myRenderer.domElement.oncontextmenu=RbtnHandler;

// myRenderer.domElement.onmousedown=obj_MouseDownHandler;
// myRenderer.domElement.onmousedown=cmr_MouseDownHandler;
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
        myRenderer.domElement.onwheel=cmr_MouseScrollHandler;
        cmr_MouseDownHandler(e);
        cmr_MouseScrollHandler(e);
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
            obj_MouseMoveHandler(e);
        }
        else if(e.button==2){
        //RBtn
//*MouseEvent(1-2)  Move Object: Move the cube parallel to the image plane by Rbtn mouse drag
            console.log('objM_Mouse Right Btn Down');
            obj_MouseMoveHandler(e);
        }
    }
}

let x_prev=rd_w/2;
let y_prev=rd_h/2;

//Compute SS -> WS position
function compute_pos_ss2ws(x_ss,y_ss){
    return new THREE.Vector3(x_ss/rd_w*2-1, -y_ss/rd_h*2+1,-1).unproject(myCamera);
}

function obj_MouseMoveHandler(e){
    //마우스 움직일 시 함수
    //L, R 버튼 if문으로 구분
    
    if(e.pointerType=='mouse'){
        if(!mouse_btn_flag){
            return;
        }
        myRenderer.domElement.onpointermove=obj_MouseMoveHandler;
        const myPosPS=new THREE.Vector3(
            e.clientX/rd_w * 2 - 1,  //0~ 1 -> 0~ 2 , -1 ==1  => x를 -1~ 1로 매핑
            -e.clientY/rd_h*2+1, //screen(아래쪽) 과 proj y방향 반대
            -1);
        const myPosWS=myPosPS.clone();
        myPosWS.unproject(myCamera);//WS에 매핑 위한 unprojection : SS -> WS로 inverse (view, projection) T 해줌
        
        console.log("Mouse Pos PS:",myPosPS.x, myPosPS.y, myPosPS.z);
        console.log("Mouse Pos WS:",myPosWS.x, myPosWS.y, myPosWS.z);
        // console.log(e.button);
            
        if( e.button<=0 ){ //마우스 Lbtn 다운이면
            let myPosNp=compute_pos_ss2ws(e.clientX, e.clientY);

            myMesh.rotation.x+=-(myPosPS.y/rd_h*30);
            myMesh.rotation.y+=(myPosPS.x/rd_w*30);
            // myMesh.rotation.z+=0.02;
            
            console.log(myMesh.matrix.elements);
            console.log(myMesh.rotation);
            console.log('left');
            
            //한계: Euler 연산을 사용했기에 Gimbal Lock 이슈가 있을 수 있음. Rbtn 클릭시에도 obj_Lbtn event가 같이 실행 됨

        }
            
        else if(e.button==2 ){//R마우스 Rbtn 다운이면
            console.log('right');

            myMesh.quaternion.copy(myCamera.quaternion);
       
            myMesh.translateX(myPosPS.x);
            myMesh.translateY(myPosPS.y);
            console.log(myMesh.matrix.elements);
            //z축(카메라)에 평행해야 하므로 translateX,translateY만 적용
        }
         }
    }
function mouseUpHandler(e){
    e.preventDefault(); //event bubbling 방지
    mouse_btn_flag=false;
    console.log('mouse up');
}


//*Camera Mode
function cmr_MouseDownHandler(e){
    if(e.pointerType=='mouse'){
        mouse_btn_flag=true;     
        myRenderer.domElement.onpointerdown=cmr_MouseDownHandler;

        if(mouse_btn_flag=true && e.button==0){
        //LBtn
//*MouseEvent(2-1)  Move Camera: Rotate by Lbtn mouse drag
            console.log('cmrM_Mouse Left Btn Down');
            cmr_MouseMoveHandler(e);
            
        }
        else if(mouse_btn_flag=true && e.button==2){
        //RBtn
//*MouseEvent(2-3)  Move Camera : Move the camera parallel to the image plane by by Rbtn mouse drag
            console.log('cmrM_Mouse Right Btn Down');
            cmr_MouseMoveHandler(e);
        }
    }
}

//*Camera Transform Function
function cmr_MouseMoveHandler(e){
    if(e.pointerType=='mouse'){
        if(!mouse_btn_flag){
            return;
        }
        console.log(e.button);
        myRenderer.domElement.onpointermove=cmr_MouseMoveHandler;
        
        const myPosPS=new THREE.Vector3(
            e.clientX/rd_w * 2 - 1,  //0~ 1 -> 0~ 2 , -1 ==1  => x를 -1~ 1로 매핑
            -e.clientY/rd_h*2+1, //screen(아래쪽) 과 proj y방향 반대
            -1);
        const myPosWS=myPosPS.clone();
        myPosWS.unproject(myCamera);//WS에 매핑 위한 unprojection : SS -> WS로 inverse (view, projection) T 해줌

        if(e.button<=0){
        //LBtn
            console.log('cmrM_Mouse Left Btn Move');
            myCamera.rotation.x-=myPosWS.y*Math.PI/45;
            myCamera.rotation.y+=myPosWS.x*Math.PI/45;
            myCamera.rotation.z+=myPosWS.y*Math.PI/45;

            console.log(myCamera.matrix.elements);
        }

        else if(e.button==2){
        //RBtn
        // myCamera.quaternion.copy(myCamera.quaternion);  //obj가 카메라의 z축과 평행하게 하기 위해
        
            myCamera.rotation.x-=myPosWS.y*Math.PI/45;
            myCamera.rotation.y+=myPosWS.x*Math.PI/45;
            console.log('cmrM_Mouse Right Btn Down');
        }
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
    console.log(rd_w/rd_h);   
}



function onResize(){
    myCamera.aspect=window.innerWidth/window.innerHeight;
    myCamera.updateProjectionMatrix();
    myRenderer.setSize(window.innerWidth,window.innerHeight);
}
window.addEventListener('resize',onResize);



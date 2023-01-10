import * as THREE from 'three';
import { DirectionalLightHelper } from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {AxesHelper} from 'three/src/helpers/AxesHelper.js'
import {VertexNormalsHelper} from "three/examples/jsm/helpers/VertexNormalsHelper.js";

//*Renderer Setting
const renderer = new THREE.WebGLRenderer(); 
const render_w=640;
const render_h=480;
renderer.setSize(render_w,render_h); 
renderer.setViewport(0,0,render_w,render_h); 

const container=document.getElementById('myContainer');

container.appendChild( renderer.domElement );

//*Camera Setting
const camera = new THREE.PerspectiveCamera( 45, render_w/render_h, 1, 500 );
camera.position.set( 0, 0, -50 ); 
camera.up.set(0,1,0) 
camera.lookAt( 0, 0, 100 );

//*create my world (scene)
const myScene = new THREE.Scene();
myScene.background=new THREE.Color("rgb(0,100,100)");   //배경은 lighting 된 거 x

//*geometry 세팅
const points=[ //cubeSize==10, origin point=(0,0,0)
    5,5,5,  //0
    5,5,-5,  //1
    5,-5,5, //2
    5,-5,-5, //3
    -5,5,-5,//4  
    -5,5,5,  //5
    -5,-5,-5, //6
    -5,-5,5 //7   
]; //48 byte ==12 byte *4 plots

const indicies=[  //CCW
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
// :position
//itemSize: 특정 꼭짓점과 연관된 배열의 크기. array에 저장되는 벡터의 길이
//==3: vertex당 3 값들(컴포넌트) 있기 때문에
//plot 3개를 하나의 vertex로 두겠다.==points의 숫자 3개씩 하나의 포인트로 두겠다.

cubeGeo.setIndex(indicies);
//index 버퍼 설정. renderer에게 이 index로 vertex 사용하도록

//*nm calculation
cubeGeo.computeVertexNormals(); //nm 추가. 중첩 vtx 사용 시: 점 각자의 nm 가짐  <-> vtx 4개 갖게 하기: 각 plane의 평균값 사용(computeVertexNormals)

/* nm 직접 지정도 가능*/
// const normals = [
    
// // front
//     0,0,1,
//     0,0,1,
//     0,0,1,
//     0,0,1,
//     0,0,1,
//     0,0,1,
    
// //back
//     0,0,-1,
//     0,0,-1,
//     0,0,-1,
//     0,0,-1,
//     0,0,-1,
//     0,0,-1,

// //top
//     0,1,0,
//     0,1,0,
//     0,1,0,
//     0,1,0,
//     0,1,0,
//     0,1,0,
    
// //bottom
//     0,-1,0,
//     0,-1,0,
//     0,-1,0,
//     0,-1,0,
//     0,-1,0,
//     0,-1,0,

// // right
//     1,0,0,
//     1,0,0,
//     1,0,0,
//     1,0,0,
//     1,0,0,
//     1,0,0,

// // left
//     -1,0,0,
//     -1,0,0,
//     -1,0,0,
//     -1,0,0,
//     -1,0,0,
//     -1,0,0,  
//    ];
// const normalsArray=new Float32Array(normals); //typedArray로 변환
// cubeGeo.setAttribute('normal',new THREE.BufferAttribute(normalsArray,3));

//*material setting
const cubeMaterial=new THREE.MeshPhongMaterial( { color: '#277BC0', wireframe:false,flatShading:false, shininess:300 } );
let myMesh = new THREE.Mesh( cubeGeo, cubeMaterial );
//*flat shading: 삼각형 단위로 색 결정. 검정색으로 보임.(highlight 된 상태 .nm<90이어서 안 까맣게 나왔었음)

//*line model 생성
//Mesh: 객체 기반 삼각형 폴리곤 메쉬. 우리가 만듬. nm vt(dfs, spcl term) 없어서 빛 반사 x. nm 별도 계산 필요 
myMesh.castShadow = true;
myMesh.receiveShadow = true;

var cps=new THREE.Vector3();
var ops=new THREE.Vector3();

//*scene에 model 추가
myScene.add(myMesh);

// myMesh.position.set(0,10,0); 광원은 디폴트로 (0,0,0)를 바라봄

//*myMesh2 : Cylinder
const CylGeo = new THREE.CylinderGeometry( 5,5,15,8,1,false ); //three.js 자체 제공: 잘 정의됨(atrb, nm + ..), 빛 반사함
const CylMat = new THREE.MeshPhongMaterial( { color: 0xff00,wireframe:false ,flatShading:false,} );
const myMesh2 = new THREE.Mesh( CylGeo, CylMat ); 
// myMesh.add(myMesh2); //hierarchical. more simple
/*normal vector 유무에 따른 lighting& shading 효과 비교 위해
myMesh 대신 myScene에 myMesh2 추가(not hierarchical for myMesh) 
*/
myScene.add(myMesh2); 

//*Light Setting
const myLight=new THREE.DirectionalLight(0xffffff,0.5); //D.L : 광원 포지션 중요 x default: (0,1,0)
myLight.position.set(30,30,30);
// myLight.penumbra-0.3; 그림자 경계 smooth 설정
myLight.target.position.set(0,0,0);
myLight.castShadow=true;
// myLight.receiveShadow=true; // shadow map-> occulusion test 통해 그림자 결정
// cmr: 빛 관점에서 렌더링 하기에 near,far 설정 
myLight.shadow.camera.near=1;
myLight.shadow.camera.far=100; //near,far: fov 설정 x. -> orthogonal 설정
myLight.shadow.bias=0.0001 //bias: 가려짐 test 시 bias 오차 내에선 가려지지 않은 것으로 판단(깊이 정밀도 issue 방지 위해)/ 적당한 값 넣어야 함 : 6-1 42pg
//bufferSize: shadow map 들어갈, 클수록(해상도, quality up)
myLight.shadow.mapSize.width = 1000;
myLight.shadow.mapSize.height = 1000;
myScene.add(myLight);

//*groundGrid
const groundMesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: '#FBFACD', depthWrite: false } ) );
groundMesh.rotation.x = - Math.PI / 2;
groundMesh.receiveShadow = true;
myScene.add( groundMesh );

const groundGrid=new THREE.GridHelper(2000,200,0x000000,0x000000);
groundGrid.material.opacity=0.2;
groundGrid.material.transparent=true;
myScene.add(groundGrid);

renderer.shadowMap.enabled=true;
renderer.shadowMap.type = THREE.PCFShadowMap;
//shadowMap에 최적화된, shadowMap이 동작하는 renderer 설정
renderer.autoClear = false;

//*Helpers
const controls=new OrbitControls(camera,renderer.domElement);
//OrbitControls : 카메라가 target 주위 궤도 돌게(공전) 함
//camera: 씬에 포함되지 않을 경우 반드시 다른 객체의 자식이 아니어야 함
//domElement: 이벤트 리스너(마우스,터치를 위한 HTML 요소.생성자에 넘겨줘야 함

var axesHelper=new THREE.AxesHelper(50); 
myScene.add(axesHelper);  //-y축 방향을 향함

var testHelper=new VertexNormalsHelper(myMesh,3,0xffff00);
myScene.add(testHelper);  
//표면 중간의 nm: 각 edge의 보간된 중간 값
//obj 뒤쪽에도 빛 비추는 이유: nm이 90도보다 작아져선 0이 아닌 값이 나옴: ex) 육면체 뾰족x, 둥글o 보임

const lightHelper=new DirectionalLightHelper(myLight,5); //사각형: D.L의 size
myScene.add(lightHelper);

axesHelper.visible = false;
myMesh.visible = true;
myMesh2.visible = true;
testHelper.visible = false;


animate();

function animate() {
    //매 frame 마다 render 호출
    requestAnimationFrame( animate );
    //callBack('animate')을 인자로 받음. 브라우저에 수행 원하는 애니메이션 알리고 다음 repaint 진행 전 해당 애니메이션 업데이트 함수 호출
    controls.update();
    renderer.render( myScene, camera );
}

//* renderer's DOM에 event-callback fuction 등록
renderer.domElement.style="touch-action:none"; 
//panning,zooming,축소 포함 터치 이벤트 비활성화
//브라우져에서의 액션 비활성화+ 해당 터치 액션 render 내에서 새롭게 구현
renderer.domElement.onpointerdown=mouseDownHandler;
renderer.domElement.onpointermove=mouseMoveHandler;
renderer.domElement.onpointerup=mouseUpHandler;
renderer.domElement.onpointercancel=mouseUpHandler;
renderer.domElement.onpointerout=mouseUpHandler;
renderer.domElement.onpointerleave=mouseUpHandler;

function compute_pos_ss2ws(x_ss,y_ss){
    return new THREE.Vector3(x_ss/render_w*2-1, -y_ss/render_h*2+1,-1).unproject(camera);
    //unproject: 카메라의 Normalized Device Coordinate(NDC) 스페이스의 벡터를 WS에 투영
}
let mouse_btn_flag=false;
function mouseDownHandler(e){
//마우스 다운 시 함수
// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
    if(e.pointerType =='mouse'){
        mouse_btn_flag=true;
        console.log('Mouse down ^^');
        mouseMoveHandler(e);
    }
    else if(e.pointerType=='touch'){
        //마우스 말고 touch시 함수
        evCache.push(e); //evCache : 짧은 수명
        console.log('pointerDown',e);
    }
}
var evCache=new Array();
var prevDiff=-1;

function remove_event(ev){
    //target의 캐시로부터 이 이벤트 제거
    for (var i=0; i<evCache.length; i++){
        if(evCache[i].pointerId==ev.pointerId){
            evCache.splice(i,1);
            break;
       }
    }
}

function mouseUpHandler(e){
//마우스 up 시 함수
    mouse_btn_flag=false;
    //console.log('Mouse Up');
    if(e.pointerType!='touch') return;
    //포인터타입이 터치가 아니면= 마우스면 반환
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttonlog(ev.type, ev);
    // 캐시에서 이 포인터 제거하고 타겟의 background, border 초기화
    remove_event(e);// 터치면 이벤트 제거 함수
    if(evCache.length<2){
    //pointers down의 수가 2보다 작다면 diff tracker reset
        prevDiff=-1;
    }
}

let x_prev=render_w/2;
let y_prev=render_h/2;

function mouseMoveHandler(e){
//마우스 움직일 시 함수
    if(e.pointerType=='mouse'){
        // const myPosSS=new THREE.Vector3(e.clientX,e.clientY,-1);
        const myPosPS=new THREE.Vector3(
            e.clientX/render_w * 2 - 1,  //0~ 1 -> 0~ 2 , -1 ==1  => x를 -1~ 1로 매핑
            -e.clientY/render_h*2+1, //screen(아래쪽) 과 proj y방향 반대
            -1);
        const myPosWS=myPosPS.clone();
        myPosWS.unproject(camera); //WS에 매핑 위한 unprojection : SS -> WS로 inverse (view, projection) T 해줌
        console.log("Mouse Pos PS:",myPosPS.x, myPosPS.y, myPosPS.z);  
        //-값, ==WS값 나오는 이유: callByReference의해 unproject 되며 PS바뀜. WS로 clone해 수정 
        //카메라- view T, Porjection T 갖고 있음. renderer: viewPort T 갖고 있음
        //마우스 다운 시 포인트 저장. 그거 기준 마우스 통해 움직임
        console.log("Mouse Pos WS:",myPosWS.x, myPosWS.y, myPosWS.z);
        //WS -값 나오는 이유: near plane 상의 WS 값. 카메라 안 움직이면 WS의 z 항상 -99 ==near plane(1). 카메라 -100,=> SS상 대응되는 작은 값 나옴
        

        if(mouse_btn_flag){ //마우스 다운이면
            let posNp=compute_pos_ss2ws(e.clientX, e.clientY);
            // to do //
            //console.log("Mouse Pos:", e.clientX, e.clientY);
            //console.log("Mouse Pos:", posNp);
            x_prev=e.clientX;
            y_prev=e.clientY;
        }
    }
    else if(e.pointerType=='touch'){
        console.log('pointerMove',e);
        // e.target.style.border="dashed";

        //이 이벤트를 캐시에서 찾은 후 이 이벤트와 함께 record 갱신
        for (var i=0; i<evCache.length; i++){
            if(e.pointerId==evCache[i].pointerId){
                evCache[i]=e;
                break;
            }
        }

        if(evCache.length==1){
            //to do//
            let posNp=compute_pos_ss2ws(e.clientX,e.clientY);
            console.log("Mouse Pos:", posNp);
            x_prev=e.clientX;
            y_prev=e.clientY;
        }

    //2개의 포인터가 down이면, check for pinch gestures
        else if(evCache.length==2){
            console.log("Pinch moving");
            //2 포인터 간 거리 계산 및 선언
            var curDiff=Math.abs(evCache[0].clientX-evCache[1].clientX);

            if(prevDiff>0){
                if(curDiff>prevDiff){
                    //2 포인터 간 거리는 증가 됨
                    console.log("Pinch moving OUT -> Zoom in",e);
                    camera.near+=2.0;
                    camera.near=Math.min(camera_ar.near, camera_ar,far);
                    camera.updateProjectionMatrix();
                }
                if(curDiff<prevDiff){
                    //2 포인터 간 거리는 감소 됨
                    console.log("Pinch moving IN -> Zoom out",e);
                    camera.near -=2.0;
                    camera.near=Math.max(camera_ar.near,1.0);
                    camera.updateProjectionMatrix();
                }
            }
            //다음 move 이벤트에 대해 거리 cache
            prevDiff=curDiff;
        }
        //이벤트를 명시적 처리하지 않은 경우, 해당 이벤트에 대한 사용자의 기본 동작 실행 x도록 지정
        e.preventDefault();
    }
}
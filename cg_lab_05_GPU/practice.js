import * as THREE from "three";

let camera,scene,renderer;
let uniforms, myTex; 

init();
animate();

function init(){

    const container = document.getElementById("container");

    // create my world (scene)
    scene = new THREE.Scene();

    // camera setting
    camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0.5, 1);
    
    // camera.position.set(0, 0, 20);
    // camera.up.set(0, 1, 0);
    // camera.lookAt(0, 0, 0);
    // camera.matrixAutoUpdate = false;

    // const myLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    // myLight.position.set(0, 0, 100);
    // myLight.target.position.set( 0, 0, 0 );
    // myLight.name = "myLight";
    // scene.add(myLight);

    // const ambLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    // scene.add( ambLight );

    // geometry setting
    const geometry = new THREE.PlaneGeometry(2,2);

    // https://threejs.org/docs/index.html?q=texture#api/en/textures/Texture 
    const textureLoader = new THREE.TextureLoader();
    var myTex = textureLoader.load( './lab5.jpg' );
    myTex.magFilter=THREE.LinearFilter;

    var loader=new THREE.TextureLoader();
    loader.load( './lab5.jpg', function(texture){
        console.log('Texture dimensions: %sx%s', texture.image.width, texture.image.height );
        myTex=texture;
        console.log(myTex.image);
    });
    console.log(myTex);
    //myTex.minFilter = THREE.NearestFilter;

    // material setting
    //const material = new THREE.MeshBasicMaterial({ wireframe: true });
    // const material = new THREE.MeshPhongMaterial( { color: 0xffffff, wireframe: false, flatShading: true } );
    uniforms = {//global variable 
        time: { value: 1.0 },
        myTexImg: {value:myTex},//이거 안 넣으면 txt Mapping 사진으로 안 됨
        bufferSize:{value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
        imgSize:{value: myTex!=null? new THREE.Vector2(myTex.width,myTex.height):null}
        //null 여부(load 됐는가) 체크 후 imgSize 대입
        //imgSize: {value: null}
        // myTestParam:{value:1765},  //html에 uniform 추가
        // myTestVec3:{value:new THREE.Vector3(0,1,0)},
        // // modelViewMatrix: {value:cube.modelViewMatrix} //built-in
        // modelMat: {value: new THREE.Matrix4()},
        // myAmb:{value:}
    };

    //THREE.UniformsLib
    const material = new THREE.ShaderMaterial( {
        uniforms:uniforms,
        //map:
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        // side: THREE.DoubleSide,
        // transparent: true
    } );

    const mesh= new THREE.Mesh(geometry,material);
    scene.add(mesh);

     // renderer setting
     renderer = new THREE.WebGLRenderer();
     renderer.setSize(window.innerWidth, window.innerHeight);
     renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
     renderer.setPixelRatio(window.devicePixelRatio);
     container.appendChild(renderer.domElement);
 
     onWindowResize();
     window.addEventListener('resize',onWindowResize);
}

function onWindowResize(){
    renderer.setSize(window.innerWidth, window.innerHeight);}

function animate(){
    requestAnimationFrame(animate);
    //console.log(performance.now());
    uniforms['time'].value=performance.now()/1000;
    uniforms['myTexImg'].value=myTex;
    //if(myTex.image != null)
    //console.log(myTex.image);
    uniforms['imgSize'].value=myTex!=null? new THREE.Vector2(myTex.width, myTex.height):
    new THREE.Vector2(0,0);
    renderer.render(scene,camera);
};
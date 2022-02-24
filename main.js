import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';


// Array of font.json url
let json_fonts = [
    './fonts/HappyZcool-2016_Regular.json',
    './fonts/TsangerYuYangT W03_Regular.json',
    './fonts/xiaowei_Regular.json',
    './fonts/ZCOOL Addict Italic 02_Italic.json',
    './fonts/ZCOOL_KuHei_Regular.json',
    './fonts/zcool-gdh_Regular.json',
    './fonts/zcoolqingkehuangyouti_Regular.json',
    './fonts/zcoolwenyiti_Regular.json',
];


//canvas size
let canvas_w = window.innerWidth * 0.7;
let canvas_h = window.innerHeight * 0.9;

//*****************************************
//
let spotLight;
const lightControls = {
    light_x: 0,
    light_y: 50,
    light_z: 250,
    light_color: 0xffffff
}

let planeGeometry,
    planeMaterial,
    plane,
    planeColor = 0xcccccc,
    planeShadow = true;


let text3d = {
    content: '3D字体',
    text_url: json_fonts[0],
    size: 20,
    height: 10,
    curveSegments: 20,
    bevelEnabled: true,
    bevelThickness: 1.2,
    bevelSize: 1,
    bevelOffset: 0,
    bevelSegments: 10,
    color1: 0x3ca23c,
    color2: 0xb7c5b7,
}

let geometry;
let mesh;
let material1 = new THREE.MeshLambertMaterial({ color: text3d.color1 });
let material2 = new THREE.MeshLambertMaterial({ color: text3d.color2 });
const loader = new FontLoader();


//
// *******************************************


//scene
let scene = new THREE.Scene();
scene.background = null;

//camera
const camera = new THREE.PerspectiveCamera(50, canvas_w / canvas_h, 1, 1000);
camera.position.set(0, 0, 150);
camera.lookAt(scene.position);

//renderer
let renderer = new THREE.WebGLRenderer({
    alpha: true
});
// renderer.setClearColor(0x000000);
renderer.setSize(canvas_w, canvas_h);
renderer.shadowMap.enabled = true;


//light

updateLight();

function updateLight() {

    let spotLightObj = scene.getObjectByName('spotLight');
    if (spotLightObj) {
        scene.remove(spotLightObj);
    }

    spotLight = new THREE.SpotLight(new THREE.Color(lightControls.light_color));
    spotLight.position.set(lightControls.light_x, lightControls.light_y, lightControls.light_z);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048 * 2;
    spotLight.shadow.mapSize.height = 2048 * 2;
    spotLight.name = 'spotLight';
    scene.add(spotLight);
}

const ambientLight = new THREE.AmbientLight(0x3c3c3c);
scene.add(ambientLight);


//plane 
updatePlane();

function updatePlane() {
    let planeObj = scene.getObjectByName('plane_object');
    if (planeObj) {
        scene.remove(planeObj);
    }
    planeGeometry = new THREE.PlaneGeometry(600, 400);
    planeMaterial = new THREE.MeshLambertMaterial({
        color: planeColor,
        side: 2,
        // transparent: false,
        // opacity: 0,
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // plane.translateZ(-20)
    plane.receiveShadow = planeShadow;
    plane.name = 'plane_object';
    scene.add(plane);
}


//3d text
updateText();

function updateText() {
    let lastMesh = scene.getObjectByName('text3d');
    if (lastMesh) {
        scene.remove(lastMesh);
    }

    loader.load(text3d.text_url, function (font) {
        geometry = new TextGeometry(text3d.content, {
            font: font,
            size: text3d.size,
            height: text3d.height,
            curveSegments: text3d.curveSegments,
            bevelEnabled: text3d.bevelEnabled,
            bevelThickness: text3d.bevelThickness,
            bevelSize: text3d.bevelSize,
            bevelOffset: text3d.bevelOffset,
            bevelSegments: text3d.bevelSegments
        });

        mesh = new THREE.Mesh(geometry, [material1, material2]);
        mesh.position.set(-0.5 * text3d.size * text3d.content.length, -0.5 * text3d.size, 0)
        mesh.castShadow = true;
        mesh.name = 'text3d';

        scene.add(mesh)
    })
}


const orbitControls = new OrbitControls(camera, renderer.domElement);

document.querySelector('.canvas').append(renderer.domElement);

//
render();

function render() {
    renderer.render(scene, camera)

    orbitControls.update();

    requestAnimationFrame(render);
}


//get dom
const text_content = document.querySelector('#text_content');
const colorPicker_light = document.querySelector('.colorPicker_light');
const light_pos_x = document.querySelector('#light_pos_x');
const light_pos_y = document.querySelector('#light_pos_y');
const light_pos_z = document.querySelector('#light_pos_z');
const colorPicker_bg = document.querySelector('.colorPicker_bg');
const shadow_check = document.querySelector('.shadow_check');
const transparent_check = document.querySelector('.transparent_check');
const font_style = document.querySelector('#font_style');
const colorPicker_text1 = document.querySelector('.colorPicker_text1');
const colorPicker_text2 = document.querySelector('.colorPicker_text2');
const sizeObj = document.querySelector('#size_control');
const heightObj = document.querySelector('#height_control');
const bevelThicknessObj = document.querySelector('#bevelThickness_control');
const bevelSizeObj = document.querySelector('#bevelSize_control');
const bevelSegmentsObj = document.querySelector('#bevelSegments_control');
const bevelOffsetObj = document.querySelector('#bevelOffset_control');
const singlePara_values = document.querySelectorAll('.singlePara_value');

// singlePara_values[0].value = lightControls.light_color;
singlePara_values[1].value = lightControls.light_x;
singlePara_values[2].value = lightControls.light_y;
singlePara_values[3].value = lightControls.light_z;
singlePara_values[10].value = text3d.size;
singlePara_values[11].value = text3d.height;
singlePara_values[12].value = text3d.bevelThickness;
singlePara_values[13].value = text3d.bevelSize;
singlePara_values[14].value = text3d.bevelSegments;
singlePara_values[15].value = text3d.bevelOffset;

//输入文字
text_content.onchange = (e) => {
    text3d.content = e.target.value;
    updateText();
}

//灯光设置
colorPicker_light.onchange = (e) => {
    lightControls.light_color = e.target.value;
    singlePara_values[0].value = lightControls.light_color;
    updateLight();
}

light_pos_x.onchange = (e) => {
    lightControls.light_x = e.target.value;
    singlePara_values[1].value = lightControls.light_x;
    updateLight();
}

light_pos_y.onchange = (e) => {
    lightControls.light_y = e.target.value;
    singlePara_values[2].value = lightControls.light_y;
    updateLight();
}

light_pos_z.onchange = (e) => {
    lightControls.light_z = e.target.value;
    singlePara_values[3].value = lightControls.light_z;
    updateLight();
}


//背景设置
colorPicker_bg.onchange = (e) => {
    planeColor = e.target.value;
    updatePlane();
}

shadow_check.onchange = (e) => {
    planeShadow = e.target.checked;
    updatePlane();
}

transparent_check.onchange = (e) => {
    if (e.target.checked) {
        updatePlane();
        let planeObj = scene.getObjectByName('plane_object');
        if (planeObj) {
            scene.remove(planeObj);
        }
    } else {
        updatePlane();
    }
}

//3D设置
font_style.onchange = (e) => {
    console.log(e.target.value);
    switch (e.target.value) {
        case 'font_0': text3d.text_url = json_fonts[0]; break;
        case 'font_1': text3d.text_url = json_fonts[1]; break;
        case 'font_2': text3d.text_url = json_fonts[2]; break;
        case 'font_3': text3d.text_url = json_fonts[3]; break;
        case 'font_4': text3d.text_url = json_fonts[4]; break;
        case 'font_5': text3d.text_url = json_fonts[5]; break;
        case 'font_6': text3d.text_url = json_fonts[6]; break;
        case 'font_7': text3d.text_url = json_fonts[7];
    }

    console.log(text3d.text_url)

    updateText();
}


colorPicker_text1.onchange = (e) => {
    text3d.color1 = e.target.value;
    material1 = new THREE.MeshLambertMaterial({ color: text3d.color1 });
    updateText();
}

colorPicker_text2.onchange = (e) => {
    text3d.color2 = e.target.value;
    material2 = new THREE.MeshLambertMaterial({ color: text3d.color2 });
    updateText();
}




sizeObj.onchange = (e) => {
    text3d.size = e.target.value;
    singlePara_values[10].value = text3d.size;
    updateText();
}

heightObj.onchange = (e) => {
    text3d.height = e.target.value;
    singlePara_values[11].value = text3d.height;
    updateText();
}

bevelThicknessObj.onchange = (e) => {
    text3d.bevelThickness = e.target.value;
    singlePara_values[12].value = text3d.bevelThickness;
    updateText();
}

bevelSizeObj.onchange = (e) => {
    text3d.bevelSize = e.target.value;
    singlePara_values[13].value = text3d.bevelSize;
    updateText();
}

bevelSegmentsObj.onchange = (e) => {
    text3d.bevelSegments = e.target.value;
    singlePara_values[14].value = text3d.bevelSegments;
    updateText();
}

bevelOffsetObj.onchange = (e) => {
    text3d.bevelOffset = e.target.value;
    singlePara_values[15].value = text3d.bevelOffset;
    updateText();
}





//sava button
const saveBtn = document.querySelector('.saveBtn');
const prevBtn = document.querySelector('.prevBtn');
saveBtn.addEventListener('click', takeScreenshot);
prevBtn.addEventListener('click', onpenNewTab);

function takeScreenshot() {
    // For screenshots to work with WebGL renderer, preserveDrawingBuffer should be set to true.
    render();

    // download file like this.
    var a = document.createElement('a');
    a.href = renderer.domElement.toDataURL().replace("image/png", "image/octet-stream");
    a.download = text3d.content + '.png';
    a.click();
}

function onpenNewTab() {
    // For screenshots to work with WebGL renderer, preserveDrawingBuffer should be set to true.
    render();
    // open in new window like this
    var w = window.open('', '');
    w.document.title = text3d.content + '_预览';
    //w.document.body.style.backgroundColor = "red";
    var img = new Image();
    img.src = renderer.domElement.toDataURL();
    w.document.body.appendChild(img);
}


//resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    canvas_w = window.innerWidth * 0.7;
    canvas_h = window.innerHeight * 0.9;

    camera.aspect = canvas_w / canvas_h;
    camera.updateProjectionMatrix();

    renderer.setSize(canvas_w, canvas_h);
}

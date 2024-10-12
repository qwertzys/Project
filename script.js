import * as THREE from "./threejs/build/three.module.js";
import {OrbitControls} from "./threejs/examples/jsm/controls/OrbitControls.js";

var scene, freeCamera, thirdCamera, renderer, control;

const init = () => {
    scene = new THREE.Scene();
    freeCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    freeCamera.position.set(new THREE.Vector3(640, 480, 240)); //640, 480, 240

    thirdCamera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 10000);
    // thirdCamera.position.set() // Spaceship Vector3(x, y + 16, z-16);

    renderer = new THREE.WebGLRenderer({
        shadowMap: THREE.PCFShadowMap,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor("#EEEEEE");
    document.body.appendChild(renderer.domElement);
    
    control = new OrbitControls(freeCamera, renderer.domElement);
}

const createObject = () => {
    // Sun: Rad 40, Color #FFFFFF, Position Vector3(640, 320, 0), Cast Shadow False, Receive Shadow False
    let sun = createSun(40, new THREE.TextureLoader().load('assets/textures/sun.jpg'));
    sun.position.set(new THREE.Vector3(640, 320, 0));

    // Mercury: Rad 3.2, Color #FFFFFF, Position Vector3(58, 320, 0), Cast Shadow True, Receive Shadow True
    // let mercury = createSphere(3.2, "#FFFFFF");
    // mercury.position.set(THREE.Vector3(58, 320, 0));

    // Venus: Rad 4.8, Color #FFFFFF, Position Vector3(80, 320, 0), Cast Shadow True, Receive Shadow True
    // let venus = createSphere(4.8, "FFFFFF");
    // venus.position.set(THREE.Vector3(80, 320, 0));
    
    // Earth: Rad 4.8, Color #FFFFFF, Position Vector3(100, 320, 0), Cast Shadow True, Receive Shadow True
    // let earth = createSphere(4.8, "#FFFFFF");
    // earth.position.set(THREE.Vector3(100, 320, 0));

    // Mars: Rad 4, Color #FFFFFF, Position Vector3(130, 320, 0), Cast Shadow True, Receive Shadow True
    // let mars = createSphere(4, "#FFFFFF");
    // mars.position.set(THREE.Vector3(130, 320, 0));

    // Jupiter: Rad 13, Color #FFFFFF, Position Vector3(175, 320, 0), Cast Shadow True, Receive Shadow True
    // let jupiter = createSphere(13, "#FFFFFF");
    // jupiter.position.set(THREE.Vector3(175, 320, 0));

    // Saturn: Rad 10, Color #FFFFFF, Position Vector3(240, 320, 0), Cast Shadow True, Receive Shadow True
    // let saturn = createSphere(10, "#FFFFFF");
    // saturn.position.set(THREE.Vector3(240, 320, 0));

    // Saturn Ring: inRad 16, outRad 32, thetaSeg 64, Color #FFFFFF, Position Vector3(240, 320, 0), Cast Shadow False Receive Shadow True
    // let saturnRing = createRing(16, 32, 64, "#FFFFFF");
    // saturnRing.position.set(THREE.Vector3(280, 320, 0));

    // Uranus: Rad 8, Color #FFFFFF, Position Vector3(280, 320, 0), Cast Shadow True, Receive Shadow True
    // let uranus = createSphere(8, "#FFFFFF");
    // uranus.position.set(THREE.Vector3(280, 320, 0));

    // Uranus Ring: inRad 16, outRad 20, thetaSeg 64, Color #FFFFFF, Position Vector3(280, 320, 0), Cast Shadow False Receive Shadow True
    // let uranusRing = createRing(16, 20, 64, "#FFFFFF");
    // uranusRing.position.set(THREE.Vector3(280, 320, 0));

    // Neptune: Rad 6, Color #FFFFFF, Position Vector3(320, 320, 0), Cast Shadow True, Receive Shadow True
    // let neptune = createSphere(6, "#FFFFFF");
    // neptune.position.set(THREE.Vector3(320, 320, 0));


    // Satelite: radTop 1, radBot 0.5, Height 0.4, radSeg 8, Color #CCCCCC, Metalness 0.5, Roughness 0.5, Position (100 + 8, 320, 0), Cast Shadow False, Receive Shadow True
    // let satelite = createCylinder(1, 0.5, 4, 8, "#CCCCCC");
    // satelite.position.set(108, 320, 0);

    let objects = [
        sun
    ];

    objects.forEach((obj) => {
        scene.add(obj);
    });

}

const createSun = (rad, texture) => {
    let geometry = new THREE.SphereGeometry(rad);
    let material = new THREE.MeshBasicMaterial({
        map: texture
    });

    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

const createSphere = (rad, color) => {
    let geometry = new THREE.SphereGeometry(rad);
    let material = new THREE.MeshStandardMaterial({
        color: color
    });

    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
}


const createRing = (inRad, outRad, thetaSeg, color) => {
    let geometry = new THREE.RingGeometry(inRad, outRad, thetaSeg);
    let material = new THREE.MeshStandardMaterial({
        color: color
    });

    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

const createCylinder = () => {
    let geometry = new THREE.CylinderGeometry(radTop, radBot, height, radSeg, color);
    let material = new THREE.MeshStandardMaterial({
        color: color
    });

    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
}


const render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, freeCamera);
    control.update();
}

window.onload = () => {
    init();
    createObject();
    render();
}

window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    freeCamera.aspect = window.innerWidth/window.innerHeight;
    freeCamera.updateProjectionMatrix();
}
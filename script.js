import * as THREE from "./threejs/build/three.module.js";
import {OrbitControls} from "./threejs/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "./threejs/examples/jsm/loaders/GLTFLoader.js";

var scene, freeCamera, thirdCamera, renderer, control;

const init = () => {
    scene = new THREE.Scene();

    freeCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    freeCamera.position.set(640, 480, 240); //640, 480, 240

    thirdCamera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 10000);
    // thirdCamera.position.set() // Spaceship Vector3(x, y + 16, z-16);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    
    control = new OrbitControls(freeCamera, renderer.domElement);
    
    createObject();
    createSpaceShip();

}

const createObject = () => {

    // Spaceship
    // let spaceshipLoader = new GLTFLoader();
    // let spaceship = spaceshipLoader.load("./assets/model/spaceship/scene.gltf");


    // Point Light
    let pointLight = new THREE.PointLight("#FFFFFF", 1, 1280);
    pointLight.castShadow = true;
    pointLight.position.set(640, 320, 0);
    // Sun: Rad 40, Color #FFFFFF, Position Vector3(640, 320, 0), Cast Shadow False, Receive Shadow False


    let sun = createSun(40, "#FFFFFF");
    sun.position.set(640, 320, 0);

    // Mercury: Rad 3.2, Color #FFFFFF, Position Vector3(58, 320, 0), Cast Shadow True, Receive Shadow True
    let mercuryLoader = new THREE.TextureLoader();
    let mercuryImg = mercuryLoader.load("./assets/textures/mercury.jpg");
    let mercury = createSphere(3.2, "#FFFFFF", mercuryImg);
    mercury.position.set(58, 320, 0);

    // Venus: Rad 4.8, Color #FFFFFF, Position Vector3(80, 320, 0), Cast Shadow True, Receive Shadow True
    let venusLoader = new THREE.TextureLoader();
    let venusImg = venusLoader.load("./assets/textures/venus.jpg");
    let venus = createSphere(4.8, "#FFFFFF", venusImg);
    venus.position.set(80, 320, 0);
    
    // Earth: Rad 4.8, Color #FFFFFF, Position Vector3(100, 320, 0), Cast Shadow True, Receive Shadow True
    let earthLoader = new THREE.TextureLoader();
    let earthImg = earthLoader.load("./assets/textures/earth.jpg");
    let earth = createSphere(4.8, "#FFFFFF", earthImg);
    earth.position.set(100, 320, 0);

    // Mars: Rad 4, Color #FFFFFF, Position Vector3(130, 320, 0), Cast Shadow True, Receive Shadow True
    let marsLoader = new THREE.TextureLoader();
    let marsImg = marsLoader.load("./assets/textures/mars.jpg");
    let mars = createSphere(4, "#FFFFFF", marsImg);
    mars.position.set(130, 320, 0);

    // Jupiter: Rad 13, Color #FFFFFF, Position Vector3(175, 320, 0), Cast Shadow True, Receive Shadow True
    let jupiterLoader = new THREE.TextureLoader();
    let jupiterImg = jupiterLoader.load("./assets/textures/jupiter.jpg");
    let jupiter = createSphere(13, "#FFFFFF", jupiterImg);
    jupiter.position.set(175, 320, 0);

    // Saturn: Rad 10, Color #FFFFFF, Position Vector3(240, 320, 0), Cast Shadow True, Receive Shadow True
    let saturnLoader = new THREE.TextureLoader();
    let saturnImg = saturnLoader.load("./assets/textures/saturn.jpg");
    let saturn = createSphere(10, "#FFFFFF", saturnImg);
    saturn.position.set(240, 320, 0);

    // Saturn Ring: inRad 16, outRad 32, thetaSeg 64, Color #FFFFFF, Saturn's Position Vector3(240, 320, 0), Cast Shadow False Receive Shadow True
    // let saturnRingLoader = new THREE.TextureLoader();
    // let saturnRingImg = saturnRingLoader.load("./assets/textures/saturn_ring.jpg");
    // let saturnRing = createRing(16, 32, 64, "#FFFFFF", saturnRingImg);
    // saturnRing.position.set(280, 320, 0);

    // Uranus: Rad 8, Color #FFFFFF, Position Vector3(280, 320, 0), Cast Shadow True, Receive Shadow True
    let uranusLoader = new THREE.TextureLoader();
    let uranusImg = uranusLoader.load("./assets/textures/uranus.jpg");
    let uranus = createSphere(8, "#FFFFFF", uranusImg);
    uranus.position.set(280, 320, 0);

    // Uranus Ring: inRad 16, outRad 20, thetaSeg 64, Color #FFFFFF, Uranus Position Vector3(280, 320, 0), Cast Shadow False Receive Shadow True
    // let uranusRing = createRing(16, 20, 64, "#FFFFFF");
    // uranusRing.position.set(THREE.Vector3(280, 320, 0));

    // Neptune: Rad 6, Color #FFFFFF, Position Vector3(320, 320, 0), Cast Shadow True, Receive Shadow True
    let neptuneLoader = new THREE.TextureLoader();
    let neptuneImg = neptuneLoader.load("./assets/textures/neptune.jpg");
    let neptune = createSphere(6, "#FFFFFF", neptuneImg);
    neptune.position.set(320, 320, 0);


    // Satelite: radTop 1, radBot 0.5, Height 0.4, radSeg 8, Color #CCCCCC, Metalness 0.5, Roughness 0.5, Position (100 + 8, 320, 0), Cast Shadow False, Receive Shadow True
    let satelite = createCylinder(1, 0.5, 4, 8, "#CCCCCC", 0.5, 0.5);
    satelite.position.set(108, 320, 0);

    let objects = [
        pointLight,
        sun,
        mercury,
        venus,
        earth,
        mars,
        jupiter,
        saturn,
        uranus,
        neptune,
        satelite
    ];

    objects.forEach((obj) => {
        scene.add(obj);
    });

}

const createSun = (rad, color) => {
    let loader = new THREE.TextureLoader();
    let image = loader.load("./assets/textures/sun.jpg");
    let geometry = new THREE.SphereGeometry(rad);
    let material = new THREE.MeshBasicMaterial({
        color: color,
        map: image
    });

    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

const createSphere = (rad, color, img) => {
    let geometry = new THREE.SphereGeometry(rad);
    let material = new THREE.MeshStandardMaterial({
        color: color,
        map: img
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}


const createRing = (inRad, outRad, thetaSeg, color, img) => {
    let geometry = new THREE.RingGeometry(inRad, outRad, thetaSeg);
    let material = new THREE.MeshStandardMaterial({
        color: color,
        map: img
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    return mesh;
}

const createCylinder = (radTop, radBot, height, radSeg, color, metalness, roughness) => {
    let geometry = new THREE.CylinderGeometry(radTop, radBot, height, radSeg);
    let material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: metalness,
        roughness: roughness
    });

    let mesh = new THREE.Mesh(geometry, material);  
    mesh.receiveShadow = false;
    mesh.receiveShadow = true;
    return mesh;
}

const createBox = () => {
    let geometry = new THREE.BoxGeometry(width, height, depth)
    let material = new THREE.MeshStandardMaterial({
        color: color
    });

    let mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

const createSpaceShip = () => {
    const loader = new THREE.TextureLoader();
    
    // Load textures
    const baseColor = loader.load('./assets/model/spaceship/textures/BASE_baseColor.png');
    const emissive = loader.load('./assets/model/spaceship/textures/BASE_emissive.png');
    const metallicRoughness = loader.load('./assets/model/spaceship/textures/BASE_metallicRoughness.png');
    const normalMap = loader.load('./assets/model/spaceship/textures/BASE_normal.png');

    // Define material with textures
    const material = new THREE.MeshStandardMaterial({
        map: baseColor,
        emissiveMap: emissive,
        emissiveIntensity: 1,
        metalnessMap: metallicRoughness,
        normalMap: normalMap,
        doubleSide: THREE.DoubleSide,
    });

    // Load GLTF model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./assets/model/spaceship/scene.gltf', (gltf) => {
        const spaceship = gltf.scene;

        // Apply material to the spaceship meshes
        spaceship.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Position and scale the spaceship
        spaceship.position.set(110, 320, 0);  // Adjust as needed
        spaceship.scale.set(5, 5, 5);      // Adjust scale if the spaceship is too small

        // Add spaceship to the scene
        scene.add(spaceship);
    });
};


const render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, freeCamera);
    control.update();
}

window.onload = () => {
    init();
    // createObject();
    render();
}

window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    freeCamera.aspect = window.innerWidth/window.innerHeight;
    freeCamera.updateProjectionMatrix();
}

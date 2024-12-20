import * as THREE from "./threejs/build/three.module.js";
import {OrbitControls} from "./threejs/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "./threejs/examples/jsm/loaders/GLTFLoader.js";
import { FontLoader } from "./threejs/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "./threejs/examples/jsm/geometries/TextGeometry.js"

var scene, freeCamera, thirdCamera, selectedCamera, renderer, control;
var planetGroup, planets, planetAngles, planetSpeeds, planetDelays;
var sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, satelite;
var earthGroup, saturnGroup, uranusGroup;
var text, textList;
var startTime = Date.now();
var spaceship;
var spaceshipSpeed = 1;
var rotationSpeed = 0.05;
var spaceshipVelocity = new THREE.Vector3(0, 0, 0);
var spotLight, spotLightTarget;



const init = () => {
    scene = new THREE.Scene();

    freeCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
    freeCamera.position.set(640, 480, 240); //640, 480, 240

    thirdCamera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 10000);
    thirdCamera.position.set(110, 336, -16) // Spaceship Vector3(x, y + 16, z-16);

    selectedCamera = freeCamera;

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    
    control = new OrbitControls(freeCamera, renderer.domElement);
    
    createObject();
    createSpaceShip();
    createSkybox();
}

const createObject = () => {
    // Point Light
    let pointLight = new THREE.PointLight("#FFFFFF", 1, 1280);
    pointLight.castShadow = true;
    pointLight.position.set(640, 320, 0);
    // Spotlight
    spotLight = new THREE.SpotLight("#FFFFFF", 8, 8);
    spotLight.castShadow = false;
    spotLight.position.set(110, 326, 0) // Spaceship Vector3(x, y+6, z)

    // Spotlight target (to make it follow the spaceship)
    spotLightTarget = new THREE.Object3D();
    spotLightTarget.position.set(0, 0, 0);
    scene.add(spotLightTarget);
    spotLight.target = spotLightTarget;
    
    // Sun: Rad 40, Color #FFFFFF, Position Vector3(640, 320, 0), Cast Shadow False, Receive Shadow False
    sun = createSun(40, "#FFFFFF");
    sun.position.set(640, 320, 0);
    sun.name = "Sun";
    

    // Mercury: Rad 3.2, Color #FFFFFF, Position Vector3(58, 320, 0), Cast Shadow True, Receive Shadow True
    let mercuryLoader = new THREE.TextureLoader();
    let mercuryImg = mercuryLoader.load("./assets/textures/mercury.jpg");
    mercury = createSphere(3.2, "#FFFFFF", mercuryImg);
    mercury.position.set(58, 320, 0);
    mercury.name = "Mercury";

    // Venus: Rad 4.8, Color #FFFFFF, Position Vector3(80, 320, 0), Cast Shadow True, Receive Shadow True
    let venusLoader = new THREE.TextureLoader();
    let venusImg = venusLoader.load("./assets/textures/venus.jpg");
    venus = createSphere(4.8, "#FFFFFF", venusImg);
    venus.position.set(80, 320, 0);
    venus.name = "Venus";
    
    // Earth: Rad 4.8, Color #FFFFFF, Position Vector3(100, 320, 0), Cast Shadow True, Receive Shadow True
    let earthLoader = new THREE.TextureLoader();
    let earthImg = earthLoader.load("./assets/textures/earth.jpg");
    earth = createSphere(4.8, "#FFFFFF", earthImg);
    earth.position.set(0, 0, 0);
    earth.name = "Earth";


    // Mars: Rad 4, Color #FFFFFF, Position Vector3(130, 320, 0), Cast Shadow True, Receive Shadow True
    let marsLoader = new THREE.TextureLoader();
    let marsImg = marsLoader.load("./assets/textures/mars.jpg");
    mars = createSphere(4, "#FFFFFF", marsImg);
    mars.position.set(130, 320, 0);
    mars.name = "Mars";

    // Jupiter: Rad 13, Color #FFFFFF, Position Vector3(175, 320, 0), Cast Shadow True, Receive Shadow True
    let jupiterLoader = new THREE.TextureLoader();
    let jupiterImg = jupiterLoader.load("./assets/textures/jupiter.jpg");
    jupiter = createSphere(13, "#FFFFFF", jupiterImg);
    jupiter.position.set(175, 320, 0);
    jupiter.name = "Jupiter";

    // Saturn: Rad 10, Color #FFFFFF, Position Vector3(240, 320, 0), Cast Shadow True, Receive Shadow True
    let saturnLoader = new THREE.TextureLoader();
    let saturnImg = saturnLoader.load("./assets/textures/saturn.jpg");
    saturn = createSphere(10, "#FFFFFF", saturnImg);
    saturn.position.set(0, 0, 0);
    

    // Saturn Ring: inRad 16, outRad 32, thetaSeg 64, Color #FFFFFF, Saturn's Position Vector3(240, 320, 0), Cast Shadow False Receive Shadow True
    let saturnRingLoader = new THREE.TextureLoader();
    let saturnRingImg = saturnRingLoader.load("./assets/textures/saturn_ring.png");
    let saturnRing = createRing(16, 32, 64, "#FFFFFF", saturnRingImg);
    saturnRing.position.set(0, 0, 0);
    saturnRing.rotation.x = Math.PI / 2; // Rotate to align with the XZ plane

    //Group Saturn and its RIng
    saturnGroup = new THREE.Group();
    saturnGroup.add(saturn, saturnRing);
    saturnGroup.position.set(240, 320, 0);
    saturnGroup.name = "Saturn";

    // Uranus: Rad 8, Color #FFFFFF, Position Vector3(280, 320, 0), Cast Shadow True, Receive Shadow True
    let uranusLoader = new THREE.TextureLoader();
    let uranusImg = uranusLoader.load("./assets/textures/uranus.jpg");
    uranus = createSphere(8, "#FFFFFF", uranusImg);
    uranus.position.set(0, 0, 0);
     

    // Uranus Ring: inRad 16, outRad 20, thetaSeg 64, Color #FFFFFF, Uranus Position Vector3(280, 320, 0), Cast Shadow False Receive Shadow True
    let uranusRingLoader = new THREE.TextureLoader();
    let uranusRingImg = uranusRingLoader.load("./assets/textures/uranus_ring.png");
    let uranusRing = createRing(16, 20, 64, "#FFFFFF", uranusRingImg);
    uranusRing.position.set(0, 0, 0);
    uranusRing.rotation.x = Math.PI / 2; // Rotate to align with the XZ plane
    
    //Group Uranus and its RIng
    uranusGroup = new THREE.Group();
    uranusGroup.add(uranus, uranusRing);
    uranusGroup.position.set(280, 320, 0);
    uranusGroup.name = "Uranus";

    // Neptune: Rad 6, Color #FFFFFF, Position Vector3(320, 320, 0), Cast Shadow True, Receive Shadow True
    let neptuneLoader = new THREE.TextureLoader();
    let neptuneImg = neptuneLoader.load("./assets/textures/neptune.jpg");
    neptune = createSphere(6, "#FFFFFF", neptuneImg);
    neptune.position.set(320, 320, 0);
    neptune.name = "Neptune";   

    // Satelite: radTop 1, radBot 0.5, Height 0.4, radSeg 8, Color #CCCCCC, Metalness 0.5, Roughness 0.5, Position (100 + 8, 320, 0), Cast Shadow False, Receive Shadow True
    satelite = createCylinder(1, 0.5, 4, 8, "#CCCCCC", 0.5, 0.5);
    satelite.position.set(10, 0, 0);

    //Group Earth and Satelite
    earthGroup = new THREE.Group();
    earthGroup.add(earth, satelite);
    earthGroup.position.set(100, 320, 0);

    //AmbientLight
    let ambientLight = new THREE.AmbientLight("#FFFFFF", 0.09);

    

    // Add All Planets (including its ring) into a group for rotation that will be applied in a different function
    planetGroup = new THREE.Group();
    planetGroup.add(mercury, venus, earthGroup, mars, jupiter, saturnGroup, uranusGroup, neptune);
    planetGroup.position.set(640, 0, 0); // To make all planets rotate AROUND the sun

    planetDelays = [0, 500, 1000, 1500, 2000, 2500, 2500, 3000, 3000, 3500];
    planetSpeeds = [0.009, 0.008, 0.007, 0.006, 0.005, 0.004, 0.003, 0.002, 0.001];
    planetAngles = Array(planetSpeeds.length).fill(0); //starting angles

    //Access the planets in group individually
    planets = [mercury, venus, earthGroup, mars, jupiter, saturnGroup, uranusGroup, neptune];




    // Text
    text = [
        // Sun
        {
            text: "Sun",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(640, 330, 0)
        },

        // Mercury,
        {
            text: "Mercury",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(58, 330, 0)
        },
        
        // Venus
        {
            text: "Venus",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(80, 330, 0)
        },
        
        // Earth
        {
            text: "Earth",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(100, 330, 0)
        },
        
        // Mars
        {
            text: "Mars",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(130, 330, 0)
        },
        
        // Jupiter
        {
            text: "Jupiter",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(175, 330, 0)
        },
        
        // Saturn
        {
            text: "Saturn",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(240, 330, 0)
        },
        
        // Uranus
        {
            text: "Uranus",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(280, 330, 0)
        },
        
        // Neptune
        {
            text: "Sun",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(320, 330, 0)
        },

        // Satelite
        {
            text: "Satelite",
            size: 5,
            height: 1,
            pos: new THREE.Vector3(108, 330, 0)
        }
    ];

    textList = new THREE.Group();

    text.forEach((t) => {
        createText(t.text, t.size, t.height, t.pos);
    });

    let objects = [
        pointLight,
        spotLight,
        sun,
        planetGroup,
        ambientLight,
        textList,
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
        map: img,
        side: THREE.DoubleSide,
    });

    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI / 2; // Rotate the ring to align with the XZ plane
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

const createText = (text, size, height, pos) => {
    let loader = new FontLoader();

    loader.load("./threejs/examples/fonts/helvetiker_regular.typeface.json", (font) => {
        let geometry = new TextGeometry(text, {
            font: font,
            size: size,
            height: height
        });

        geometry.center();

        let material = new THREE.MeshBasicMaterial({
            color: "White",
            opacity: 1
        });

        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(pos);

        // Atur teks menjadi tidak terlihat pada awalnya
        mesh.visible = false;

        // Simpan teks ke dalam group
        textList.add(mesh);

        // Simpan referensi teks ke objek utama (untuk kontrol raycasting)
        mesh.name = text; // Menyimpan nama untuk referensi hover
        textMeshes[text] = mesh; // Masukkan ke objek referensi
    });
};

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
        side: THREE.DoubleSide,
    });

    // Load GLTF model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./assets/model/spaceship/scene.gltf', (gltf) => {
        spaceship = gltf.scene;

        // Apply material to the spaceship meshes
        spaceship.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // if(!spaceship){
        //     console.warn("Spaceship is null");
        //     return;
        // }

        // Position and scale the spaceship
        spaceship.position.set(115, 320, 0);  // Adjust as needed
        spaceship.scale.set(0.2, 0.2, 0.2);      // Adjust scale if the spaceship is too small
        spaceship.castShadow = true;
        spaceship.receiveShadow = true;

        // Add spaceship to the scene
        scene.add(spaceship);
        // updateSpaceship();

    });
};

const updatePlanet = () =>{
    let currentTime = Date.now();

    planets.forEach((planetGroup, index) => {
        //delay logic
        if(currentTime > startTime + planetDelays[index]) {
            //Update the angle based on the speed
            planetAngles[index] -= planetSpeeds[index];

            //Define the orbit eradius (distance from the sun)
            const orbitRadius = 100 + index * 20;

            //Update the planet position for orbital movement
            planetGroup.position.x = Math.cos(planetAngles[index]) * orbitRadius;
            planetGroup.position.z = Math.sin(planetAngles[index]) * orbitRadius;
        }
        
        
    });
}

const spinObjects = ()=>{
    planets.forEach((planet) => {
        // Rotate the planet around its own axis
        planet.rotation.y += 0.01; // Adjust speed as needed
    });

    // Optional: Spin the sun
    sun.rotation.y += 0.002;
}

const createSkybox = () => {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        './assets/skybox/right.png',  // Positif X
        './assets/skybox/left.png',   // Negatif X
        './assets/skybox/top.png',    // Positif Y
        './assets/skybox/bottom.png', // Negatif Y
        './assets/skybox/front.png',  // Positif Z
        './assets/skybox/back.png',   // Negatif Z
    ]);
    scene.background = texture;
}; 
const switchCam = (event) => {
    // console.log(event.key);
    if (event.key == " "){
        if (selectedCamera == freeCamera) {
            selectedCamera = thirdCamera;
        } else if (selectedCamera == thirdCamera){
            selectedCamera = freeCamera;
        }
    }
};

// All events are managed here for a more organized functions
const addEventHandler = () => {
    document.addEventListener("keydown", switchCam);   
}
const animate = () => {
    spinObjects();
    updatePlanet();
    moveSpaceship();
    // Update spotlight position and target
    if (spaceship) {
        // Set spotlight to follow the spaceship
        spotLight.position.copy(spaceship.position).add(new THREE.Vector3(0, 6, 0)); // Offset spotlight above the spaceship
        spotLightTarget.position.copy(spaceship.position); // Spotlight target follows the spaceship position
    }
}

const render = () => {
    requestAnimationFrame(render);
    animate();
    renderer.render(scene, selectedCamera);
    control.update();
}

window.onload = () => {
    init();
    addEventHandler();   
    render();
}

window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    selectedCamera.aspect = window.innerWidth/window.innerHeight;
    selectedCamera.updateProjectionMatrix();
}

// Texts
// Initial text set opacity to 0
// When hovered, set text opacity to 100
window.onmousemove = (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (-event.clientY / window.innerHeight) * 2 + 1;
};


    // Event listener untuk pergerakan mouse
    window.addEventListener('mousemove', (event) => {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (-event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, selectedCamera);
        
        let hoveredObject = null;
        // let textColor = [
        //     0x00FFFF, 0x00FF00, 0xFFCC00, 0xE6E6FA, 0xFF69B4, 0xFF8C00,
        //     0xFFB6C1, 0x00FFFF, 0x87CEEB, 0xA8FFB2, 0xEE82EE, 0xADD8E6
        // ];
        let textColor = [
            "green", "blue", "red", "yellow"
        ];
        // const planetObjects = [mercury, venus, earth, mars, jupiter, saturnGroup, uranusGroup, neptune]; // Array untuk objek planet
        let currentColorIndex = 0; // Indeks awal warna

        // State all planets to be interacted
        // const intersects = raycaster.intersectObjects([
        //     sun,
        //     planetGroup
        // ]);


        const intersects = raycaster.intersectObjects([
            sun,
            mercury,
            venus,
            earth,
            mars,
            jupiter,
            saturn,
            uranus,
            neptune
        ], true);
        
        // Ensure that color remains the same by returning to this
        sun.material.color.set(0xffffff);
        mercury.material.color.set(0xffffff);
        venus.material.color.set(0xffffff);
        earth.material.color.set(0xffffff);
        mars.material.color.set(0xffffff);
        jupiter.material.color.set(0xffffff);
        saturn.material.color.set(0xffffff);
        uranus.material.color.set(0xffffff);
        neptune.material.color.set(0xffffff);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            // This line of code can change it's color to red
            intersects[0].object.material.color.set(textColor[Math.floor(Math.random() * 4)]);

            if (hoveredObject !== object) {
                // Sembunyikan teks objek sebelumnya
                if (hoveredObject) {
                    const oldText = textColor[hoveredObject.name];
                    if (oldText) {
                        oldText.visible = false;
                    }
                }

                // Tampilkan teks dan ubah warnanya
                const textMesh = textColor[object.name];
                if (textColor) {
                    textColor.visible = true;

                    // Ambil warna dari array textColor
                    textColor.material.color.set(textColor[currentColorIndex]);

                    // Update indeks warna untuk hover berikutnya
                    currentColorIndex = (currentColorIndex + 1) % textColor.length;
                }

                hoveredObject = object;
            }
        } else {
            // Sembunyikan teks saat tidak ada objek yang dihover
            if (hoveredObject) {
                const oldText = textColor[hoveredObject.name];
                if (oldText) oldText.visible = false;
                hoveredObject = null;
            }
        }
    });

    //Controller spaceship
    // Keyboard Input
    let keyState = {};

    window.addEventListener("keydown", (event) => {
        keyState[event.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", (event) => {
        keyState[event.key.toLowerCase()] = false;
    });

    const moveSpaceship = () => {
        if (!spaceship) return;

        // Rotation: Turn left (A) or right (D)
        if (keyState["a"]) {
            spaceship.rotation.y += rotationSpeed;
        }
        if (keyState["d"]) {
            spaceship.rotation.y -= rotationSpeed;
        }

    // Event listener untuk pergerakan mouse
    window.addEventListener('mousemove', (event) => {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (-event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, selectedCamera);
        
        let hoveredObject = null;
        // let textColor = [
        //     0x00FFFF, 0x00FF00, 0xFFCC00, 0xE6E6FA, 0xFF69B4, 0xFF8C00,
        //     0xFFB6C1, 0x00FFFF, 0x87CEEB, 0xA8FFB2, 0xEE82EE, 0xADD8E6
        // ];
        let textColor = [
            "green", "blue", "red", "yellow"
        ];
        // const planetObjects = [mercury, venus, earth, mars, jupiter, saturnGroup, uranusGroup, neptune]; // Array untuk objek planet
        let currentColorIndex = 0; // Indeks awal warna

        // State all planets to be interacted
        // const intersects = raycaster.intersectObjects([
        //     sun,
        //     planetGroup
        // ]);


        const intersects = raycaster.intersectObjects([
            mercury,
            venus,
            earth,
            mars,
            jupiter,
            saturn,
            uranus,
            neptune
        ], true);
        
        // Ensure that color remains the same by returning to this
        mercury.material.color.set(0xffffff);
        venus.material.color.set(0xffffff);
        earth.material.color.set(0xffffff);
        mars.material.color.set(0xffffff);
        jupiter.material.color.set(0xffffff);
        saturn.material.color.set(0xffffff);
        uranus.material.color.set(0xffffff);
        neptune.material.color.set(0xffffff);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            // This line of code can change it's color to red
            intersects[0].object.material.color.set(textColor[Math.floor(Math.random() * 4)]);

            if (hoveredObject !== object) {
                // Sembunyikan teks objek sebelumnya
                if (hoveredObject) {
                    const oldText = textColor[hoveredObject.name];
                    if (oldText) {
                        oldText.visible = false;
                    }
                }

                // Tampilkan teks dan ubah warnanya
                const textMesh = textColor[object.name];
                if (textColor) {
                    textColor.visible = true;

                    // Ambil warna dari array textColor
                    textColor.material.color.set(textColor[currentColorIndex]);

                    // Update indeks warna untuk hover berikutnya
                    currentColorIndex = (currentColorIndex + 1) % textColor.length;
                }

                hoveredObject = object;
            }
        } else {
            // Sembunyikan teks saat tidak ada objek yang dihover
            if (hoveredObject) {
                const oldText = textColor[hoveredObject.name];
                if (oldText) oldText.visible = false;
                hoveredObject = null;
            }
        }
    });

    //Controller spaceship
    // Keyboard Input
    let keyState = {};

    window.addEventListener("keydown", (event) => {
        keyState[event.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", (event) => {
        keyState[event.key.toLowerCase()] = false;
    });

    const moveSpaceship = () => {
        if (!spaceship) return;

        // Rotation: Turn left (A) or right (D)
        if (keyState["a"]) {
            spaceship.rotation.y += rotationSpeed;
        }
        if (keyState["d"]) {
            spaceship.rotation.y -= rotationSpeed;
        }

        // Movement: Move forward (W) or backward (S)
        if (keyState["w"]) {
            spaceshipVelocity.z = +spaceshipSpeed;
        } else if (keyState["s"]) {
            spaceshipVelocity.z = -spaceshipSpeed;
        } else {
            spaceshipVelocity.z = 0; // Stop movement if no keys are pressed
        }

        // Calculate the forward direction of the spaceship
        let forward = new THREE.Vector3(0, 0, 1); // Spaceship's local forward
        forward.applyQuaternion(spaceship.quaternion); // Apply rotation

        // Update spaceship position
        spaceship.position.addScaledVector(forward, spaceshipVelocity.z);

        // Update the camera to follow the spaceship
        updateThirdCamera();
    };

    const updateThirdCamera = () => {
        if (!spaceship) return;

        // Offset for the third-person camera behind and above the spaceship
        let offset = new THREE.Vector3(0, 3,-4.5); // Adjust the y and z offset
        offset.applyQuaternion(spaceship.quaternion); // Apply spaceship rotation
        let cameraPosition = spaceship.position.clone().add(offset);

        // Set thirdCamera's position and look at the spaceship
        thirdCamera.position.copy(cameraPosition);
        thirdCamera.lookAt(spaceship.position);
    };


        // Movement: Move forward (W) or backward (S)
        if (keyState["w"]) {
            spaceshipVelocity.z = +spaceshipSpeed;
        } else if (keyState["s"]) {
            spaceshipVelocity.z = -spaceshipSpeed;
        } else {
            spaceshipVelocity.z = 0; // Stop movement if no keys are pressed
        }

        // Calculate the forward direction of the spaceship
        let forward = new THREE.Vector3(0, 0, 1); // Spaceship's local forward
        forward.applyQuaternion(spaceship.quaternion); // Apply rotation

        // Update spaceship position
        spaceship.position.addScaledVector(forward, spaceshipVelocity.z);

        // Update the camera to follow the spaceship
        updateThirdCamera();
    };

    const updateThirdCamera = () => {
        if (!spaceship) return;

        // Offset for the third-person camera behind and above the spaceship
        let offset = new THREE.Vector3(0, 3,-4.5); // Adjust the y and z offset
        offset.applyQuaternion(spaceship.quaternion); // Apply spaceship rotation
        let cameraPosition = spaceship.position.clone().add(offset);


        // Set thirdCamera's position and look at the spaceship
        thirdCamera.position.copy(cameraPosition);
        thirdCamera.lookAt(spaceship.position);
    };
//Controller buat Spaceship
// Listen for key press events
// document.addEventListener('keydown', (event) => {
//     switch (event.key) {
//         case 's':
//         case 'S':
//             moveForward = true;
//             break;
//         case 'w':
//         case 'W':
//             moveBackward = true;
//             break;
//         case 'd':
//         case 'D':
//             moveLeft = true;
//             break;
//         case 'a':
//         case 'A':
//             moveRight = true;
//             break;
//     }
// });

// document.addEventListener('keyup', (event) => {
//     switch (event.key) {
//         case 's':
//         case 'S':
//             moveForward = false;
//             break;
//         case 'w':
//         case 'W':
//             moveBackward = false;
//             break;
//         case 'd':
//         case 'D':
//             moveLeft = false;
//             break;
//         case 'a':
//         case 'A':
//             moveRight = false;
//             break;
//     }
// });

// // Move spaceship and update third-person camera
// const updateSpaceshipMovement = () => {
//     if (moveForward) spaceship.position.z -= spaceshipSpeed;
//     if (moveBackward) spaceship.position.z += spaceshipSpeed;
//     if (moveLeft) spaceship.position.x -= spaceshipSpeed;
//     if (moveRight) spaceship.position.x += spaceshipSpeed;

//     // Update third-person camera to follow the spaceship
//     thirdCamera.position.set(
//         spaceship.position.x,
//         spaceship.position.y + 16, // Slightly above the spaceship
//         spaceship.position.z - 20 // Behind the spaceship
//     );
//     thirdCamera.lookAt(spaceship.position); // Camera looks at the spaceship
// };
    // Set colors in array

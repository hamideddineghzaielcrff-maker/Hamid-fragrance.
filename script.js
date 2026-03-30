import * as THREE from 'three';

const container = document.getElementById('bottle-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const bottleGroup = new THREE.Group();

// --- 1. LE CORPS DU FLACON (Pavé Rectangulaire Cristallin) ---
const bodyGeo = new THREE.BoxGeometry(2.0, 1.4, 0.8);
const glassMat = new THREE.MeshPhysicalMaterial({ 
    color: 0xffffff,
    transmission: 0.98, // Ultra transparent
    roughness: 0.02, // Très lisse
    thickness: 0.8, // Verre épais
    ior: 1.52, // Cristal
    transparent: true,
    opacity: 0.9,
    clearcoat: 1
});
const glassBody = new THREE.Mesh(bodyGeo, glassMat);
bottleGroup.add(glassBody);

// --- 2. LE LIQUIDE ROSE INTERNE ---
const liquidGeo = new THREE.BoxGeometry(1.9, 1.2, 0.7);
const liquidMat = new THREE.MeshPhysicalMaterial({ 
    color: 0xFFD1DC, // Rose doux
    transmission: 0.9, roughness: 0,
    thickness: 0.1, ior: 1.33, transparent: true, opacity: 0.8
});
const liquid = new THREE.Mesh(liquidGeo, liquidMat);
liquid.position.y = -0.05;
bottleGroup.add(liquid);

// --- 3. LE PIED DE VERRE MASSIF ---
const foot = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.8), glassMat);
foot.position.y = -0.85;
bottleGroup.add(foot);

// --- 4. LE COL ET LE NŒUD COUTURE (Or Rose) ---
const neckGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.3, 32);
const goldMat = new THREE.MeshStandardMaterial({ color: 0xE6C7C2, metalness: 1, roughness: 0.1 });
const neck = new THREE.Mesh(neckGeo, goldMat);
neck.position.y = 0.85;
bottleGroup.add(neck);

// Sculptage du Nœud "Dior"
const bowGroup = new THREE.Group();
const bowMat = new THREE.MeshStandardMaterial({ color: 0xE6C7C2, metalness: 0.9, roughness: 0.3 });
const wing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.05), bowMat);
const wingL = wing.clone(); wingL.position.set(-0.25, 0.85, 0.4); wingL.rotation.z = -0.3;
const wingR = wing.clone(); wingR.position.set(0.25, 0.85, 0.4); wingR.rotation.z = 0.3;
bowGroup.add(wingL, wingR);
bottleGroup.add(bowGroup);

// --- 5. LE BOUCHON CRISTALLIN ---
const cap = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.5, 0.6),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, roughness: 0, transparent: true, opacity: 0.8 })
);
cap.position.y = 1.2;
bottleGroup.add(cap);

// POSITION FIXE ÉLÉGANTE DE ¾
bottleGroup.rotation.y = 0.45; 
bottleGroup.rotation.x = 0.15;
scene.add(bottleGroup);

// LUMIÈRES STUDIO COMPLEXES (Reflets réalistes)
scene.add(new THREE.AmbientLight(0xffffff, 1.5));
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 4, 3);
scene.add(light);

// Rendu
renderer.render(scene, camera);

// Resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.render(scene, camera);
});

import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// Helper function to make objects clickable
function makeClickable(object, url) {
  object.cursor = 'pointer';
  object.callback = () => {
    window.location.href = url;
  };
}

// Sphere
const geometry = new THREE.SphereGeometry(10, 32, 32); // Adjust radius and segments as needed
const jeffTexture = new THREE.TextureLoader().load('jeff.png'); // Load the jeff.png texture
const material = new THREE.MeshStandardMaterial({ map: jeffTexture }); // Apply the texture to the material
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
makeClickable(sphere, 'https://x.com/GinnaNeiro');

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Starfield
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background
const spaceTexture = new THREE.TextureLoader().load('sol.png');
scene.background = spaceTexture;

// Avatar (Cube)
const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: jeffTexture }));
scene.add(jeff);
makeClickable(jeff, 'https://www.youtube.com/watch?v=Z7wnn5XgAUo');
const anotherSphereGeometry = new THREE.SphereGeometry(-12, 42, 32); // Adjust radius and segments as needed
const anotherSphereTexture = new THREE.TextureLoader().load('moon.jpg'); // Load the texture
const anotherSphereMaterial = new THREE.MeshStandardMaterial({ map: anotherSphereTexture }); // Apply the texture to the material
const anotherSphere = new THREE.Mesh(anotherSphereGeometry, anotherSphereMaterial);
// Calculate the position for the new sphere
const cameraDirection = new THREE.Vector3();
camera.getWorldDirection(cameraDirection);
const distanceToCamera = 50; // Adjust the distance from the camera
const newPosition = camera.position.clone().add(cameraDirection.multiplyScalar(distanceToCamera));
anotherSphere.position.copy(newPosition);

scene.add(anotherSphere);
makeClickable(anotherSphere, 'https://pump.fun/board'); // Make clickable


// Moon
const moonTexture = new THREE.TextureLoader().load('preview.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10);
makeClickable(moon, 'https://t.me/GinnaNeiro');

// Raycaster for mouse events
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('click', onClick);

function onClick(event) {
  // Calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Raycasting
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.callback) object.callback();
  }
}

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.005;
  sphere.rotation.z += 0.01;

  moon.rotation.x += 0.005;
 // Animate the cube
 jeff.rotation.x += 0.01;
 jeff.rotation.y += 0.01;
 jeff.rotation.z += 0.01;

 anotherSphere.rotation.x += 0.008;
 anotherSphere.rotation.y += 0.006;
 anotherSphere.rotation.z += 0.008;

  renderer.render(scene, camera);
}

animate();

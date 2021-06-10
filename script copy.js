const raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(1, 1);
var intersects = [];

let object;
let size = 1.3; // size of the blob 
let maxSize = true;
let k = 2; // value of spikes

// SETTINGS 

var renderer = new THREE.WebGLRenderer({canvas: document.getElementById('blob'), antialias: true, alpha: true }); // alpha makes background transparent 
renderer.setPixelRatio(window.devicePixelRatio);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// RESIZE WINDOW  

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth; // width declared in CSS 
  const height = canvas.clientHeight; // height declared in CSS 
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

// LIGHT 

const skyColor = 0xf5e4e1;
const groundColor = 0xf2eeed;
const hemiIntensity = 1;
const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, hemiIntensity);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffbfff, 0.1);
dirLight.position.set(20, 20, 10);
scene.add(dirLight);

let pointIntensity = 0.2;
let pointDistance = 1;
let pointDecay = 0;

var pointLight = new THREE.PointLight(0xff7300, pointIntensity, pointDistance, pointDecay);
pointLight.position.set(-2, -2, 2);
scene.add(pointLight);

var pointLight2 = new THREE.PointLight(0xff7300, pointIntensity, pointDistance, pointDecay);
pointLight2.position.set(2, 2, 2);
scene.add(pointLight2);

// MOUSE MOVEMENT 

let mouseX = 0;
let mouseY = 0; 

let targetX = 0; 
let targetY = 0; 

const windowX = window.innerWidth / 2; 
const windowY = window.innerHeight / 2; 

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  mouseX = (event.clientX - windowX); 
  mouseY = (event.clientY - windowY); 
} 

document.addEventListener('mousemove', onDocumentMouseMove, false);

// OBJECT 

var geometry = new THREE.TorusGeometry(10, 5, 30, 200, 10);
var material = new THREE.MeshPhongMaterial({
  color: 0xbeebe0,
  specular: 0x00ffc3,
  reflectivity: 1,
  shininess: 50,
  opacity: 1,
  transparent: true,
});

object = new THREE.Mesh(geometry, material);
scene.add(object);

function init() {

  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects(scene.children);

  let time = performance.now() * 0.0003; // speed of the animation 

  // CREATE VERTICES 
  for (let i = 0; i < object.geometry.vertices.length; i++) {
    let p = object.geometry.vertices[i];
    p.normalize().multiplyScalar(size + 0.3 * noise.perlin3(p.x * k + time, p.y * k + 0, p.z * k));
  }
/*
  if (intersects.length > 0 && intersects[0].object === object && k < 2) {
    k += 0.03;
    if (size < 1.4 && maxSize) {
      size = size + 0.01;
    } else {
      k -= 0.03;
      maxSize = false;
      if (size >= 1.3) {
        size = size - 0.01;
      }
    }
  } else {
    maxSize = true;
    if (size >= 1.3) {
      size = size - 0.01;
    }
    if (k >= 1.5) {
      k -= 0.03;
    }
  } */

  object.geometry.computeVertexNormals();
  object.geometry.normalsNeedUpdate = true;
  object.geometry.verticesNeedUpdate = true; // submit new vertices after every update  

}

function animate() {

  // make canvas responsive 
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  // ROTATION ON MOUSE MOVEMENT
  let rotationValue = 0.0003;
  targetX = mouseX * rotationValue; 
  targetY = mouseY * rotationValue; 

  object.rotation.x += 0.5 * (targetY - object.rotation.x);
  object.rotation.y += 0.5 * (targetX - object.rotation.y); 

  // BLUR ON OBJECT OF THE CANVAS
  // let blur = Math.sin(object.rotation.x) * 0.5 + 0.5;
  // renderer.domElement.style.filter = `blur(${blur * 5}px)`;

  init(); 
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

import {OrbitControls} from './OrbitControls.js'
//import { AxesHelper } from 'three'; // Make sure you import AxesHelper if using modules


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
scene.background = new THREE.Color( 'ForestGreen' );

// Add AxesHelper to visualize the coordinate system
const axesHelper = new THREE.AxesHelper(5); // The parameter is the length of the axes
scene.add(axesHelper);

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Goal Skeleton Components

// Goal Posts
const goalPostGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 32);
const goalPostMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const goalPost1 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);
const goalPost2 = new THREE.Mesh(goalPostGeometry, goalPostMaterial);

// Position the goal posts
goalPost1.position.set(-1.5, 1, 0);
goalPost2.position.set(1.5, 1, 0);
scene.add(goalPost1);
scene.add(goalPost2);

// Crossbar
const crossbarGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
const crossbar = new THREE.Mesh(crossbarGeometry, goalPostMaterial);

// Rotate and position the crossbar
crossbar.rotation.z = degrees_to_radians(90);
crossbar.position.set(0, 2, 0);
scene.add(crossbar);

// Back Supports
const backSupportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 32);
const backSupport1 = new THREE.Mesh(backSupportGeometry, goalPostMaterial);
const backSupport2 = new THREE.Mesh(backSupportGeometry, goalPostMaterial);

// Rotate and position the back supports
backSupport1.rotation.x = degrees_to_radians(45);
backSupport1.position.set(-1.5, 1, -1.8);
backSupport2.rotation.x = degrees_to_radians(45);
backSupport2.position.set(1.5, 1, -1.8);
scene.add(backSupport1);
scene.add(backSupport2);

// Toruses at the ends of goalposts and back supports
const torusGeometry = new THREE.TorusGeometry(0.1, 0.03, 16, 100);
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const torus1 = new THREE.Mesh(torusGeometry, torusMaterial);
const torus2 = new THREE.Mesh(torusGeometry, torusMaterial);
const torus3 = new THREE.Mesh(torusGeometry, torusMaterial);
const torus4 = new THREE.Mesh(torusGeometry, torusMaterial);

// Position the toruses
torus1.position.set(-1.5, 2, 0);
torus2.position.set(1.5, 2, 0);
torus3.position.set(-1.5, 0, -1.5);
torus4.position.set(1.5, 0, -1.5);
scene.add(torus1);
scene.add(torus2);
scene.add(torus3);
scene.add(torus4);

// This is a sphere.
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 'Black' });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);


// This defines the initial distance of the camera
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0,0,5);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );

const controls = new OrbitControls( camera, renderer.domElement );

let isOrbitEnabled = true;

const toggleOrbit = (e) => {
	if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
}

document.addEventListener('keydown',toggleOrbit)

// Implementing wireframe toggle
let isWireframeEnabled = false;

const toggleWireframe = (e) => {
	if (e.key == 'w') {
	  isWireframeEnabled = !isWireframeEnabled;
	  scene.traverse((child) => {
		if (child.isMesh) {
		  child.material.wireframe = isWireframeEnabled;
		}
	  });
	}
  };

document.addEventListener('keydown', toggleWireframe);

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

	requestAnimationFrame( animate );

	controls.enabled = isOrbitEnabled;
	controls.update();

	renderer.render( scene, camera );

}
animate()
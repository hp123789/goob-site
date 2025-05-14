import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, eyeball;
const mouse = new THREE.Vector2();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 7.5);
  light.castShadow = true;
  
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.radius = 4;
  light.shadow.bias = -0.0001;
  scene.add(light);

  const loader = new GLTFLoader();
  loader.load('./public/eyeball.glb',
    (gltf) => {
      const pivot = new THREE.Object3D();
      pivot.position.set(0, 0, 0);
      scene.add(pivot);

      eyeball = gltf.scene;
      eyeball.scale.set(0.3, 0.3, 0.3);
      
      eyeball.position.set(0, 0, 0);
      eyeball.rotation.y = Math.PI * 1.5;

      pivot.add(eyeball);

      eyeball = pivot;
      
      eyeball.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      scene.add(eyeball);
      loadingElem.remove();
      
      console.log('Eyeball loaded successfully');
    },
    (xhr) => {
      const percent = Math.round((xhr.loaded / xhr.total) * 100);
    },
    (error) => {
      console.error('Error loading eyeball:', error);
      loadingElem.textContent = 'Error loading eyeball model';
      loadingElem.style.color = 'red';
    }
  );

  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
    requestAnimationFrame(animate);
  
    if (eyeball) {
      const eyeballWorldPosition = new THREE.Vector3();
      eyeball.getWorldPosition(eyeballWorldPosition);
  
      const target = new THREE.Vector3(
        -mouse.x * 8,
        -mouse.y * 5,
        camera.position.z - 10
      );
  
      const direction = new THREE.Vector3().subVectors(target, eyeballWorldPosition).normalize();
  
      const targetQuaternion = new THREE.Quaternion();
      const up = new THREE.Vector3(0, 1, 0);
      targetQuaternion.setFromRotationMatrix(
        new THREE.Matrix4().lookAt(
          eyeballWorldPosition,
          target,
          up
        )
      );
  
      eyeball.quaternion.slerp(targetQuaternion, 0.1);
  
      const maxTilt = 0.6;
      const euler = new THREE.Euler().setFromQuaternion(eyeball.quaternion);
      euler.x = THREE.MathUtils.clamp(euler.x, -maxTilt, maxTilt);
      euler.y = THREE.MathUtils.clamp(euler.y, -maxTilt, maxTilt);
      eyeball.quaternion.setFromEuler(euler);
    }
  
    renderer.render(scene, camera);
  }
  
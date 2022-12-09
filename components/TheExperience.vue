<script setup lang="ts">
import {
  Scene,
  WebGLRenderer,
  Mesh,
  Color,
  Fog,
  AmbientLight,
  OrthographicCamera,
  PCFSoftShadowMap,
  DirectionalLight,
  CameraHelper,
  PlaneGeometry,
  DoubleSide,
  MeshPhysicalMaterial,
} from "three";
import { Ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { gsap } from "gsap";

let renderer: WebGLRenderer;
let controls: OrbitControls;

const experience: Ref<HTMLCanvasElement | null> = ref(null);

const bgColor = new Color("#FAFAFA");

const scene = new Scene();

scene.fog = new Fog(bgColor, 0.1, 75);
scene.background = bgColor;

const { width, height } = useWindowSize();
const aspectRatio = computed(() => width.value / height.value);

// const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const cameraDimension = 8;
const camera = new OrthographicCamera(
  cameraDimension,
  -cameraDimension,
  cameraDimension,
  -cameraDimension,
  -100,
  100
);
camera.position.set(0, 0, 10);

scene.add(camera);

// const ambientLight = new AmbientLight(0xffffff, 0.1);
// scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 15, -20);
directionalLight.castShadow = true;
scene.add(directionalLight);

// const helper = new CameraHelper(directionalLight.shadow.camera);
// scene.add(helper);

const planeGeometry = new PlaneGeometry(40, 40);
const material = new MeshPhysicalMaterial({
  color: 0xffffff,
  side: DoubleSide,
});
const plane = new Mesh(planeGeometry, material);
plane.receiveShadow = true;
// plane.castShadow = true;
scene.add(plane);
plane.position.set(0, 0, -1);

const { load } = useGLTFModel();

const { scene: model } = await load("/model.glb");
model.castShadow = true;
model.receiveShadow = true;
// model.scene.traverse(function (node) {
//   if (node.isMesh) {
//     node.castShadow = true;
//   }
// });
scene.add(model);

// const geometry = new BoxGeometry(10, 10, 10);
// const cube = new Mesh(geometry, material);
// cube.castShadow = true;
// cube.receiveShadow = true;
// scene.add(cube);

function updateCamera() {
  // camera.aspect = aspectRatio.value;
  camera.updateProjectionMatrix();
}

function updateRenderer() {
  // renderer.setSize(width.value, height.value);
  renderer.setSize(400, 400);
  renderer.render(scene, camera);
}

function setRenderer() {
  if (experience.value) {
    renderer = new WebGLRenderer({ canvas: experience.value, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxAzimuthAngle = 0.2;
    controls.minAzimuthAngle = -0.2;
    controls.minPolarAngle = 1.3;
    controls.maxPolarAngle = 1.7;
    updateRenderer();
  }
}

watch(aspectRatio, () => {
  updateCamera();
  updateRenderer();
});

onMounted(() => {
  setRenderer();
  loop();
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
};
</script>
<template>
  <div>
    <canvas ref="experience" />
  </div>
</template>
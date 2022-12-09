<script setup lang="ts">
import {
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  Mesh,
  Color,
  Fog,
  AmbientLight,
  OrthographicCamera,
  PCFSoftShadowMap,
  DirectionalLight,
  CameraHelper,
} from "three";
import { Ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import { getHeapSnapshot } from "v8";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let renderer: WebGLRenderer;
// let controls: OrbitControls;

const experience: Ref<HTMLCanvasElement | null> = ref(null);

const bgColor = new Color("#FAFAFA");

const scene = new Scene();

const gsap = this.$gsap;

scene.fog = new Fog(bgColor, 0.1, 75);
scene.background = bgColor;

const { width, height } = useWindowSize();
const aspectRatio = computed(() => width.value / height.value);

// const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const camera = new OrthographicCamera(0.08, -0.08, 0.08, -0.08, 0.08, 1000);
camera.position.set(0, 0, 0.2);

scene.add(camera);

const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, -4);
directionalLight.castShadow = true;
scene.add(directionalLight);

// const helper = new CameraHelper(directionalLight.shadow.camera);
// scene.add(helper);

const { load } = useGLTFModel();

const { scene: model } = await load("/model.glb");

scene.add(model);

function updateCamera() {
  camera.aspect = aspectRatio.value;
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
    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    updateRenderer();
    gsap.to(experience.value, { rotation: 180, duration: 1 });
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
  // controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
};
</script>
<template>
  <div>
    <canvas ref="experience" />
  </div>
</template>
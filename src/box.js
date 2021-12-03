import * as THREE from 'three';
import { TrackballControls } from './TrackballControls.js';
import * as BufferGeometryUtils from './BufferGeometryUtils.js';
import { addTile } from './addTile.ts';
import { v4 } from 'uuid';

let container;
let camera, controls, scene, renderer;
let pickingTexture, pickingScene;
let highlightBox;

const pickingData = [];

const pointer = new THREE.Vector2();
const offset = new THREE.Vector3(10, 10, 10);

export const boxMap = new Map()

export function init() {

    container = document.body;

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 40000);
    camera.position.x = 7000;
    camera.position.y = 7000;
    camera.position.z = 7000;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    pickingScene = new THREE.Scene();
    pickingTexture = new THREE.WebGLRenderTarget(1, 1);

    scene.add(new THREE.AmbientLight(0x555555));

    const light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 15000, 0);
    scene.add(light);

    const pickingMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
    const defaultMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true, vertexColors: true, shininess: 0 });

    const geometriesDrawn = [];
    const geometriesPicking = [];



    for (let i = 0; i < 5000; i++) {

        const { pickingData, geometry } = addTile({ geometriesDrawn, i, geometriesPicking });
        boxMap.set(v4(), geometry);

        pickingData[i] = pickingData

    }

    const objects = new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(geometriesDrawn), defaultMaterial);
    scene.add(objects);

    pickingScene.add(new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(geometriesPicking), pickingMaterial));

    highlightBox = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshLambertMaterial({ color: 0xffff00 }
        ));
    scene.add(highlightBox);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    renderer.domElement.addEventListener('pointermove', onPointerMove);

}

//

function onPointerMove(e) {

    pointer.x = e.clientX;
    pointer.y = e.clientY;

}

export function animate() {

    requestAnimationFrame(animate);

    render();
}

function pick() {

    //render the picking scene off-screen

    // set the view offset to represent just a single pixel under the mouse

    camera.setViewOffset(renderer.domElement.width, renderer.domElement.height, pointer.x * window.devicePixelRatio | 0, pointer.y * window.devicePixelRatio | 0, 1, 1);

    // render the scene

    renderer.setRenderTarget(pickingTexture);
    renderer.render(pickingScene, camera);

    // clear the view offset so rendering returns to normal

    camera.clearViewOffset();

    //create buffer for reading single pixel

    const pixelBuffer = new Uint8Array(4);

    //read the pixel

    renderer.readRenderTargetPixels(pickingTexture, 0, 0, 1, 1, pixelBuffer);

    //interpret the pixel as an ID

    const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
    const data = pickingData[id];

    if (data) {

        //move our highlightBox so that it surrounds the picked object

        if (data.position && data.rotation && data.scale) {

            highlightBox.position.copy(data.position);
            highlightBox.rotation.copy(data.rotation);
            highlightBox.scale.copy(data.scale).add(offset);
            highlightBox.visible = true;

        }

    } else {

        highlightBox.visible = false;

    }

}

function render() {

    controls.update();

    pick();

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

}

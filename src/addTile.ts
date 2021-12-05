import * as THREE from "three";
import { Vec3 } from "./box";

export function addTile({ i, initPosition }: { i: number; initPosition: Vec3 }) {
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const color = new THREE.Color();

  let geometry = new THREE.BoxGeometry();
  const position = new THREE.Vector3();
  Object.assign(position, initPosition);
  // position.x = Math.random() * 10000 - 5000;
  // position.y = Math.random() * 6000 - 3000;
  // position.z = Math.random() * 8000 - 4000;

  const rotation = new THREE.Euler();
  rotation.x = 5;
  rotation.y = 5;
  rotation.z = 5;

  const scale = new THREE.Vector3();
  scale.x = 300;
  scale.y = 300;
  scale.z = 300;

  quaternion.setFromEuler(rotation);
  matrix.compose(position, quaternion, scale);

  geometry.applyMatrix4(matrix);

  // give the geometry's vertices a random color, to be displayed
  applyVertexColors(geometry, color.setHex(Math.random() * 0xffffff));

  const clonedGeometry = geometry.clone() as THREE.BoxGeometry;

  // give the geometry's vertices a color corresponding to the "id"
  applyVertexColors(clonedGeometry, color.setHex(i));

  return {
    drawnGeometry: geometry,
    pickingGeometry: clonedGeometry,
    pickingDataItem: {
      position,
      rotation,
      scale,
    },
  };
}

function applyVertexColors(geometry: THREE.BufferGeometry, color: THREE.Color) {
  const position = geometry.attributes.position;
  const colors = [];

  for (let i = 0; i < position.count; i++) {
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
}

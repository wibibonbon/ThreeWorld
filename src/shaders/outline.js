import * as THREE from 'three'

const uniforms = {
    texture: { type: 't', value: null },
    basicBpColor:{ type: "v3", value: new THREE.Vector3(0.5,0.5,0.5)},
    outlineColor:{ type: "v3", value: new THREE.Vector3(1.0,1.0,1.0)},
}

/* eslint-disable */
const vertexShader = `
  varying vec2 vUv;
  uniform vec3 basicBpColor;
  
  void main() {
  vUv = uv;
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
    }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform vec3 outlineColor;
  void main() {

  gl_FragColor = vec4( outlineColor, 1.0 );
  
} 
`

export { vertexShader, fragmentShader, uniforms }
import * as THREE from 'three'

const uniforms = {
    uHatchingOn:{ type: "i", value:1},

    inkColor: { type: 'v4', value: new THREE.Vector3( 0.2, 0.2, 0.2, 1.0 ) },
    uMaterialColor:  { type: "c", value: new THREE.Color( 0xE2EAF2) },
    uDirLightPos:	{ type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
    uDirLightColor: { type: "c", value: new THREE.Color( 0xffffff ) },
    uKd: { type: "f", value: 0.7 },
    ambientVal: {type: 'f', value : 1.0},
    ambientWeight: { type: 'f', value : 0.1},
    diffuseVal:{type: 'f', value : 100.0},
    diffuseWeight: { type: 'f', value : 0.8 },
    rimVal:{type: 'f', value : 50.0 },
    rimWeight: { type: 'f', value : 0.8 },
    specularVal:{type: 'f', value : 100.0},
    specularWeight: { type: 'f', value : 0.8},
    shininessVal:{type: 'f', value : 180},
    lightPosition: { type: 'v3', value: new THREE.Vector3( -10.0, 10, 0.6 ) },
};

const vertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vNormal = normalize( normalMatrix * normal );
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vViewPosition = -mvPosition.xyz;
    vUv = uv;
}
`

const fragmentShader = `

uniform vec3 uMaterialColor;

uniform vec3 uDirLightPos;
uniform vec3 uDirLightColor;

uniform float uKd;
uniform sampler2D tPaper;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() {

    // compute direction to light
    vec4 lDirection = viewMatrix * vec4( uDirLightPos, 0.0 );
    vec3 lVector = normalize( lDirection.xyz );

    vec3 normal = normalize( vNormal );
    // solution
    float diffuse = dot( normal, lVector );
    if ( diffuse > 0.75 ) { diffuse = 0.95; }
    else if (diffuse > 0.6 && diffuse <=0.75) {diffuse = 0.9;}
    else if (diffuse > 0.2 && diffuse <=0.6) {diffuse = 0.8;}
    else if ( diffuse > -0.2 && diffuse <=0.2) { diffuse = 0.7; }
    else { diffuse = 0.5; }

    gl_FragColor = vec4( uKd * uMaterialColor * uDirLightColor * diffuse, 1.0 );
}
`

export { vertexShader, fragmentShader, uniforms }

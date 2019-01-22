import { PerspectiveCamera, Scene, SpotLight, BoxGeometry,
         TorusKnotGeometry, MeshPhongMaterial, Mesh,
         ShaderMaterial, Texture, LinearFilter,
         PCFSoftShadowMap,
         Vector2 } from 'three'
import TrackballControls from 'three-trackballcontrols'
import ShaderManager from '../tools/ShaderManager'
import * as TextureShader from '../shaders/texture'
import * as GreyscaleShader from '../shaders/greyscale'
import * as DotsShader from '../shaders/dots'

import extend from 'extend'

class Playground {
  constructor (renderer) {
    this.renderer = renderer

    // Update the renderer
    this.renderer.setClearColor(0xFF5CA6, 1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    //this.renderer.shadowMap.type = PCFSoftShadowMap
    //this.renderer.shadowMap.enabled = true

    // Make a camera and position it off center
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
    this.camera.position.z = 500

    // Make a scene, add the camera to it
    this.scene = new Scene()
    this.scene.add(this.camera)


      this.tex = new Texture()

      this.shaderManager = new ShaderManager(this.tex)
      this.shaderManager.add(GreyscaleShader)
      this.shaderManager.add(DotsShader)


      // Create Mesh

    const shape = new TorusKnotGeometry(60, 30, 100, 16)
    const cubeMaterial = new MeshPhongMaterial({color: 0xFF5CA6})
    this.shape = new Mesh(shape, cellShadingMat)
    //this.shape.castShadow = true
    this.camera.lookAt(this.shape)
    this.scene.add(this.shape)

    // Mesh lambert material accepts light,
    // so let's add some light and shadow
    this.spotlight = new SpotLight(0xffffff)
    this.spotlight.position.set(0, 0, 250)
    this.spotlight.angle = 0.5 // The width of the spotlight
    this.spotlight.penumbra = 1 // How much the spotlight will fade out at the edges
    this.spotlight.intensity = 1 // How intense it is
    this.spotlight.castShadow = true
    this.scene.add(this.spotlight)

    // Define an angle to animate the spotlight around
    //this.spotlightOrbit = 2 * Math.PI / 180
    //this.spotlightRadius = 100


    // And something to cast shadows onto
    this.planeWidth = 1200
    this.planeHeight = 900
      /*
    this.uniforms = extend(uniforms, {
      texture: {type: 't', value: this.videoTexture},
      textureFactor: {type: 'v2', value: new Vector2(0, 0)},
      resolution: {type: 'v2', value: new Vector2(window.innerWidth, window.innerHeight)},
      time: {type: 'f', value: 0.0}
    })*/
      /*
    const planeGeometry = new BoxGeometry(this.planeWidth, this.planeHeight, 5)
    const planeMaterial = new ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: this.uniforms
    })
    this.plane = new Mesh(planeGeometry, planeMaterial)
    this.plane.position.z = -100
    this.plane.receiveShadow = true
    this.scene.add(this.plane)
*/
    // Add controls so you can navigate the scene
    this.controls = new TrackballControls(this.camera, this.renderer.domElement)

    // Resize things when the window resizes
    window.addEventListener('resize', this.onResize.bind(this))
  }
  onResize () {
    // Update the camera's aspect ratio and the renderer's size
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
  calculateAspectRatio () {
    /*
    const textureAspect = this.video.videoWidth / this.video.videoHeight
    const planeAspect = this.planeWidth / this.planeHeight
    this.uniforms.textureFactor.value = new Vector2(1, 1)

    if (textureAspect > planeAspect) {
      this.uniforms.textureFactor.value.x = textureAspect / planeAspect
    } else {
      this.uniforms.textureFactor.value.y = planeAspect / textureAspect
    }*/
  }
  loop () {

    // Update time uniform
    //this.uniforms.time.value += 0.1

    // Rotate the shape
    this.shape.rotation.x += 0.001
    this.shape.rotation.y += 0.001
    this.shape.rotation.z += 0.001

    // Move the light about
    //this.spotlightOrbit += 2 * Math.PI / 180
    //this.spotlight.position.x = this.spotlightRadius * Math.sin(this.spotlightOrbit / 10) * Math.sin(this.spotlightOrbit)
    //this.spotlight.position.y = this.spotlightRadius * Math.sin(this.spotlightOrbit / 10) * Math.cos(this.spotlightOrbit)

    // Updates the trackball controls
    this.controls.update()

    // Renders the scene
    this.renderer.render(this.scene, this.camera)
  }
}

export default Playground

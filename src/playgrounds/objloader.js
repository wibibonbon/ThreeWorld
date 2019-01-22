import * as THREE from 'three'
//import * as OBJLoader from 'three-obj-loader'
import OBJLoader from '../three/OBJLoaderNew'
import obj from './bunny.obj';
import TrackballControls from 'three-trackballcontrols';

//OBJLoader(THREE)
class Playground {
    constructor (renderer) {
        // Update the renderer
        this.renderer = renderer;
        this.renderer.setClearColor(0x00E8D5, 1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Make a camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 250;

        // Make a scene, add the camera to it
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);



        // Add a cube by making the shape, and the material,
        // and smooshing them together with a mesh
        const manager = new THREE.LoadingManager();


        //manager.onProgress =  ( item, loaded, total )=> {
        //    console.log( item, loaded, total );
        //};
        const yourMaterialHere = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

        //Loader for Obj from Three.js
        //const loader = new OBJLoader(manager);
        //Launch loading of the obj file, addBananaInScene is the callback when it's ready



        //const textureLoader = new TextureLoader();


        const geometry = new THREE.BoxGeometry(100, 100, 100)
        var material = new THREE.MeshBasicMaterial({color: 0xffffff})


        const loader =  new OBJLoader(manager);

        loader.load( obj,
            object => {
                //object.traverse( function ( child ) {
                //    if ( child instanceof THREE.Mesh ) {
                //        child.material.map = yourMaterialHere;
                //    }
                //} );
                //object.traverse( function ( child ) {

                //        if ( child instanceof THREE.Mesh ) {

                            //child.material.map = material

                //        }
                //});

                //set properties of object (i.e. position, rotation, etc);
                console.log(object);
                this.bunny = object;
                this.bunny.position.x =0.5
                this.bunny.position.y=0.5
                console.log(this.bunny)
                this.scene.add( this.bunny )
            //this.scene.add(object);
            },
            xhr => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            error => {
                console.log("Error! ", error);
            }
        );

        this.cube = new THREE.Mesh(geometry, material)
        this.scene.add(this.cube)

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
    loop () {
        // Rotate the cube
        //this.cube.rotation.x += 0.001
        //this.cube.rotation.y += 0.001
        //this.cube.rotation.z += 0.001

        // Updates the trackball controls
        this.controls.update()

        // Renders the scene
        this.renderer.render(this.scene, this.camera)
    }
}

export default Playground

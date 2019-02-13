import React, { Component } from 'react'

import {
    PerspectiveCamera, Scene, SphereGeometry, Geometry, Color, FaceColors, Matrix4, LineBasicMaterial,
    BoxGeometry, MeshBasicMaterial, Mesh, ShaderMaterial, ImageUtils, BackSide, AdditiveBlending
} from 'three'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import * as OrbitControls from 'three-orbit-controls'
import * as PP from 'postprocessing'
import * as EarthShader from '../shaders/earth'
import * as BpShader from '../shaders/outline'

import * as ATMShader from '../shaders/atmosphere'
import bars from '../db/blockproducers.json'

import extend from 'extend'
import img from '../db/world.jpg'

class Playground extends Component{



    constructor(props) {
        super(props);

        this.animate = this.animate.bind(this)


        if (module.hot) {
            // If hot reloading, stop events
            module.hot.dispose(() => {
                this.stopped = true
            })
        }



        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        var offset = new THREE.Vector3(10, 10, 10);


        const distance = 1000;
        // Make a camera
        this.camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
        this.camera.position.z = distance;
        this.pointCubes = [];
        this.groupOfPoints = new THREE.Group();
        // Make a scene, add the camera to it
        this.scene = new Scene()


        // Add a cube by making the shape, and the material,
        // and smooshing them together with a mesh
        const geometry = new SphereGeometry(200, 40, 30)

        this.earthtex = ImageUtils.loadTexture(img);

        this.uniforms = extend(EarthShader.uniforms, {
            texture: {type: 't', value: this.earthtex},
        })

        //Create world materials and add to scene
        const mat = new ShaderMaterial({
            vertexShader: EarthShader.vertexShader,
            fragmentShader: EarthShader.fragmentShader,
            uniforms: this.uniforms,
        })
        const mat2 = new ShaderMaterial({
            vertexShader: ATMShader.vertexShader,
            fragmentShader: ATMShader.fragmentShader,
            side: BackSide,
            blending: AdditiveBlending,
            transparent: true
        })


        this.activeBpMat = new ShaderMaterial({
            vertexShader: BpShader.vertexShader,
            fragmentShader: BpShader.fragmentShader,
            uniforms: BpShader.uniforms,
        })


        this.sphere = new Mesh(geometry, mat)
        this.sphere.rotation.y = Math.PI;
        this.sphereOut = new Mesh(geometry, mat2)
        this.sphereOut.scale.set(1.1, 1.1, 1.1);
        this.scene.add(this.sphere)
        this.scene.add(this.sphereOut)


        this.boxGeometry = new BoxGeometry(10, 10, 10);
        this.boxGeometry.applyMatrix(new Matrix4().makeTranslation(0, 0, -0.5));

        this.point = new Mesh(this.boxGeometry);


        this.data = bars;
        this.points = [];

        for (let i = 0; i < this.data.length; i++) {
            this.addData(this.data[i][1], {name: this.data[i][0]});
        }

        //this.outlinePass = new PP.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);



        this.scene.add(this.camera);



    }
    componentDidMount(){


        const result = fetch('http://localhost:8080').then(response => {
            console.log('HERE HERE')
            console.log(response)}).catch(error => console.log(error))

        //const json = require('../db/bps/21zephyr1111.json');
        console.log('HERE')
        console.log(result);
        console.log('HERE2')


        //this.composer = new PP.EffectComposer(new THREE.WebGLRenderer());
        //this.composer.addPass( new PP.RenderPass(this.scene, this.camera) );
        this.renderer= new THREE.WebGLRenderer({antialias: true})
        this.renderer.setClearColor(0x0000, 1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.mount.appendChild(this.renderer.domElement)
        //this.clock = new THREE.Clock()
        console.log(this.renderer.domElement)
        console.log(this.camera)
        // Add controls so you can navigate the scene
        this.controls = new TrackballControls(this.camera, this.renderer.domElement)
        //this.controls = new OrbitControls(this.camera)
        //this.controls.domElement = this.renderer.domElement


        // Resize things when the window resizes
        window.addEventListener('resize', this.onResize.bind(this))
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        //this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);

        //document.addEventListener('mousemove', this.onMouseMove(this), false);
        //this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);






        this.start()

    }
    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }
    animate = () => {

        this.frameId = window.requestAnimationFrame(this.animate)






        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.mouse, this.camera);
        var intersects = raycaster.intersectObjects(this.pointCubes,true);
        //console.log(this.scene.children)
        var mat2 = new THREE.LineBasicMaterial( { color: 0xffff00, linewidth: 2 } );


        if (intersects.length > 0) {
            if ( intersects[ 0 ].object != this.intersected )
            {
            // if the closest object intersected is not the currently stored intersection object
                {
                    // restore previous intersection object (if it exists) to its original color
                    if (this.intersected)
                        this.intersected.material = this.intersected.currentMaterial;
                    //store reference to closest object as current intersection object
                    this.intersected = intersects[0].object;
                    this.intersected.currentMaterial = this.intersected.material
                    // set a new color for closest object
                    this.intersected.material = this.activeBpMat;
                    

                    console.log("Intersected object:", intersects.length);
                    //intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
                    //this.outlinePass.selectedObjects = intersects[0].object;


                    //intersects[0].object.material = mat

                    const selectedBpId = intersects[0].object.name;
                    console.log(selectedBpId);

                    this.props.onChangeSelectedBp(selectedBpId.name);
                }

            }
        }


        this.controls.update()
        this.renderer.render(this.scene, this.camera)
        //this.composer.render(this.clock.getDelta())
    }


    onResize() {
        // Update the camera's aspect ratio and the renderer's size
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }


    render () {


        return (
            <div
                style={{ width: '400px', height: '400px' }}
                ref={(mount) => { this.mount = mount }}
            />        )

    }



    colorFn(x) {

        const c = new Color();
        c.setHSL(( 0.6 - ( x * 0.5 ) ), 1.0, 0.5);
        return c;
    }

    addData(data, name) {
        var lat, lng, id, size, color, i, step;

        step = 5;


        // if (this._baseGeometry === undefined) {

        this._baseGeometry = new Geometry();
        for (let i = 0; i < data.length; i += step) {
            lat = data[i];
            lng = data[i + 1];
            size = data[i + 2];
            //id = data[i + 3];
            color = new Color(0.0, 1.0, 1.0);

            //color = this.colorFn(data[i + 2]);

            size = 1;
            var point = this.createPoint(lat, lng, color, name);
            this.groupOfPoints.add(point);


        }
        this.pointCubes.push(this.groupOfPoints)
        this.scene.add(this.groupOfPoints);

        //}

    };


    createPoint(lat, lng, color, name) {

        var phi = (90 - lat) * Math.PI / 180;
        var theta = (180 - lng) * Math.PI / 180;

        var point = this.point.clone();
        point.name=name;
        point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
        point.position.y = 200 * Math.cos(phi);
        point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

        point.lookAt(this.sphereOut.position);

        point.scale.z = 0.1; // avoid non-invertible matrix
        point.updateMatrix();

        for (let i = 0; i < this.point.geometry.faces.length; i++) {

            point.geometry.faces[i].color = color;

        }
        if (point.matrixAutoUpdate) {
            point.updateMatrix();
        }
        return point;
    }

    onMouseMove(event) {
        event.preventDefault();



        this.mouse = new THREE.Vector2();
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;




    }

    onMouseDown(event) {
        event.preventDefault();


    }

    onMouseUp( event ) {

        document.removeEventListener( 'mousemove', this.onMouseMove.bind(this), false );
        document.removeEventListener( 'mouseup', this.onMouseUp.bind(this), false );
        document.removeEventListener( 'mouseout', this.onMouseOut.bind(this), false );
    }

    onMouseOut( event ) {

        document.removeEventListener( 'mousemove', this.onMouseMove.bind(this), false );
        document.removeEventListener( 'mouseup', this.onMouseUp.bind(this), false );
        document.removeEventListener( 'mouseout', this.onMouseOut.bind(this), false );
    }




}

export default Playground

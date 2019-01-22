import React, { Component } from 'react'

import {
    PerspectiveCamera, Scene, SphereGeometry, Geometry, Color, FaceColors, Matrix4, LineBasicMaterial,
    BoxGeometry, MeshBasicMaterial, Mesh, ShaderMaterial, ImageUtils, BackSide, AdditiveBlending
} from 'three'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import * as EarthShader from '../shaders/earth'
import * as ATMShader from '../shaders/atmosphere'
import bars from '../db/blockproducers.json'

import extend from 'extend'
import img from '../db/world.jpg'

class Playground extends Component{



    constructor(renderer) {
        super();

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        var offset = new THREE.Vector3(10, 10, 10);


        const distance = 1000;

        // Update the renderer
        this.renderer = renderer
        this.renderer.setClearColor(0x0000, 1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        // Make a camera
        this.camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
        this.camera.position.z = distance;
        this.pointCubes = [];
        this.groupOfPoints = new THREE.Group();
        // Make a scene, add the camera to it
        this.scene = new Scene()
        //this.scene.add(this.camera)



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

        // Add controls so you can navigate the scene
        this.controls = new TrackballControls(this.camera, this.renderer.domElement)
        //this.controls.rotateSpeed = 1.0;
        //this.controls.zoomSpeed = 1.2;
        //this.controls.panSpeed = 0.8;
        //this.controls.noZoom = false;
        //this.controls.noPan = false;
        //this.controls.staticMoving = true;
        //this.controls.dynamicDampingFactor = 0.3;



        this.scene.add(this.camera);


        // Resize things when the window resizes
        window.addEventListener('resize', this.onResize.bind(this))
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);

        //document.addEventListener('mousemove', this.onMouseMove(this), false);
    }

    onResize() {
        // Update the camera's aspect ratio and the renderer's size
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    loop() {

        // Updates the trackball controls
        this.controls.update()

        // Renders the scene
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        const {onChangedSelectedBp} = this.props;

        return (
            <div>
                <canvas id='canvas'>Description</canvas>
            </div>);
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
        var mouse = new THREE.Vector2();
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        var intersects = raycaster.intersectObjects(this.pointCubes,true);
        //console.log(this.scene.children)
        if (intersects.length > 0) {
            console.log("Intersected object:", intersects.length);
            intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
            const selectedBpId = intersects[0].object.name;
            console.log(selectedBpId);

            this.props.onChangedSelectedBp(this.props.selectedBpId);
        }


        this.mouse.set(event.clientX,event.clientY);

    }

    onMouseDown(event) {
        event.preventDefault();

        document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
        document.addEventListener( 'mouseup', this.onMouseUp.bind(this), false );
        document.addEventListener( 'mouseout', this.onMouseOut.bind(this), false );

        this.mouseXOnMouseDown = event.clientX - this.windowHalfX;
        this.targetRotationOnMouseDownX = this.targetRotationX;

        this.mouseYOnMouseDown = event.clientY - this.windowHalfY;
        this.targetRotationOnMouseDownY = this.targetRotationY;
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
import { PerspectiveCamera, Scene, SphereGeometry, Geometry, Color, FaceColors,Matrix4,LineBasicMaterial,
    BoxGeometry, MeshBasicMaterial, Mesh, ShaderMaterial, ImageUtils,BackSide,AdditiveBlending } from 'three'
import * as THREE from 'three'
import TrackballControls from 'three-trackballcontrols'
import * as EarthShader from '../shaders/earth'
import * as ATMShader from '../shaders/atmosphere'
import bars from '../db/population.json'

import extend from 'extend'
import img from '../db/world.jpg'
class Playground {



    constructor (renderer) {
        const distance = 1000;

        // Update the renderer
        this.renderer = renderer
        this.renderer.setClearColor(0x0000, 1)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        // Make a camera
        this.camera = new PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
        this.camera.position.z = distance;

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
        this.sphereOut.scale.set( 1.1, 1.1, 1.1 );
        this.scene.add(this.sphere)
        this.scene.add(this.sphereOut)


        this.boxGeometry = new BoxGeometry(1, 1, 1);
        this.boxGeometry.applyMatrix(new Matrix4().makeTranslation(0,0,-0.5));

        this.point = new Mesh(this.boxGeometry);


        this.data = bars;
        console.log(this.data)
        for (let i=0;i<this.data.length;i++) {
            console.log(this.data[i][0])
            console.log(this.data[i][1])

            this.addData(this.data[i][1], {format: 'magnitude', name: this.data[i][0], animated: true});
        }
        this.createPoints();


        // Add controls so you can navigate the scene
        this.controls = new TrackballControls(this.camera, this.renderer.domElement)
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        var mater = new LineBasicMaterial({ color: 0xAAFFAA });

// crosshair size
        var x = 0.01, y = 0.01;

        var geom = new Geometry();

// crosshair
        geom.vertices.push(new THREE.Vector3(0, y, 0));
        geom.vertices.push(new THREE.Vector3(0, -y, 0));
        geom.vertices.push(new THREE.Vector3(0, 0, 0));
        geom.vertices.push(new THREE.Vector3(x, 0, 0));
        geom.vertices.push(new THREE.Vector3(-x, 0, 0));

        var crosshair = new THREE.Line( geom, mater );

// place it in the center
        var crosshairPercentX = 50;
        var crosshairPercentY = 50;
        var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
        var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

        crosshair.position.x = crosshairPositionX * this.camera.aspect;
        crosshair.position.y = crosshairPositionY;

        crosshair.position.z = -0.3;

        this.camera.add( crosshair );
        this.scene.add( this.camera );


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

        // Updates the trackball controls
        this.controls.update()

        // Renders the scene
        this.renderer.render(this.scene, this.camera)
    }
    colorFn(x) {

        const c = new Color();
        c.setHSL(( 0.6 - ( x * 0.5 ) ), 1.0, 0.5);
        return c;
    }

    addData(data, opts) {
        var lat, lng, id, size, color, i, step, colorFnWrapper;

        opts.animated = opts.animated || false;
        this.is_animated = opts.animated;
        opts.format = opts.format || 'legend'; // other option is 'legend'
        if (opts.format === 'magnitude') {
            step = 3;

            colorFnWrapper = function(data, i) { return this.colorFn(data[i+2]); }
        }

        else {

            throw('error: format not supported: '+opts.format);
        }

        if (opts.animated) {
            //if (this._baseGeometry === undefined) {

                this._baseGeometry = new Geometry();
                for (let i = 0; i < data.length; i += step) {
                    lat = data[i];
                    lng = data[i + 1];
                    size = data[i+2];
                    //id = data[i + 3];
                    console.log(data)
                    console.log(i)

                    color = this.colorFn(data[i+2]);
                    console.log('check')

                    size = 1;
                    this.addPoint(lat, lng, size, id, color, this._baseGeometry);
                    console.log('check')

                }
            //}


            if(this._morphTargetId === undefined) {
                this._morphTargetId = 0;
            } else {
                this._morphTargetId += 1;
            }
            opts.name = opts.name || 'morphTarget'+this._morphTargetId;
        }
        var subgeo = new Geometry();
        for (let i = 0; i < data.length; i += step) {
            lat = data[i];
            lng = data[i + 1];
            color = this.colorFn(data[i+2]);
            size = data[i + 2];
            size = size*200;
            //id = data[i+3]
            this.addPoint(lat, lng, size, id, color, subgeo);
        }

        if (opts.animated) {
            //this._baseGeometry.morphTargets.push({'name': opts.name, vertices: subgeo.vertices});
        } else {
            this._baseGeometry = subgeo;
        }

    };

    createPoints() {
        if (this._baseGeometry !== undefined) {
            if (this.is_animated === false) {
                this.points = new Mesh(this._baseGeometry, new MeshBasicMaterial({
                    color: 0xffffff,
                    vertexColors: FaceColors,
                    morphTargets: false
                }));
            } else {
                if (this._baseGeometry.morphTargets.length < 8) {
                    console.log('t l',this._baseGeometry.morphTargets.length);
                    var padding = 8-this._baseGeometry.morphTargets.length;
                    console.log('padding', padding);
                    for(let i=0; i<=padding; i++) {
                        console.log('padding',i);
                        this._baseGeometry.morphTargets.push({'name': 'morphPadding'+i, vertices: this._baseGeometry.vertices});
                    }
                }
                this.points = new Mesh(this._baseGeometry, new MeshBasicMaterial({
                    color: 0xffffff,
                    vertexColors: FaceColors,
                    morphTargets: true
                }));
            }
            this.scene.add(this.points);
        }
    }

    addPoint (lat, lng, size, id, color, subgeo) {

        var phi = (90-lat) * Math.PI / 180;
        var theta = (180 - lng) * Math.PI / 180;

        this.point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
        this.point.position.y = 200 * Math.cos(phi);
        this.point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

        this.point.lookAt(this.sphereOut.position);

        this.point.scale.z = 0.1; // avoid non-invertible matrix
        this.point.updateMatrix();

        for (let i = 0; i < this.point.geometry.faces.length; i++) {

            this.point.geometry.faces[i].color = color;

        }
        if(this.point.matrixAutoUpdate){
            this.point.updateMatrix();
        }
        subgeo.merge(this.point.geometry, this.point.matrix);
    }




}

export default Playground

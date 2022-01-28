import React, { Component } from "react";
import ReactDOM from "react-dom";
import *  as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Model extends Component {
    componentDidMount() {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

        }

        camera.position.z = 5;
        camera.position.x = 0;
        camera.position.y = 0;

        scene.add(new THREE.AmbientLight(0x333333));

        scene.background = new THREE.Color(0xffffff);
        const textureLoader = new THREE.TextureLoader();

        const earthNormalMap = textureLoader.load("./earth_normal_map.jpg");
        const earthTexture = textureLoader.load("./earth_bump_texture.jpg");
        const earthSpecular = textureLoader.load("./earth_water_shine.png");
        const earthClouds = textureLoader.load("./earth_clouds_texture.png");
        const galaxyTexture = textureLoader.load("./galaxy_starfield.png");

        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            format: THREE.RGBFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
            encoding: THREE.sRGBEncoding
        });

        const cubeCamera = new THREE.CubeCamera(1, 10000, cubeRenderTarget);



        const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 80, 80), new THREE.MeshPhongMaterial({ map: earthNormalMap, displacementMap: earthTexture, displacementScale: .06, specularMap: earthSpecular, specular: 'grey', shininess: 10 }))
        earth.geometry.attributes.uv2 = earth.geometry.attributes.uv
        earth.position.y = 0
        earth.position.x = 0
        earth.position.z = 0
        earth.add(cubeCamera)
        scene.add(earth)

        const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.04, 80, 80), new THREE.MeshPhongMaterial({ map: earthClouds, transparent: true }))
        scene.add(clouds)

        const galaxy = new THREE.Mesh(new THREE.SphereGeometry(90, 160, 160), new THREE.MeshPhongMaterial({ map: galaxyTexture, side: THREE.BackSide, shininess: 5 }))
        scene.add(galaxy)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        function animate() {
            controls.update();
            cubeCamera.update(renderer, scene);
            earth.rotation.y += 0.0005;
            clouds.rotation.y += 0.0005;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        animate();

    }
    render() {
        return (
            <div ref={ref => (this.mount = ref)} />
        )
    }
}

export default Model;
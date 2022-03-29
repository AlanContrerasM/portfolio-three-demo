import React, { useRef, useEffect } from "react";
// import * as THREE from 'three';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  DoubleSide,
  MeshPhongMaterial,
  DirectionalLight,
  FlatShading,
} from "three";
import * as dat from 'dat.gui';

const Background = () => {
  const mountDiv = useRef(null);
  

  useEffect(() => {
    //for our gui controls
    const gui = new dat.GUI();
    const world = {
        plane: {
            width:5,
            height:5,
            widthSegments: 10,
            heightSegments: 10
        }
    }
    gui.add(world.plane, 'width', 1, 20).
        onChange(generatePlane);
    gui.add(world.plane, 'height', 1, 20).
        onChange(generatePlane);
    gui.add(world.plane, 'widthSegments', 1, 20).
        onChange(generatePlane);
    gui.add(world.plane, 'heightSegments', 1, 20).
        onChange(generatePlane);



    function generatePlane(){
        // console.log("new plane")
        planeMesh.geometry.dispose();
        planeMesh.geometry = new PlaneGeometry(world.plane.width,
                                                world.plane.height,
                                                world.plane.widthSegments,
                                                world.plane.heightSegments);
        const {array} =   planeMesh.geometry.attributes.position;
        for (let i = 0; i < array.length; i+=3) {
            const x = array[i];
            const y = array[i+1];
            const z = array[i+2];

            //let's add randomness to z value
            array[i+2] = z + Math.random();

        }
    }

    const scene = new Scene();
    //takes four arguments,
    //field of view 75 is default
    //aspect ratio (relative to our window dimensions)
    //clipping plane, how close can an object be close to the camera before it gets clipped alltogether,
    //far clipping plane
    const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    //now we need a render
    const renderer = new WebGLRenderer();
    // console.log(scene);
    // console.log(camera);
    // console.log(renderer);

    renderer.setSize(window.innerWidth, window.innerHeight);
    // console.log(devicePixelRatio);
    renderer.setPixelRatio(devicePixelRatio);

    // mount it
    // console.log(mountDiv);
    mountDiv.current.appendChild(renderer.domElement);


    //because everything will by default spawn at center, so lets pan out the camera
    camera.position.z = 5;



    //Let's add a plane, width, height, widthsegments, heightsegments
    const planeGeometry = new PlaneGeometry(5, 5, 10, 10);
    const planeMaterial = new MeshPhongMaterial({ color: 0x0000aa, side: DoubleSide, flatShading: FlatShading });
    const planeMesh = new Mesh(planeGeometry, planeMaterial);
    scene.add(planeMesh);

    //lets check out our geometry and try to change values for segments z values to add depth
    console.log(planeMesh.geometry.attributes
        .position.array);
    //this array contains all of our vertices of our plane, and every third value represents the z value
    //which are currently set to 0, meaning no depth, let's change that.
    const {array} =   planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i+=3) {
        const x = array[i];
        const y = array[i+1];
        const z = array[i+2];

        //let's add randomness to z value
        array[i+2] = z + Math.random();

    }

    //create an all white light, FFFFFF, and brightest intensity 1
    const light = new DirectionalLight(0xFFFFFF, 1);

    //make it so its coming from our direction, x = 0, y = 0, z = 1
    light.position.set(0,0,1);
    scene.add(light);

    // renderer.render(scene, camera)

    //lets make it do funky stuff
    const animate = function () {
      requestAnimationFrame(animate);
      planeMesh.rotation.x += 0.01;
      planeMesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    animate();

    return () => {
      mountDiv.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mountDiv}></div>
    </>
  );
};

export default Background;

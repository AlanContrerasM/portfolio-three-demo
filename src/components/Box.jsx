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
} from "three";

const Box = () => {
  const mountDiv = useRef(null);

  useEffect(() => {
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

    //width, height, and depth?
    const geometry = new BoxGeometry(1, 1, 1);
    //hexadecimal value starts with 0x
    const material = new MeshBasicMaterial({ color: 0x00ffaa });
    const cube = new Mesh(geometry, material);

    scene.add(cube);
    //because everything will by default spawn at center, so lets pan out the camera
    camera.position.z = 5;

    // renderer.render(scene, camera)

    //lets make the cube to funky stuff
    const animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

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

export default Box;

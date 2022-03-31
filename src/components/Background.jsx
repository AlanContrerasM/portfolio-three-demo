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
  Raycaster
} from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui';
import { BufferAttribute } from "three";

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

    //import a raycaster for our hover event
    const raycaster = new Raycaster();
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

    //Set Orbit controls
    const controls = new OrbitControls( camera, renderer.domElement );

    //because everything will by default spawn at center, so lets pan out the camera
    camera.position.z = 5;



    //Let's add a plane, width, height, widthsegments, heightsegments
    const planeGeometry = new PlaneGeometry(5, 5, 10, 10);
    const planeMaterial = new MeshPhongMaterial({ 
      // color: 0x0000aa, //if implementing vertexColors delete this
      side: DoubleSide, 
      flatShading: FlatShading, 
      //vertexColors only defined if we are adding mousemove, and setAttibute color
      vertexColors: true 
    });
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

    //only needed for vertexColors and the mousemove hover effect
    const colors = [];
    for( let i = 0; i< planeMesh.geometry.attributes.position.count; i++){
      colors.push(1,0,0); //color blue
    }
    //add extra attribute for planeMesh, will be optional for our mousemove, hover
    planeMesh.geometry.setAttribute('color', 
      new BufferAttribute(new Float32Array(colors), 3));// basically, we say we are going to pass three values, for color, rgb
    planeMesh.updateMatrixWorld();

    //create an all white light, FFFFFF, and brightest intensity 1
    const light = new DirectionalLight(0xFFFFFF, 1);
    //make it so its coming from our direction, x = 0, y = 0, z = 1
    light.position.set(0,0,1);
    scene.add(light);

    //lets add a light for when we go behind our  object with orbita controls
    const backLight = new DirectionalLight(0xFFFFFF, 1);
    //make it so its coming from our direction, x = 0, y = 0, z = 1
    backLight.position.set(0,0,-1);
    scene.add(backLight);
    
    //this is for the hover mousemove event
    const mouse = {
      x: undefined,
      y: undefined
    }

    //lets make it do funky stuff
    const animate = function () {
      requestAnimationFrame(animate);
      // planeMesh.rotation.x += 0.01;
      // planeMesh.rotation.y += 0.01;
      renderer.render(scene, camera);
      //for the hover or moveover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planeMesh);
      if(intersects.length > 0){
        // console.log(intersects[0].object.geometry.attributes.color);
        const {color} = intersects[0].object.geometry.attributes;
        color.setX(intersects[0].face.a, 0);
        color.setX(intersects[0].face.b, 0);
        color.setX(intersects[0].face.c, 0);
        color.needsUpdate = true;
      }
    };

    animate();

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    //Add hover event, this will be used by raycaster inside our animate function
    
    window.addEventListener("mousemove", (e)=>{
      //we need normalized coordinates, meaning 0,0 is the center of the page
      mouse.x = (e.clientX / innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / innerHeight) * 2 + 1;
    })



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

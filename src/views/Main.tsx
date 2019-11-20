import React, { useEffect } from 'react'
import * as BABYLON from 'babylonjs';

import "./Main.pcss";

export function Main(): JSX.Element {
	useEffect(() => {
		const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
		const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

		const scene = Playground.CreateScene(engine, canvas);

		// Register a render loop to repeatedly render the scene
		engine.runRenderLoop(function () { 
		        scene.render();
		});

		// Watch for browser/canvas resize events
		window.addEventListener("resize", function () { 
		        engine.resize();
		});
	}, []);

	return (
		<canvas id="renderCanvas"/>
	);
}

class Playground { 
    public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;

        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
       // var ground = 
	BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

        return scene;
    }
}


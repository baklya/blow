import React, { useEffect, useRef } from 'react'

import * as BABYLON from 'babylonjs';
import * as MATERIALS from 'babylonjs-materials';
import * as GUI from 'babylonjs-gui';

import waterBump from 'textures/waterbump.png';
import cursorUrl from 'cursors/cross.png';

import './Main.pcss';

export function Main(): JSX.Element {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const engine = new BABYLON.Engine(canvasRef.current, true);
		const scene = Playground.CreateScene(engine, canvasRef.current);

		engine.runRenderLoop(function () { 
			scene.render();
		});

		window.addEventListener("resize", function () { 
			engine.resize();
		});

		canvasRef.current.addEventListener('click', () => {
			canvasRef.current.requestPointerLock();
		}, false);

		document.addEventListener("keypress", (e) => {
			if (e.keyCode === 13) { // todo alt enter
				toggleFullScreen();
			}
		}, false);
	}, []);

	return (
		<canvas className="renderCanvas" ref={ canvasRef }/>
	);
}

class Playground { 
	public static CreateScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement): BABYLON.Scene {
		const scene = new BABYLON.Scene(engine);
		scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // This creates and positions a free camera (non-mesh)
        const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        camera.applyGravity = true;
        camera.ellipsoid = new BABYLON.Vector3(1, 3, 1);
        scene.collisionsEnabled = true;
		camera.checkCollisions = true;
		camera.keysUp = [38, 87];
		camera.keysDown = [40, 83];
		camera.keysLeft = [37, 65];
		camera.keysRight = [39, 68];
		camera.inertia = 0;

		const skyMaterial = new MATERIALS.SkyMaterial("skyMaterial", scene);
		skyMaterial.backFaceCulling = false;

        // Skybox
        const skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('textures/TropicalSunnyDay/TropicalSunnyDay', scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        const sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

        // Move the sphere upward 1/2 its height
        sphere.position.y = 1;

        // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
		const ground = BABYLON.Mesh.CreateGround("ground", 1024, 1024, 32, scene);

		// Water
		const waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 1024, 1024, 32, scene, false);
		const water = new MATERIALS.WaterMaterial("water", scene, new BABYLON.Vector2(1024, 1024));
		water.backFaceCulling = true;
		water.bumpTexture = new BABYLON.Texture(waterBump, scene);
		water.windForce = -5;
		water.waveHeight = 0.2;
		water.bumpHeight = 0.05;
		water.waterColor = new BABYLON.Color3(0, 0, 221 / 255);
		water.colorBlendFactor = 0.5;
		water.addToRenderList(skybox);
		water.addToRenderList(ground);
		water.addToRenderList(sphere);
		waterMesh.material = water;

		ground.checkCollisions = true;
		sphere.checkCollisions = true;

		// GUI
		var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var image = new GUI.Image("cursor", cursorUrl);
        image.width = "32px";
        image.height = "32px";
        advancedTexture.addControl(image);

        return scene;
    }
}

function toggleFullScreen(): void {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}
}
/**
	Geoservant 3D by Kai Noack
	https://www.matheretter.de/geoservant/en/

	This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; version 3 (GPLv3).
	This program is distributed in the hope that it will be useful,	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
	More about this license: https://www.gnu.org/licenses/gpl.html

	License rights:
	- The source code must be made public whenever a distribution of the software is made.
	- The copyright notice must remain unchanged in the file.
	- Modifications of the software must be released under the same license.
	- Changes made to the source code must be documented.
**/

onload = () => {
		const textarea = document.querySelector("#val_drawings")
		const transparentInput = document.querySelector("#val_alpha")
    function updateCanvas() {
        const cubes = textarea.value.trim().split("\n").map(l => {
					l = l.split(" ");
					return {
						name: l[0],
						x: parseFloat(l[1]),
						y: parseFloat(l[2]),
						z: parseFloat(l[3])
					}
				});
        Scene.remove(object),
        object = new THREE.Object3D;
				for (let c = 0; c < cubes.length; ++c) {
					renderCube(cubes[c]);
				}
        Scene.add(object);
    }
    function renderCube(cubeData) {
        const color = "#" + (colors[cubeData.name] || "000");
				const size = 1;

				const meshBasicMaterial = new THREE.MeshBasicMaterial({
      		color: color,
      		opacity: opacity,
      		transparent: true
  			});

				//Cube
        const cube = new THREE.Mesh(new THREE.CubeGeometry(size,size,size), meshBasicMaterial);
				const halfSize = size / 2;
        cube.position.x = cubeData.x + size,
        cube.position.y = cubeData.y + size,
        cube.position.z = cubeData.z + size;

				//Stroke Lines
				const edgesGeometry = new THREE.EdgesGeometry(cube.geometry);
        const lineBasicMaterial = new THREE.LineBasicMaterial({
            color: "#666",
        });
        cube.add(new THREE.LineSegments(edgesGeometry,lineBasicMaterial));
        object.add(cube)
    }
    function render() {
				if (isRendering) {
					setTimeout(function() {
							requestAnimationFrame(render)
					}, 25),
					Controls.update(),
					Canvas.render(Scene, Camera)
				}
    }
    function setRendering(e, timeout = 0) {
				if (e && !isRendering) {
					isRendering = true;
					render();
					if (timeout) {
						setRendering(false, timeout)
					}
				}
				else if (!e && isRendering) {
					setTimeout(() => {
						isRendering = false;
					}, timeout)
				}
    }
    function setStandard() {
        B = document.getElementById("rendercanvas").offsetWidth,
        q = document.getElementById("rendercanvas").offsetHeight,
        Camera.aspect = B / q,
        Camera.updateProjectionMatrix(),
        Canvas.setSize(B, q),
        setRendering(true, 100)
    }
    function setFullscreen() {
        Camera.aspect = window.innerWidth / window.innerHeight,
        Camera.updateProjectionMatrix(),
        Canvas.setSize(window.innerWidth, window.innerHeight),
        setRendering(true, 100)
    }
    let isRendering = false,
		 		opacity = transparentInput.value,
				object = new THREE.Object3D,
				lastInput = ""
    $(textarea).on("keyup change",function(e) {
				setRendering(false);
				const input =  textarea.value.trim();
        if (!([37, 38, 39, 40].indexOf(e.keyCode)+1) && input != lastInput) {
						updateCanvas();
            Camera.lookAt(object.position);
            setRendering(true, 50);
						lastInput = input;
        }
    }),
    $(textarea).focusin(function(e) {
        Controls.noPan = !0
    }).focusout(function(e) {
        Controls.noPan = !1
    }),
    $(document).keyup(function(e) {
        fullscreen && 27 === e.keyCode && $("#fullscreenbtn-close").trigger("click")
    }),
    $("#rendercanvas").mousedown(function(e) {
        setRendering(true);
    }).mouseout(function(e) {
        setRendering(false);
    });
    const container = document.getElementById("rendercanvas");
    const Canvas = Detector.webgl ? new THREE.WebGLRenderer({
        antialias: !0
    }) : new THREE.CanvasRenderer({
        antialias: !0
    });
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    Canvas.setSize(width, height),
    container.appendChild(Canvas.domElement);
    const Camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    Camera.position.z = 3.5,
    Camera.position.y = 5,
    Camera.position.x = -3;
    const Controls = new THREE.OrbitControls(Camera, Canvas.domElement);
    Controls.dollyOut(10);
		Controls.zoomSpeed = 2;
		Controls.maxPolarAngle = Math.PI / 2;
		Controls.rotateSpeed = 0.3;
    const Scene = new THREE.Scene;
    Scene.background = new THREE.Color(16777215);
    Detector.webgl && (Canvas.shadowMap.enabled = true,
    Canvas.shadowMap.type = THREE.PCFSoftShadowMap),
    window.addEventListener("resize", setStandard, false);
    let fullscreen = false;
		transparentInput.onkeyup = transparentInput.onchange = () => {
			Controls.noPan = true,
			opacity = transparentInput.value,
			updateCanvas(),
			setRendering(true, 100)
		}
		transparentInput.onfocusout = () => { Controls.noPan = true; }
		const fullscreenBtnOpen = document.querySelector("#fullscreenbtn");
		const fullscreenBtnClose = document.querySelector("#fullscreenbtn-close");
		fullscreenBtnOpen.onclick = () => {
			fullscreen = true,
			$(container).addClass("fullscreen-canvas"),
			$(fullscreenBtnClose).show(),
			setFullscreen(),
			$(textarea).addClass("fullscreen-val_drawings")
		}
    $(fullscreenBtnClose).click(function() {
        fullscreen = false,
        $(container).removeClass("fullscreen-canvas"),
        $(fullscreenBtnClose).hide(),
        setStandard(),
        $(textarea).removeClass("fullscreen-val_drawings")
    })
		colors = {"minecraft:diamond_ore": "00ffff", "minecraft:iron_ore": "b29855"}
};

function Simulator3D(domWrapper) {
	//Init Dom
	if (!domWrapper) {
		domWrapper = document.createElement("div");
	}
	this.domElement = domWrapper;
	this.domElement.innerHTML = "";
	this.domElement.className = "wrapper3d";

	const innerWrapper = document.createElement("div");
	innerWrapper.className = "wrapper3dinner";
	domWrapper.appendChild(innerWrapper);

	const fullscreenBtnOpen = document.createElement("span");
	fullscreenBtnOpen.title = "Fullscreen";
	fullscreenBtnOpen.className ="fullscreenbtn";
	const openIcon = document.createElement("i");
	openIcon.className = "fa fa-arrows-alt fa-lg";
	openIcon.setAttribute("area-hiden", true);
	fullscreenBtnOpen.appendChild(openIcon);
	fullscreenBtnOpen.onclick = () => {
		this.fullscreen = true,
		$(container).addClass("fullscreen-canvas"),
		$(fullscreenBtnClose).show(),
		this.setFullscreen();
	}
	innerWrapper.appendChild(fullscreenBtnOpen);

	const fullscreenBtnClose = document.createElement("span");
	fullscreenBtnClose.title = "Close Fullscreen";
	fullscreenBtnClose.className ="fullscreenbtn-close";
	const closeIcon = document.createElement("i");
	closeIcon.className = "fa fa-times fa-lg";
	closeIcon.setAttribute("area-hiden", true);
	fullscreenBtnClose.appendChild(closeIcon);
	fullscreenBtnClose.onclick = e => {
			this.fullscreen = false,
			$(container).removeClass("fullscreen-canvas"),
			$(fullscreenBtnClose).hide(),
			this.setStandard();
	}
	innerWrapper.appendChild(fullscreenBtnClose);

	const container = document.createElement("div");
	container.className = "rendercanvas";
	innerWrapper.appendChild(container);

	const geoswitches = document.createElement("div");
	geoswitches.className = "geoswitches";
	innerWrapper.appendChild(geoswitches);

	const alphaswitcher = document.createElement("div");
	alphaswitcher.className = "alphaswitcher";
	alphaswitcher.textContent = "Transparenz: ";
	innerWrapper.appendChild(alphaswitcher);

	const alphavalue = document.createElement("input");
	alphavalue.type = "number";
	alphavalue.min = "0";
	alphavalue.max = "1";
	alphavalue.value = "0.5";
	alphavalue.step = "0.1";
	alphavalue.className = "alphavalue";
	alphavalue.onchange = () => {
		this.Controls.noPan = true,
		this.initCanvas(this.map);
	}
	alphavalue.onfocusout = () => { this.Controls.noPan = true; }
	alphaswitcher.appendChild(alphavalue);

	//Variables
	this.isRendering = false;
	this.fullscreen = false;
	this.opacity = alphavalue.value;
	this.object = new THREE.Object3D;
	this.Canvas = new THREE.WebGLRenderer({ antialias: true });
	const width = container.offsetWidth;
	const height = container.offsetHeight;
	this.Camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
	this.Controls = new THREE.OrbitControls(this.Camera, this.Canvas.domElement);
	this.Scene = new THREE.Scene;

	//Init Variables
	this.Canvas.setSize(width, height),
	this.Canvas.domElement.setAttribute("tabIndex", 0);
	this.Camera.position.z = 3.5,
	this.Camera.position.y = 5,
	this.Camera.position.x = -3;
	this.Controls.dollyOut(10);
	this.Controls.zoomSpeed = 2;
	this.Controls.maxPolarAngle = Math.PI / 2;
	this.Controls.rotateSpeed = 0.3;
	this.Scene.background = new THREE.Color(16777215);

	//Functions
	this.initCanvas = (map = []) => {
			this.map = [];
			this.Scene.remove(this.object),
			this.object = new THREE.Object3D;
			for (let c = 0; c < map.length; ++c) {
				this.addBlock(map[c], false);
			}
			this.Scene.add(this.object);
			this.Camera.lookAt(this.object.position);
			this.setStandard();
			this.setRendering(true, 1);
	}
	this.removeBlock = (coord) => {
		const coordString = JSON.stringify(coord);
		const targetedObj = this.object.children.filter(c => JSON.stringify(c.position) == coordString)
			.forEach(o => {
				this.object.remove(o)
			});
		this.map = this.map.filter(c => c.x != coord.x && c.y != coord.y && c.z != coord.z);
		this.setRendering(true, 1);
	}
	this.addBlock = (cubeData, render=true) => {
			items = items || [];
			const color = "#" + (items.filter(i => i.value == cubeData.name)[0].color || "000");

			const meshBasicMaterial = new THREE.MeshBasicMaterial({
				color: color,
				opacity: this.opacity,
				transparent: true
			});

			//Cube
			const cube = new THREE.Mesh(new THREE.CubeGeometry(1,1,1), meshBasicMaterial);
			cube.position.x = cubeData.x,
			cube.position.y = cubeData.y,
			cube.position.z = cubeData.z;

			//Stroke Lines
			const edgesGeometry = new THREE.EdgesGeometry(cube.geometry);
			const lineBasicMaterial = new THREE.LineBasicMaterial({
					color: "#666",
			});
			cube.add(new THREE.LineSegments(edgesGeometry,lineBasicMaterial));
			this.object.add(cube);
			this.map.push(cubeData);
			if (render) {
				this.setRendering(true, 500);
			}
	}
	this.render = () => {
			if (this.isRendering) {
				setTimeout(() => {
						requestAnimationFrame(this.render)
				}, 25),
				this.Controls.update(),
				this.Canvas.render(this.Scene, this.Camera)
			}
	}
	this.setRendering = (activate, timeout = 0) => {
			if (activate && !this.isRendering) {
				this.isRendering = true;
				this.render();
				if (timeout) {
					this.setRendering(false, timeout);
				}
			}
			else if (!activate && this.isRendering) {
				setTimeout(() => {
					this.isRendering = false;
				}, timeout)
			}
	}
	this.setStandard = () => {
			const width =  container.offsetWidth;
			const height = container.offsetHeight;
			this.Camera.aspect = width / height;
			this.Camera.updateProjectionMatrix();
			this.Canvas.setSize(width, height);
			this.setRendering(true, 100);
	}
	this.setFullscreen = () => {
			this.Camera.aspect = window.innerWidth / window.innerHeight,
			this.Camera.updateProjectionMatrix(),
			this.Canvas.setSize(window.innerWidth, window.innerHeight),
			this.setRendering(true, 100)
	}

	//Events
	container.addEventListener("mouseover", e => { this.Canvas.domElement.focus(); this.setRendering(true); });
	container.addEventListener("mouseout", e => { this.setRendering(false); });
	container.addEventListener("resize", this.setStandard);
	container.addEventListener("keydown", e => {
		if (e.keyCode >= 32 && e.keyCode <= 40) {
			this.Controls.noPan = false;
			e.preventDefault();
			this.setRendering(true, 100);
		}
	});

	this.domElement.addEventListener("DOMNodeInserted", e =>  {
	  this.fullscreen ? this.setFullscreen() : this.setStandard();
	});

	window.addEventListener("resize", this.setStandard, false);
	window.addEventListener("keyup", e => {
		this.fullscreen && 27 === e.keyCode && fullscreenBtnClose.click();
	});

	//Init Canvas
	container.appendChild(this.Canvas.domElement);
	this.setRendering(true, 2000)
	this.initCanvas();
}

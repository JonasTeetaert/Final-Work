// Three Controller
var ThreeController = function() {
	scene = new THREE.Scene();
	this.bottom = -window.innerHeight/2;
	this.planeFar = -2000;
	this.zOutofBounds = 200;
	this.globalSpeed = 20;

	// 3D CAMERA
	this.camera = new THREE.PerspectiveCamera(
		45, 
		window.innerWidth/window.innerHeight, 
		1, 
		-this.planeFar
		);

	// 2D CAMERA
	//this.camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -500, 1000 );

	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});

	this.init();
	window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
}

ThreeController.prototype.init = function() {
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.renderer.domElement);

	// camera pos
	this.camera.position.set( 0, 30, 170);

	// grid
	this.drawGrid(150,20,470,0xff00ff, 0x0000ff);

	// cube
	var geometry = new THREE.BoxGeometry( 10, 10, 10);
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	this.cube = new THREE.Mesh(geometry, material);

	this.cube.position.set(0,100,this.planeFar); 
	scene.add(this.cube);

}

ThreeController.prototype.render = function() {
	this.cube.position.z += 20;

	// move the grid
	//this.moveGrid(150,20,470,0xff00ff, 0x0000ff);

	this.renderer.render(scene, this.camera);
}

ThreeController.prototype.onWindowResize = function() {
	this.camera.aspect =  window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize( window.innerWidth, window.innerHeight );
}

ThreeController.prototype.drawGrid = function(size, divisions, depth, color1, color2) {
	// vertical lines
	this.grid = new Object();
	this.grid.material = new THREE.LineBasicMaterial({
		vertexColors: true
	});
	this.grid.index = 0; 
	this.grid.array = {};
	this.counter = 10;

	for (var i = -divisions/2; i <= divisions/2; i++) {
		var geometry = new THREE.Geometry();
		if (i != 0) {
			geometry.vertices.push(
				new THREE.Vector3( size/divisions * i,0, this.zOutofBounds),
				new THREE.Vector3( size/divisions * i,0, -depth + this.zOutofBounds),
				);
		} else {
			geometry.vertices.push(
				new THREE.Vector3( 0,0, this.zOutofBounds),
				new THREE.Vector3( 0,0, -depth + this.zOutofBounds),
				);
		}

		geometry.colors.push(
			new THREE.Color(color1),
			new THREE.Color(color2),
			);
		var line = new THREE.Line(geometry, this.grid.material);
		scene.add(line);
	}

	// horizontal lines
	for (var i = 1; i <= depth / (size/divisions); i++) {
		var line = new Particle(this.grid);
		line.material = this.grid.material;
		line.geometry = new THREE.Geometry();
		line.geometry.vertices.push(
			new THREE.Vector3(-size/2, 0, -size/divisions * i + this.zOutofBounds),
			new THREE.Vector3(size/2, 0, -size/divisions * i + this.zOutofBounds),
			);
		line.geometry.colors.push(
			new THREE.Color(color1),
			new THREE.Color(color2),
			);

		line.threeObject = new THREE.Line(line.geometry, line.material);
		scene.add(line.threeObject);
	}
}


ThreeController.prototype.moveGrid = function(size, divisions, depth, color1, color2, material) {
	this.counter++;
	if (this.counter >= divisions/2) {
		var line = new Particle(this.grid);
		line.material = this.grid.material;
		line.geometry = new THREE.Geometry();
		line.geometry.vertices.push(
			new THREE.Vector3(-size/2, 0, -depth + this.zOutofBounds),
			new THREE.Vector3(size/2, 0, -depth + this.zOutofBounds),
			);
		line.geometry.colors.push(
			new THREE.Color(color1),
			new THREE.Color(color2),
			);

		line.threeObject = new THREE.Line(line.geometry, line.material);
		scene.add(line.threeObject);
		this.counter = 0;
	}

	for (var i in this.grid.array) {
		this.grid.array[i].move(3);
	}

}

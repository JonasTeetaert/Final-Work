// Three Controller
var ThreeController = function() {
	scene = new THREE.Scene();
	this.size = 800; // grote van de three ruimte
	this.density = 100; // dichtheid van de particles
	this.minX = -this.size;
	this.maxX = this.size;
	this.minY = -this.size;
	this.maxY = this.size;
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
	this.camera.position.set(0, 30, 200);

	// grid
	this.initGrid(150,20,470,0xff00ff, 0x0000ff);

	//particles 
	this.particles = new Object();
	this.particles.array = {};
	this.particles.index = 0;
	//this.particleMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
	this.particleMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	this.particleLength = 10;

}

ThreeController.prototype.render = function() {
	// draw the grid
	this.drawGrid(150,20,470,0xff00ff, 0x0000ff);

	// draw particles
	this.drawParticles();

	this.renderer.render(scene, this.camera);
}

ThreeController.prototype.onWindowResize = function() {
	this.camera.aspect =  window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
	this.renderer.setSize( window.innerWidth, window.innerHeight );
}

ThreeController.prototype.initGrid = function(size, divisions, depth, color1, color2) {
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


ThreeController.prototype.drawGrid = function(size, divisions, depth, color1, color2, material) {
	this.counter++;
	if (this.counter >= divisions/2) {
		var line = new Particle(this.grid);
		line.material = this.grid.material;
		line.geometry = new THREE.Geometry();
		line.geometry.vertices.push(
			new THREE.Vector3(-size/2, 0, -depth - 4 + this.zOutofBounds),
			new THREE.Vector3(size/2, 0, -depth - 4 + this.zOutofBounds),
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
		this.grid.array[i].move(1);
	}

}

ThreeController.prototype.drawParticles = function() {
	for (var i = 0; i < this.density; i++) {
		if (Math.random() > 0.97) { 
			var particle = new Particle(this.particles);
			particle.x = Math.floor(Math.random() * (this.maxX - this.minX)) + this.minX;
			particle.y = Math.floor(Math.random() * (this.maxY - this.minY)) + this.minY;
			particle.material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
			particle.geometry = new THREE.BoxGeometry( 1, 1, 20);
			/*particle.geometry = new THREE.Geometry();
			particle.geometry.vertices.push(
				new THREE.Vector3(particle.x, particle.y, this.planeFar),
				new THREE.Vector3(particle.x, particle.y, this.planeFar - this.particleLength),
				);*/
			particle.threeObject = new THREE.Mesh(particle.geometry, particle.material);
			particle.threeObject.position.set(particle.x, particle.y, this.planeFar);
			scene.add(particle.threeObject);
		}
	}
	for (var i in this.particles.array) {
		this.particles.array[i].move(20);
	}
}

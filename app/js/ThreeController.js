// Three Controller
var ThreeController = function(leapController) {
	this.leapController = leapController;
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	this.counter = 0;

	this.init();
	this.render();
}

ThreeController.prototype.init = function() {
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.renderer.domElement);
	this.camera.position.z = 10;

	// canvas width en height berekenen
    this.vFOV = this.camera.fov * Math.PI / 180;
    this.canvasheight = 2 * Math.tan(this.vFOV / 2) * this.camera.position.z + 1;
    this.aspect = window.innerWidth / window.innerHeight;
    this.canvasWidth = this.canvasheight * this.aspect;

    //Cube
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	this.cube = new THREE.Mesh( geometry, material );
	this.scene.add(this.cube);
} 

ThreeController.prototype.render = function() {
	requestAnimationFrame(this.render.bind(this));
	this.leapController.update();
	
	this.cube.rotation.y += 0.1;
	this.renderer.render(this.scene, this.camera);
}
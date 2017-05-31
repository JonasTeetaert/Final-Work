// Three Controller
var ThreeController = function(leapController) {
	this.leapController = leapController;
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -500, 1000 );
	this.renderer = new THREE.WebGLRenderer({
		antialias: true
	});

	this.init();
}

ThreeController.prototype.init = function() {
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(this.renderer.domElement);


	// canvas width en height berekenen
   	this.vFOV = this.camera.fov * Math.PI / 180;
    this.canvasheight = 2 * Math.tan(this.vFOV / 2) * this.camera.position.z + 1;
    this.aspect = window.innerWidth / window.innerHeight;
    this.canvasWidth = this.canvasheight * this.aspect;

} 

ThreeController.prototype.render = function() {
	requestAnimationFrame(this.render.bind(this)); //TODO: request animframe uitbreiden
	this.leapController.update();
	menu.checkPlayMode();


	this.renderer.render(this.scene, this.camera);
}
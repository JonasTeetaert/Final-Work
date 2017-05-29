// Hand
var Hand = function(scene, type) {
	// visual aspect
	this.geometry = new THREE.BoxGeometry( 40, 40, 40);
	this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	this.threeObject = new THREE.Mesh( this.geometry, this.material );
	this.type = type;
	this.speed = 2.5; // hoe rap je de hand beweegt
	this.playMode = true; // true = ACTIVE, false = MENU

	if (this.type == 'left') {
		this.startPos = new THREE.Vector3(-window.innerWidth/4, -window.innerHeight/4, 0);
		this.previousPos = this.startPos;
	} 
	if (this.type == 'right') {
		this.startPos = new THREE.Vector3(window.innerWidth/4, -window.innerHeight/4, 0);
		this.previousPos = this.startPos;
	}

	this.threeObject.position.x = this.startPos.x;
	this.threeObject.position.y = this.startPos.y;
	scene.add(this.threeObject);

	this.effects = [];
	this.instruments = [];

	for (var i = 0; i < 5; i++) {
		this.effects.push(new Effect());
		this.instruments.push(new Instrument());
	}
}

Hand.prototype.updatePos = function(frame, index) {
	this.previousPos = this.position;

	this.hand = frame.hands[index];
	this.position = new THREE.Vector3(this.hand.palmPosition[0], this.hand.palmPosition[1], this.hand.palmPosition[2]);
	if (this.playMode) {

	}

	this.calculatePos();
	this.calculatePlayMode();
}

Hand.prototype.calculatePos = function() {
	this.threeObject.position.x -= (this.previousPos.x - this.position.x) * this.speed;
	this.threeObject.position.y -= (this.previousPos.y - this.position.y) * this.speed;
}

Hand.prototype.calculatePlayMode = function() {
	if (this.hand.grabStrength >= 1 ) {
		this.threeObject.material.color.setHex(0xff0000);
		this.playMode = false; // MENU

	} else {
		this.threeObject.material.color.setHex(0x00ff00);
		this.playMode = true; // ACTIVE
	}
}
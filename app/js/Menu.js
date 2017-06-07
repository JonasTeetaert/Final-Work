// Menu
var Menu = function() {
	this.rows = 6;
	this.left = -window.innerWidth/2;
	this.top = window.innerHeight/2 - window.innerHeight/ (this.rows * 2);
	this.menuItemWidth = window.innerWidth/4;
	this.menuItemHeight = window.innerHeight / this.rows;
	this.leftHandMenuItems = [];
	this.rightHandMenuItems = [];
	this.init();
};

Menu.prototype.init = function() {
	this.bgSound = new MenuItem(scene, window.innerWidth, this.menuItemHeight, 0, this.top);

	for (var i = 1; i <= effects.length; i++) {
		this.leftHandMenuItems.push(new MenuItem(scene, this.menuItemWidth, this.menuItemHeight, this.left +  this.menuItemWidth/2, this.top - this.menuItemHeight * i+1));
    this.rightHandMenuItems.push(new MenuItem(this.scene, this.menuItemWidth, this.menuItemHeight, this.menuItemWidth/2 , this.top - this.menuItemHeight * i+1));
	}
	for (var i = 1; i <= instruments.length; i++) {
		this.leftHandMenuItems.push(new MenuItem(scene, this.menuItemWidth, this.menuItemHeight, this.left + 3*this.menuItemWidth/2, this.top - this.menuItemHeight * i+1));
    this.rightHandMenuItems.push(new MenuItem(scene, this.menuItemWidth, this.menuItemHeight, 3/2 * this.menuItemWidth, this.top - this.menuItemHeight * i+1));
	}
};

// Menu item 

Menu.prototype.checkPlayMode = function() { // checkplaymode in handobject?
	if (!leftHand.playMode || !rightHand.playMode ) {
		this.bgSound.material.opacity = 1;
	} else {
		this.bgSound.material.opacity = 0;
	}

	if (!leftHand.playMode) {
		// lefthand menu active
		for (var i = 0; i < this.leftHandMenuItems.length; i++) {
			this.leftHandMenuItems[i].material.opacity = 1;
		}

	} else {
		for (var i = 0; i < this.leftHandMenuItems.length; i++) {
			this.leftHandMenuItems[i].material.opacity = 0;
		}
	}

	if (!rightHand.playMode) {
		// rightHand menu active
		for (var i = 0; i < this.rightHandMenuItems.length; i++) {
			this.rightHandMenuItems[i].material.opacity = 1;
		}

	} else {
		for (var i = 0; i < this.rightHandMenuItems.length; i++) {
			this.rightHandMenuItems[i].material.opacity = 0;
		}

	}
};



var MenuItem = function(width, height, x, y) {
	this.width = width;
	this.height = height;
	this.geometry = new THREE.PlaneGeometry(width, height, 0);
	this.material = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true});
	this.material.transparent = true;
	this.material.opacity = 0;
	this.threeObject = new THREE.Mesh(this.geometry, this.material);
	scene.add(this.threeObject);

	this.threeObject.position.x = x;
	this.threeObject.position.y = y;

	this.active = false;
};

MenuItem.prototype.hover = function(hand) {
	if (hand.threeObject.position.x > this.threeObject.position.x && hand.threeObject.position.x < this.threeObject.position.x + this.width && hand.threeObject.position.y < this.threeObject.position.y && hand.threeObject.position.y > this.threeObject.position.y + this.height) {
		console.log('hover');
	}
};

MenuItem.prototype.active = function() {
	this.active = true;
	this.material.wireframe = false;
	this.material.opacity = 1;
};


// Menu
var Menu = function(nodeSelector) {
	this.node = document.querySelector(nodeSelector);
	this.hands = this.node.querySelector('.hands');
	this.leftHand = this.hands.querySelector('.left-hand');
	this.rightHand = this.hands.querySelector('.right-hand');

	this.leftHandMenuItems = [];
	this.rightHandMenuItems = [];

	this.init();
};

Menu.prototype.init = function() {

	// bg-sound
	this.bgSound = new MenuItem(0,90);
	this.bgSound.setIcon('.icon-bgSound');

};

// Hand Menu
var HandMenu = function(Hand) {
	this.hand = Hand;
	if (this.hand.type == 'left') {
		this.node = menu.node.querySelector('.left-hand');
		this.menuPosX = -1;
		this.htmlBool = true;
	}

	if (this.hand.type == 'right') {
		this.node = menu.node.querySelector('.right-hand');
		this.menuPosX = 1;
		this.htmlBool = false;
	}

	this.menuPosY = 60;

	this.node.style.opacity = 0;

	this.effectsNode = this.node.querySelector('.effects');
	this.instrumentsNode = this.node.querySelector('.instruments');
	this.instruments = [];
	this.effects = [];

	this.init();
}

HandMenu.prototype.init = function() {
	for (var i=0; i < effects.length; i++) {
		this.effects.push(new MenuItem(this.menuPosX * 100, this.menuPosY, effects[i].name,i,this.hand));
		this.menuPosY -= 20;
		this.effects[i].appendEffectHTML(this.effectsNode, this.htmlBool);
		this.effects[i].setNode(this.effectsNode);
	}

	this.menuPosY = 60;

	for (var i=0; i < instruments.length; i++) {
		this.instruments.push(new MenuItem(this.menuPosX * 45, this.menuPosY, instruments[i].name, i,this.hand));
		this.menuPosY -= 20;
		this.instruments[i].appendInstrumentHTML(this.instrumentsNode, this.htmlBool);
		this.instruments[i].setNode(this.instrumentsNode);
	}
}

HandMenu.prototype.update = function() {
	for (var i = 0; i < this.instruments.length; i++) {
		this.instruments[i].collisionUpdate();
	} 

	for (var i = 0; i < this.effects.length; i++) {
		this.effects[i].collisionUpdate();
	} 
}

// Menu item 
var MenuItem = function(x, y, text, index, Hand) {
	// THREE
	this.hand = Hand;
	this.index = index;
	this.geometry = new THREE.BoxGeometry(2,2,2);
	this.material = new THREE.MeshBasicMaterial( { color: 0xffffff});
	this.material.transparent = true;
	this.material.opacity = 1; // default 0
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.boxCollider = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	scene.add(this.mesh);

	this.mesh.position.x = x;
	this.mesh.position.y = y;

	this.boxCollider.setFromObject(this.mesh);

	// HTML
	this.text = text;
	this.active = false; // default false
};

// STEP 1
MenuItem.prototype.appendEffectHTML = function(node, bool) {
	if (bool) {
		this.html = '<li>' + this.text + '<div class="status"></div></li>';
		node.innerHTML += this.html;
	} else {
		this.html = '<li>' + this.text + '<div class="status status--right"></div></li>';
		node.innerHTML += this.html;
	}
}

MenuItem.prototype.appendInstrumentHTML = function(node, bool) {
	if (bool) {
		this.html = '<li>' + this.text + '<div class="status status--right"></div></li>';
		node.innerHTML += this.html;
	} else {
		this.html = '<li>' + this.text + '<div class="status"></div></li>';
		node.innerHTML += this.html;
	}
}

// STEP 2
MenuItem.prototype.setNode = function(parentNode) {
	var array = parentNode.querySelectorAll('li');
	for (var i=0; i < array.length; i++) {
		if (this.index == i) {
			this.node = array[i];
		}
	}
}

// voor de bg-sound icon
MenuItem.prototype.setIcon = function(nodeSelector) {
	this.iconNode = document.querySelector(nodeSelector);
}

MenuItem.prototype.On = function() {
	this.active = true;
	this.material.opacity = 1;
};

MenuItem.prototype.Off = function () {
	this.active = false;
	this.material.opacity = 0;
}

MenuItem.prototype.collisionUpdate = function() {
	if (this.boxCollider.intersectsBox(this.hand.boxCollider)) {
		console.log('collision detected');
	}
}


/*Menu.prototype.checkPlayMode = function() { // checkplaymode in handobject?

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
};*/

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

	this.currentEffect;
	this.currentInstr;

	this.init();
}

HandMenu.prototype.init = function() {

	for (var i=0; i < effects.length; i++) {
		this.effects.push(new MenuItem(this.menuPosX * 100, this.menuPosY, effects[i].name,i,this.hand));
		this.menuPosY -= 20;
		this.effects[i].appendEffectHTML(this.effectsNode, this.htmlBool);
	}

	for (var i = 0; i < this.effects.length; i++) {
		this.effects[i].setNode(this.effectsNode);
		this.effects[i].off();
	}

	this.menuPosY = 60;

	for (var i=0; i < instruments.length; i++) {
		this.instruments.push(new MenuItem(this.menuPosX * 45, this.menuPosY, instruments[i].name, i,this.hand));
		this.menuPosY -= 20;
		this.instruments[i].appendInstrumentHTML(this.instrumentsNode, this.htmlBool);
	}

	for (var i=0; i < this.instruments.length; i++) {
		this.instruments[i].setNode(this.instrumentsNode);
		this.instruments[i].off();
	}

	this.off();
}

HandMenu.prototype.update = function() {
	for (var i = 0; i < this.instruments.length; i++) {
		this.instruments[i].collisionUpdate();
	} 

	for (var i = 0; i < this.effects.length; i++) {
		this.effects[i].collisionUpdate();
	} 
}

HandMenu.prototype.on = function() {
	this.node.style.opacity = 1;
	for (var i=0; i < this.instruments.length; i++) {
		if (this.instruments[i].active == false) {
			this.instruments[i].material.opacity = 1;
		}
	}

	for (var i=0; i < this.effects.length; i++) {
		if (this.effects[i].active == false) {
			this.effects[i].material.opacity = 1;
		}
	}
}

HandMenu.prototype.off = function() {
	this.node.style.opacity = 0;

	for (var i=0; i < this.instruments.length; i++) {
		this.instruments[i].material.opacity = 0;
	}

	for (var i=0; i < this.effects.length; i++) {
		this.effects[i].material.opacity = 0;
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
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.boxCollider = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
	scene.add(this.mesh);
	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.boxCollider.setFromObject(this.mesh);

	this.startHoverTime = 0;
	this.deltaTime = 0;
	this.active = false; // default false

	// HTML
	this.text = text;
};

// STEP 1
MenuItem.prototype.appendEffectHTML = function(node, bool) {
	if (bool) {
		this.html = '<li class="item">' + this.text + '<div class="status"></div></li>';
		node.innerHTML += this.html;
	} else {
		this.html = '<li class="item">' + this.text + '<div class="status status--right"></div></li>';
		node.innerHTML += this.html;
	}
}

MenuItem.prototype.appendInstrumentHTML = function(node, bool) {
	if (bool) {
		this.html = '<li class="item">' + this.text + '<div class="status status--right"></div></li>';
		node.innerHTML += this.html;
	} else {
		this.html = '<li class="item">' + this.text + '<div class="status"></div></li>';
		node.innerHTML += this.html;
	}
}

// STEP 2
MenuItem.prototype.setNode = function(parentNode) {
	var array = parentNode.querySelectorAll('.item');
	for (var i= 0; i < array.length; i++) {
		if (this.index == i) {
			this.node = array[i];
			this.status = this.node.querySelector('.status');
			return;
		}
	}
}

// voor de bg-sound icon
MenuItem.prototype.setIcon = function(nodeSelector) {
	this.iconNode = document.querySelector(nodeSelector);
}

MenuItem.prototype.on = function() {
	this.active = true;
	this.mesh.material.opacity = 0;
	this.node.classList.add('active');
};

MenuItem.prototype.off = function () {
	this.active = false;
	this.mesh.material.opacity = 1;
	this.node.classList.remove('active');
}

MenuItem.prototype.collisionUpdate = function() {
	if (this.boxCollider.intersectsBox(this.hand.boxCollider) && !this.hand.playMode && !this.active) {
		if (this.startHoverTime == 0) { // start hover
			this.startHoverTime = Date.now();
			this.status.classList.add('status--hover');
			return;
		}

		this.deltaTime = Date.now() - this.startHoverTime;
		console.log(this.deltaTime);

		if (this.deltaTime >= 2000) { // end hover
			this.on();
			this.startHoverTime = null;
		} else {
			if (!this.active) {
				this.off();
			}
		}

	} else {
		this.startHoverTime = 0;
		this.deltaTime = 0;
		if (!this.active) {
			this.status.classList.remove('status--hover');
		}
	}
}

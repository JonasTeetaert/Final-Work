// Menu item 
var MenuItem = function(x, y, text, index, Hand, type, handMenu) {
	// THREE
	this.hand = Hand;
	this.handMenu = handMenu;
	this.type = type;
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
	
	if (this.type == 'effect') {
		this.hand.releaseNotes();
		this.hand.setEffect(this.index);
	}

	if (this.type == 'instrument') {
		this.hand.releaseNotes();
		this.hand.setInstrument(this.index);
	}

	this.handMenu.previousActiveItem = this.handMenu.currentActiveItem;
	this.handMenu.currentActiveItem = this;

	if (this.handMenu.previousActiveItem != undefined) {
		this.handMenu.previousActiveItem.off();
	}

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

		if (this.deltaTime >= 1000) { // end hover
			this.on();
			this.startHoverTime = null;
		} else {
			if (this.active) {
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
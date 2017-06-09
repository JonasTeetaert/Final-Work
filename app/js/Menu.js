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

	this.previousActiveItem = undefined;
	this.currentActiveItem = undefined;

	this.init();
}

HandMenu.prototype.init = function() {

	for (var i=0; i < effects.length; i++) {
		this.effects.push(new MenuItem(this.menuPosX * 100, this.menuPosY, effects[i].name,i,this.hand,'effect', this));
		this.menuPosY -= 20;
		this.effects[i].appendEffectHTML(this.effectsNode, this.htmlBool);
	}

	for (var i = 0; i < this.effects.length; i++) {
		this.effects[i].setNode(this.effectsNode);
		this.effects[i].off();
	}

	this.menuPosY = 60;

	for (var i=0; i < instruments.length; i++) {
		this.instruments.push(new MenuItem(this.menuPosX * 45, this.menuPosY, instruments[i].name, i,this.hand, 'instrument', this));
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

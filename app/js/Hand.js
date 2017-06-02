// Hand
var Hand = function(type) {
	// visual aspect
	this.geometry = new THREE.BoxGeometry( 40, 40, 40);
	this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	this.threeObject = new THREE.Mesh( this.geometry, this.material );
	this.type = type;
	this.speed = 2.5; // hoe rap je de hand beweegt
	this.playMode = true; // true = ACTIVE, false = MENU
	this.fingers = [];
	this.position = new THREE.Vector3(0, 0, 0);
	this.active = false;

	if (this.type == 'left') {
    for (var i = 0; i < 5; i++) {
      this.fingers[i] = new Finger(noteMap[4 - i]);
    }
		this.startPos = new THREE.Vector3(-window.innerWidth/4, -window.innerHeight/4, 0);
		this.previousPos = this.startPos;
	} 
	if (this.type == 'right') {
    for (var i = 0; i < 5; i++) {
      this.fingers[i] = new Finger(noteMap[5 + i]);
    }
		this.startPos = new THREE.Vector3(window.innerWidth/4, -window.innerHeight/4, 0);
		this.previousPos = this.startPos;
	}

	this.threeObject.position.x = this.startPos.x;
	this.threeObject.position.y = this.startPos.y;
	threeController.scene.add(this.threeObject);

};

Hand.prototype.setEffect = function(fx) {
	this.effect ? this.effect.dispose() : null;
  this.effect = fx.toMaster();
};

Hand.prototype.setInstrument = function(instr) {
  this.instrument ? this.instrument.dispose() : null;
  this.instrument = instr.toMaster();
};

Hand.prototype.detectTrigger = function() {
  for (var i = 0; i < this.hand.fingers.length; i++) {
    this.fingers[i].update(this.hand.fingers[i]);

    if (this.fingers[i].isDown && !this.fingers[i].wasDown) {
      this.instrument.triggerAttack(this.fingers[i].note);
    } else if (this.fingers[i].wasDown && !this.fingers[i].isDown) {
      console.log('release');
      this.instrument.triggerRelease(this.fingers[i].note);

    }
  }
};

Hand.prototype.update = function() {
  switch (frame.hands.length) {
    case 0:
      this.active = false;
      if (this.hand) {
        for (var i = 0; i < this.hand.fingers.length; i++) {
          this.instrument.triggerRelease(this.fingers[i].note);
        }
      }
      break;
    case 1:
      if (frame.hands[0].type === this.type) { // handen en vingers zijn gedetecteerd en actief
        this.active = true;
        this.hand = frame.hands[0];
        this.previousPos = this.position;
        this.position = new THREE.Vector3(this.hand.palmPosition[0], this.hand.palmPosition[1], this.hand.palmPosition[2]);
        if (this.playMode) {

        }
        this.detectTrigger();

        this.calculatePos();
        this.calculatePlayMode();
      } else {
          this.active = false;
          if (this.hand) {
            for (var i = 0; i < this.hand.fingers.length; i++) {
              this.instrument.triggerRelease(this.fingers[i].note);
            }
          }
        }

      break;
    case 2:
      for (var i = 0; i < frame.hands.length; i++) {
        if (frame.hands[i].type === this.type) { // handen en vingers zijn gedetecteerd en actief
          this.active = true;
          this.hand = frame.hands[i];
          this.previousPos = this.position;
          this.position = new THREE.Vector3(this.hand.palmPosition[0], this.hand.palmPosition[1], this.hand.palmPosition[2]);
          if (this.playMode) {

          }
          this.detectTrigger();

          this.calculatePos();
          this.calculatePlayMode();
        }
      }
      break;
		default:
			this.active = false;
  }
  console.log(this.type, this.active);
};

Hand.prototype.calculatePos = function() {
	this.threeObject.position.x -= (this.previousPos.x - this.position.x) * this.speed;
	this.threeObject.position.y -= (this.previousPos.y - this.position.y) * this.speed;
};

Hand.prototype.calculatePlayMode = function() {
	if (this.hand.grabStrength >= 1 ) {
		this.threeObject.material.color.setHex(0xff0000);
		this.playMode = false; // MENU

	} else {
		this.threeObject.material.color.setHex(0x00ff00);
		this.playMode = true; // ACTIVE
	}
};
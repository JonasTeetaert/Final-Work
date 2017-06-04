// Hand
var Hand = function(type) {
	// visual aspect
	this.geometry = new THREE.BoxGeometry( 10, 10, 10);
	this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	this.threeObject = new THREE.Mesh( this.geometry, this.material );
	this.type = type;
	this.speed = 2.5; // hoe rap je de hand beweegt
	this.playMode = true; // true = ACTIVE, false = MENU
	this.fingers = [];
	this.position = new THREE.Vector3(0, 0, 0);
	this.active = false; // hand gedetecteed: true, anders false.  gebruiken voor visuals?

	if (this.type == 'left') {
    for (var i = 0; i < 5; i++) {
      this.fingers[i] = new Finger(noteMap[4 - i]);
    }
	} 
	if (this.type == 'right') {
    for (var i = 0; i < 5; i++) {
      this.fingers[i] = new Finger(noteMap[5 + i]);
    }
	}
	this.threeObject.position.x = this.position.x;
	this.threeObject.position.y = this.position.y;
	threeController.scene.add(this.threeObject);

};

Hand.prototype.setEffect = function(fx) {
	this.clearInstrument()
  fx ? this.effect = fx.toMaster() : null;
};

Hand.prototype.clearEffect = function() {
  this.effect = undefined;
};

Hand.prototype.setInstrument = function(instr) {
  this.clearEffect();
  instr ? this.instrument = instr.toMaster() : null;
};

Hand.prototype.clearInstrument = function() {
  this.instrument = undefined;
};

Hand.prototype.detectTrigger = function() { //detect trigger + update
  for (var i = 0; i < this.hand.fingers.length; i++) {
    this.fingers[i].update(this.hand.fingers[i]);


      if (this.fingers[i].isDown && !this.fingers[i].wasDown && this.playMode && this.instrument) {
        this.instrument.triggerAttack(this.fingers[i].note);
      } else if (this.fingers[i].wasDown && !this.fingers[i].isDown && this.instrument) {
        this.instrument.triggerRelease(this.fingers[i].note);
      }

  }
};

Hand.prototype.releaseNotes = function() {
  if (this.instrument) {
    for (var i = 0; i < this.hand.fingers.length; i++) { // released noten als hand plots van scherm is
      this.instrument.triggerRelease(this.fingers[i].note);
    }
  }
};

Hand.prototype.update = function() {
  if (!this.playMode) {
    this.releaseNotes();
  }
  switch (frame.hands.length) {
    case 0:
      this.active = false;
      if (this.hand) { // check for undefined (first frame)
        this.releaseNotes();
      }
      break;
    case 1:
      if (frame.hands[0].type === this.type) { // 1 hand en vingers zijn gedetecteerd en actief
        this.hand = frame.hands[0];
        this.active = true;

        this.detectTrigger();

        this.calculatePos();
        this.calculatePlayMode();
      } else {
          this.active = false;
          if (this.hand) {
            this.releaseNotes();
            }
          }
      break;
    case 2:
      for (var i = 0; i < frame.hands.length; i++) {
        if (frame.hands[i].type === this.type) { // 2 handen en vingers zijn gedetecteerd en actief
          this.hand = frame.hands[i];
          this.active = true;

          this.detectTrigger();

          this.calculatePos();
          this.calculatePlayMode();
        }
      }
      break;
		default:
			this.active = false;
			break;
  }
};

Hand.prototype.calculatePos = function() {
  this.position.x = (this.hand.palmPosition[0] + 200)*(window.innerWidth/2 + window.innerWidth/2)/(200+200)-window.innerWidth/2;
  this.position.y = (this.hand.palmPosition[1] - 100)*(window.innerHeight/2 + window.innerHeight/2)/(450-100)-window.innerHeight/2;
	this.threeObject.position.x = this.position.x;
	this.threeObject.position.y = this.position.y;
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
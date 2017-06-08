// Hand
var Hand = function(type) {
	// visual aspect
	this.geometry = new THREE.BoxGeometry( 5, 5, 5);
	this.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	this.mesh = new THREE.Mesh( this.geometry, this.material );
  this.boxCollider = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

	this.type = type;
	this.speed = 2.5; // hoe rap je de hand beweegt
	this.playMode = true; // true = ACTIVE, false = MENU
	this.fingers = [];
	this.position = new THREE.Vector3(0, 0, 0);
	this.active = false; // hand gedetecteerd: true, anders false.  gebruiken voor visuals?

	if (this.type == 'left') {
    for (var i = 0; i < 5; i++) {
      this.fingers[i] = new Finger(noteMap[4 - i]);
    }
    // HTML Access
    this.handMenu = new HandMenu(this);
  } 
  if (this.type == 'right') {
    for (var i = 0; i < 5; i++) {
      this.fingers[i] = new Finger(noteMap[5 + i]);
    }
    // HTML Access
    this.handMenu = new HandMenu(this);
  }
  this.mesh.position.x = this.position.x;
  this.mesh.position.y = this.position.y;
  this.mesh.position.z = this.position.z;
  scene.add(this.mesh);

};

Hand.prototype.setEffect = function(fx) {
  this.currentEffect = fx; // nummer van effect in de globale 'effects' array, als deze op undefined staat is effecten niet actief
  // currentEffect variable is nodig om de cyclen met swipes
	this.clearInstrument(); // effecten en instrument niet samen bespeelbaar
  this.effect = effects[fx];
  this.effect ? Tone.Master.chain(this.effect, limiter) : null; // zet effect als chain in master. gooit vorige chain weg: gaat dus niet op 2 handen. weet nog niet wat er gebeurd als er 2 effecten worden ingesteld
  };

Hand.prototype.clearEffect = function() {
  this.effect = undefined;
  this.currentEffect = undefined;
};

Hand.prototype.setInstrument = function(instr) {
  this.currentInstr = instr;  // nummer van huidig instrument in globale 'instruments' array, undefined: geen instr maar een effect toegewezen
  this.clearEffect(); // effecten en instrument niet samen bespeelbaar
  this.instrument = instruments[instr].toMaster(); // connect instr to master (masterchain met effect komt hierna)
  console.log(this.instrument);
};

Hand.prototype.clearInstrument = function() {
  this.instrument = undefined;
  this.currentInstr = undefined;
};

Hand.prototype.next = function() {
  console.log('next');
  if (typeof this.currentInstr !== "undefined") { // als instrument aan staat, cycle door instrumenten
    if (this.currentInstr === instruments.length - 1) {
      this.currentInstr = 0;
    } else {
      this.currentInstr++;
    }
    this.releaseNotes();
    this.setInstrument(this.currentInstr);
  } else if (typeof this.currentEffect !== "undefined") { // als effect aan staat, cycledoor effecten
    if (this.currentEffect === effects.length - 1) {
      this.currentEffect = 0;
    } else {
      this.currentEffect++;
    }
    this.releaseNotes();
    this.setEffect(this.currentEffect);
  }
}

Hand.prototype.previous = function() {
  console.log('previous');
  if (typeof this.currentInstr !== "undefined") { //als instrument aan staat, cycle door instrumenten
    if (this.currentInstr === 0) {
      this.currentInstr = instruments.length - 1;
    } else {
      this.currentInstr--;
    }
    this.releaseNotes();
    this.setInstrument(this.currentInstr);
  } else if (typeof this.currentEffect !== "undefined") { // als effect aanstaat, cycle door effecten
    if (this.currentEffect === 0) {
      this.currentEffect = effects.length - 1;
    } else {
      this.currentEffect--;
    }
    this.releaseNotes();
    this.setEffect(this.currentEffect);
  }
}

Hand.prototype.updateFinger = function() { //detect trigger + updatefinger
  for (var i = 0; i < this.hand.fingers.length; i++) {
    this.fingers[i].update(this.hand.fingers[i]);

      //kijken of vinger naar beneden is en vorig frame niet: trigger. zoniet word hij getriggerd elk frame hij naar beneden is
      if (this.fingers[i].isDown && !this.fingers[i].wasDown && this.playMode && this.instrument) {
        this.instrument.triggerAttack(this.fingers[i].note);
      } else if (this.fingers[i].wasDown && !this.fingers[i].isDown && this.instrument) {
        // note releasen (afzetten) als vinger recht is en vorig frame niet
        this.instrument.triggerRelease(this.fingers[i].note);
      }
    }
  };

  Hand.prototype.update = function() {
  // update collisionBoxPos;
  this.boxCollider.setFromObject(this.mesh);
  this.handMenu.update();
  // TODO: per effect moet er een ander value getracked worden anders ERROR
  this.effect && this.effect.wet ? this.effect.wet.value = this.reMap(this.position.y, -50, 50, 1, 0) : null;
  if (!this.playMode) { // noten stoppen in menu mode
    this.releaseNotes();
  }
  switch (frame.hands.length) {
    case 0: // geen vingers meer gedetecteerd: release all notes (geluid stopt, anders spelen ze door)
    this.active = false;
      if (this.hand) { // check for undefined (first frame)
        this.releaseNotes(); // released noten als hand plots van scherm is
      }
      break;
      case 1:
      if (frame.hands[0].type === this.type) { // 1 hand en vingers zijn gedetecteerd en actief
        this.hand = frame.hands[0];
        this.active = true;

        this.updateFinger();

        this.calculatePos();
        this.calculatePlayMode();
      } else {
        this.active = false;
        if (this.hand) {
            this.releaseNotes(); // released noten als hand plots van scherm is
          }
        }
        break;
        case 2:
        for (var i = 0; i < frame.hands.length; i++) {
        if (frame.hands[i].type === this.type) { // 2 handen en vingers zijn gedetecteerd en actief
          this.hand = frame.hands[i];
          this.active = true;

          this.updateFinger();

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


Hand.prototype.calculatePos = function() { //TODO: gebruikmaken van interaction box
  this.position.x = (this.hand.palmPosition[0] + 200)*(250)/(200+200)-250/2;
  this.position.y = (this.hand.palmPosition[1] - 100)*(100)/(450-200)-50;
  this.mesh.position.x = this.position.x;
  this.mesh.position.y = this.position.y;
};

Hand.prototype.releaseNotes = function() {
  if (this.instrument) {
    for (var i = 0; i < this.hand.fingers.length; i++) {
      this.instrument.triggerRelease(this.fingers[i].note);
    }
  }
};

Hand.prototype.calculatePlayMode = function() {
	if (this.hand.grabStrength >= 1 ) {
		this.mesh.material.color.setHex(0xff0000);
		this.playMode = false; // MENU

	} else {
		this.mesh.material.color.setHex(0x00ff00);
		this.playMode = true; // ACTIVE
	}
};

Hand.prototype.reMap = function(value, low1, high1, low2, high2) {
  return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
};
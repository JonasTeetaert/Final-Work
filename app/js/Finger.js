/**
 * Created by driesc on 31/05/2017.
 */
var Finger = function(note, position, direction) {
  // visual aspect

  this.geometry = new THREE.BoxGeometry( 10, 10, 10);
  this.material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
  this.threeObject = new THREE.Mesh( this.geometry, this.material );

  this.note = note;
  this.position = new THREE.Vector3(0, 0, 0);
  this.direction = direction || 0;
  this.isDown = false;
  this.wasDown = false; // is used to detect the single frame a trigger/release is detected
                        // if this isn't done notes get triggered every frame a finger is down
  this.active = false;  // gebruiken voor te stoppen met tekenen?

  this.threeObject.position.x = this.position.x;
  this.threeObject.position.y = this.position.y;
  threeController.scene.add(this.threeObject);
};

Finger.prototype.update = function(finger) {
  this.direction = finger.direction[1];
  this.position.x = finger.tipPosition[0];
  this.position.y = finger.tipPosition[1];
  this.threeObject.position.x = this.position.x;
  this.threeObject.position.y = this.position.y;

  if (((Math.round(this.direction * 100) / 100) <= -0.4)) {
    if (this.isDown === false) {
      this.wasDown = false;
    } else {
      this.wasDown = true;
    }
    this.isDown = true;
  } else {
    if (this.isDown === true) {
      this.wasDown = true;
    } else {
      this.wasDown = false;
    }
    this.isDown = false;
  }
};

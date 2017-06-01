/**
 * Created by driesc on 31/05/2017.
 */
var Finger = function(note, position, direction) {
  // visual aspect

  this.note = note;
  this.position = position || {x: 0, y: 0}; // {x : , y : }
  this.direction = direction || 0;
  this.isDown = false;
  this.wasDown = false;

};

Finger.prototype.update = function(finger) {
  this.direction = finger.direction[1];
  this.position.x = finger.tipPosition[0];
  this.position.y = finger.tipPosition[1];

  if (((Math.round(this.direction * 100) / 100) <= -0.4)) {
    this.isDown = true;
  } else {
    this.isDown = false;
  }
};

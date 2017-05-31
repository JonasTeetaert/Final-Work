/**
 * Created by driesc on 31/05/2017.
 */
var Finger = function(note, position, direction) {
  // visual aspect

  this.note = note;
  this.position = position || {x: 0, y: 0}; // {x : , y : }
  this.direction = direction || 0;

};

Finger.prototype.update = function(fingers) {
};

Finger.prototype.isDown = function() {
  if (((Math.round(this.direction * 100) / 100) <= -0.4)) {
    return true;
  }
};
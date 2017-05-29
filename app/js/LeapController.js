// Leap Controller
var LeapController = function() {
	this.controller = new Leap.Controller({
		host: '127.0.0.1',
		port: 6437,
		enableGestures: true,
		frameEventName: 'animationFrame',
		useAllPlugins: true
	});
	this.leftHand = null;
	this.rightHand = null;

	this.controller.connect();
	this.init();
}

LeapController.prototype.init = function() {
	this.controller.connect();
	this.frame = this.controller.frame();

}

LeapController.prototype.update = function() {
	"use strict"
	this.frame = this.controller.frame();
	if (this.frame.hands.length > 0) {
		for (var i = 0; i < this.frame.hands.length; i++) {
			if (this.frame.hands[i].type == 'left') {
				this.leftHand.updatePos(this.frame, i);
			}

			if (this.frame.hands[i].type == 'right') {
				this.rightHand.updatePos(this.frame, i);
			}
		}
	}
}


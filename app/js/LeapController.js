// Leap Controller
var LeapController = function() {
	this.controller = new Leap.Controller({
		host: '127.0.0.1',
		port: 6437,
		enableGestures: true,
		frameEventName: 'animationFrame',
		useAllPlugins: true
	});

	this.controller.connect();
}

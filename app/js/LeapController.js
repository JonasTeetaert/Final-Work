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
  this.controller.on("gesture", function (gesture) {
    switch (gesture.type) {
      case "circle":
        //console.log("Circle Gesture");
        break;
      case "keyTap":
        //console.log("Key Tap Gesture");
        break;
      case "screenTap":
        //console.log("Screen Tap Gesture");
        break;
      case "swipe":
        //console.log("Swipe Gesture");
        var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
        var swipeDirection;
        if (isHorizontal) {
          if (gesture.direction[0] > 0) {
            swipeDirection = "right";
            if (gesture.state === 'stop' && gesture && leftHand) {
              if (gesture.handIds[0] === leftHand.hand.id) {
              	leftHand.previous();
							} else if (gesture.handIds[0] === rightHand.hand.id) {
              	rightHand.previous();
							}
            }
          } else {
            swipeDirection = "left";
            if (gesture.state === 'stop' && gesture && leftHand) {
              if (gesture.handIds[0] === leftHand.hand.id) {
								leftHand.next();
            	}else if (gesture.handIds[0] === rightHand.hand.id) {
                rightHand.next();
              }
            }
          }
        }
        console.log(swipeDirection);
        break;
    }
  });
}

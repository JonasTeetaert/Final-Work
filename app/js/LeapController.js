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

	//swipen werkt best methand horizontaal en vingers gestrekt (anders zijn de vingers niet genoeg getecteerd)
  this.controller.on("gesture", function (gesture) { //luister voor gestures

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
            if (gesture.state === 'stop' && gesture.handIds) {
              if (typeof leftHand.hand !== "undefined" &&  gesture.pointableIds[0] === leftHand.hand.fingers[1].id) { // als gesture id = handId : voer functie uit van dat hand
              	leftHand.previous();
							} else if (typeof rightHand.hand !== "undefined" && gesture.pointableIds[0] === rightHand.hand.fingers[1].id) {
              	rightHand.previous();
							}
            }
          } else {
            swipeDirection = "left";
            if (gesture.state === 'stop' && gesture.handIds) {
              if (typeof leftHand.hand !== "undefined" && gesture.pointableIds[0] === leftHand.hand.fingers[1].id) {
								leftHand.next();
            	}else if (typeof rightHand.hand !== "undefined" && gesture.pointableIds[0] === rightHand.hand.fingers[1].id) {
                rightHand.next();
              }
            }
          }
        }
        break;
    }
  });
}

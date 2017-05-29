var threeController, leapController, leftHand, rightHand, menu;

document.addEventListener('DOMContentLoaded', function(){
	console.log('main.js is loaded');

	leapController = new LeapController();
	threeController = new ThreeController(leapController);

	//creating hands;
	leftHand = new Hand(threeController.scene, 'left');
	rightHand = new Hand(threeController.scene, 'right');

	leapController.leftHand = leftHand;
	leapController.rightHand = rightHand;

	menu = new Menu(threeController, leapController);

	threeController.render();

});




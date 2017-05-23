var mainController, threeController, leapController;

document.addEventListener('DOMContentLoaded', function(){
	console.log('main.js is loaded');

	leapController = new LeapController();
	threeController = new ThreeController(leapController);
});



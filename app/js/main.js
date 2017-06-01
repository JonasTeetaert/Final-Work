// Dit is een test

var fps, threeController, leapController, leftHand, rightHand, menu, noteMap, frame; // frame globaal zette: kunnen  alle objecten er aan? bij elke update de globale frame object updaten

document.addEventListener('DOMContentLoaded', function(){
	console.log('main.js is loaded');
  fps = new FPS(60);

  noteMap = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'];

	leapController = new LeapController();
	threeController = new ThreeController();

	//creating hands;
	leftHand = new Hand('left');
	rightHand = new Hand('right');

  menu = new Menu();

  window.requestAnimFrame(render);
});

// merge 2 teste 4



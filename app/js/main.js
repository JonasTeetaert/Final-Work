var fps, threeController, leapController, leftHand, rightHand, menu, noteMap, frame, instruments, effects, activeEffects; // frame globaal zette: kunnen  alle objecten er aan? bij elke update de globale frame object updaten

document.addEventListener('DOMContentLoaded', function() {
	console.log('main.js is loaded');
  fps = new FPS(60);

  noteMap = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'];
  instruments = [
  	new Tone.PolySynth(3, Tone.Synth),
    new Tone.PolySynth(3, Tone.AMSynth),
    new Tone.PolySynth(3, Tone.FMSynth),
    new Tone.PolySynth(3, Tone.DuoSynth),
	];

  effects = [
  	new Tone.Filter(600),
		new Tone.Distortion(0.1),
		new Tone.JCReverb(0),
		new Tone.PingPongDelay("16n", 0.2)
	];

  ChainEffects(effects);

	leapController = new LeapController();
	threeController = new ThreeController();

	//creating hands;
	leftHand = new Hand('left');
	rightHand = new Hand('right');

  menu = new Menu();

  window.requestAnimFrame(render);
});
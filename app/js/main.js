var fps, threeController, leapController, leftHand, rightHand, menu, noteMap, frame, instruments, effects, activeEffects; // frame globaal zette: kunnen  alle objecten er aan? bij elke update de globale frame object updaten

document.addEventListener('DOMContentLoaded', function() {
	console.log('main.js is loaded');
  fps = new FPS(60);

  noteMap = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'];
  instruments = [
  	new Tone.PolySynth(3, Tone.Synth).toMaster(),
    new Tone.PolySynth(3, Tone.AMSynth).toMaster(),
    new Tone.PolySynth(3, Tone.FMSynth).toMaster(),
    new Tone.PolySynth(3, Tone.DuoSynth).toMaster(),
	];

  effects = [
  	new Tone.Filter(600),
		new Tone.Distortion(0.1),
		new Tone.JCReverb(0),
		new Tone.PingPongDelay("16n", 0.2)
	];

	leapController = new LeapController();
	threeController = new ThreeController();

	//creating hands;
	leftHand = new Hand('left');
	rightHand = new Hand('right');

	leftHand.setEffect(effects[0]);
  leftHand.setInstrument(instruments[0]);

  rightHand.setEffect(effects[0]);
  rightHand.setInstrument(instruments[0]);

  menu = new Menu();

  window.requestAnimFrame(render);
});
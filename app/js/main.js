var fps, threeController, leapController, leftHand, rightHand, menu, noteMap, frame, instruments, effects, scene, BT1, limiter; // frame globaal zette: kunnen  alle objecten er aan? bij elke update de globale frame object updaten

document.addEventListener('DOMContentLoaded', function() {
	console.log('main.js is loaded');
	fps = new FPS(60);
	noteMap = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'];

	limiter = new Tone.Limiter(-6).receive("limiter");

	instruments = [
    new Instrument(new Tone.PolySynth(1, Tone.PluckSynth), 'PluckSynth'),
		new Instrument(new Tone.PolySynth(1, Tone.Synth), 'Synth'),
		new Instrument(new Tone.PolySynth(1, Tone.AMSynth), 'AMSynth'),
		new Instrument(new Tone.PolySynth(1, Tone.FMSynth), 'FMSynth'),
		new Instrument(new Tone.PolySynth(1, Tone.DuoSynth), 'DuoSynth'),
	];

	effects = [
		new Effect(new Tone.Chorus(), 'Chorus'),
		new Effect(new Tone.AutoFilter("4n", 0), 'AutoFilter'),
		new Effect(new Tone.Vibrato(), 'Vibrato'),
		new Effect(new Tone.PingPongDelay("16n",0.7), 'PingPongDelay'),
	];

	console.log(effects[1]);

	leapController = new LeapController();
	threeController = new ThreeController();

	// menu moet voor handen geïnitialiseerd worden
	menu = new Menu('.menu');

	//creating hands;
	leftHand = new Hand('left');
	rightHand = new Hand('right');

	leftHand.setEffect(0);

	rightHand.setInstrument(0);

  //TODO: meer en betere backingtracks voorzien
  BT1 = new BT(115);

  BT1.play();

  Tone.Transport.start();

  window.requestAnimFrame(render);
});
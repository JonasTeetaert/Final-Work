var fps, threeController, leapController, leftHand, rightHand, menu, noteMap, frame, instruments, effects, scene; // frame globaal zette: kunnen  alle objecten er aan? bij elke update de globale frame object updaten

document.addEventListener('DOMContentLoaded', function() {
	console.log('main.js is loaded');
	fps = new FPS(60);

	noteMap = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'];
	instruments = [
	new Tone.PolySynth(1, Tone.Synth),
	new Tone.PolySynth(1, Tone.AMSynth),
	new Tone.PolySynth(1, Tone.FMSynth),
	new Tone.PolySynth(1, Tone.DuoSynth)
	];

	effects = [
	new Tone.Filter(300),
	new Tone.Distortion(0.1),
	new Tone.JCReverb(0.5),
	new Tone.PingPongDelay("16n", 0.5)
	];

	leapController = new LeapController();
	threeController = new ThreeController();

	//creating hands;
	leftHand = new Hand('left');
	rightHand = new Hand('right');

	leftHand.setInstrument(1);

	rightHand.setInstrument(1);

	Tone.Transport.start();

  //TODO: meer en betere backingtracks voorzien
  BT1 = new BT(
  	new Tone.PolySynth(3, Tone.AMSynth),
  	[["0m", "C3"], ["0m", "E3"], ["0m", "G3"],
  	["1m", "C3"], ["1m", "F3"], ["1m", "A3"],
  	["2m", "D3"], ["2m", "G3"], ["2m", "B3"],
  	["3m", "C3"], ["3m", "E3"], ["3m", "G3"]],
  	"1m",
  	"4m"
	); // (synthNumber, array of notes, notelength, looplength)

  //BT1.play();

  menu = new Menu();

  window.requestAnimFrame(render);
});
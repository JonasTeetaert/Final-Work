/**
 * Created by driesc on 31/05/2017.
 */
var BT = function(bpm) {
  Tone.Transport.bpm.value = bpm;
  this.paused = true;

  var pluckSynth = new Tone.PolySynth(3, Tone.PluckSynth).connect(limiter);
  var synth = new Tone.PolySynth(3, Tone.AMSynth).connect(limiter);

  this.part = new Tone.Part(function (time, note) {
    synth.triggerAttackRelease(note, "1m", time);
  }, [["0m", "C3"], ["0m", "E3"], ["0m", "G3"],
    ["1m", "C3"], ["1m", "F3"], ["1m", "A3"],
    ["2m", "D3"], ["2m", "G3"], ["2m", "B3"],
    ["3m", "C3"], ["3m", "E3"], ["3m", "G3"]]);

  this.part.loop = true;
  this.part.loopEnd = "4m";

  var compressor = new Tone.Compressor({
    "ratio" : 5,
    "threshold" : -27,
    "attack" : 0.3,
    "release" : 0.2
  }).connect(limiter);

  var distortion = new Tone.Distortion({
    "distortion" : 0.3,
    "wet" : 0.5
  });

  var kick = new Tone.Sampler({
    "url" : "./assets/samples/kick.wav",
    "volume" : -10
  }).chain(distortion, compressor);

  var snare = new Tone.Sampler({
    "url" : "./assets/samples/snare.wav",
    "volume" : -10,
    "envelope" : {
      "attack" : 0.01
    }
  }).chain(distortion, compressor);

  var hiHat = new Tone.Sampler({
    "url" : "./assets/samples/hi-hat.wav",
    "volume" : -25,
  }).chain(distortion, compressor);

  this.kickSeq = new Tone.Sequence(function(time, probability){
    if (Math.random() < probability){
      kick.triggerAttackRelease(0, "2n", time);
    }
  }, [[1, [null, 0.3]], 1, 1, 1, 1, 1, 1, 1], "2n");

  this.snareSeq = new Tone.Sequence(function(time){
    snare.triggerAttackRelease(0, "2n", time);
  }, [null, 1, null, 1]);

  this.hatsLoop = new Tone.Loop({
    "callback" : function(time){
      hiHat.triggerAttackRelease(0, "8n", time);
    },
    "interval" : "8n",
    "probability" : 0.9
  });
};

BT.prototype.play = function() {
  this.paused = false;
  this.kickSeq.start();
  this.snareSeq.start();
  this.hatsLoop.start("1m");
  this.part.start();
};

BT.prototype.pause = function() {
  this.paused = true;
  this.kickSeq.stop();
  this.snareSeq.stop();
  this.hatsLoop.stop();
  this.part.stop();
};

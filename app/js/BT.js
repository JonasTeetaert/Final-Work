/**
 * Created by driesc on 31/05/2017.
 */
var BT = function(synth, notes, noteLength, loopLength) {
  this.paused = true;
  this.synth = synth.toMaster();
  var synth = this.synth;
  this.part = new Tone.Part(function (time, note) {
    //the notes given as the second element in the array
    //will be passed in as the second argument
    synth.triggerAttackRelease(note, noteLength, time);
  }, notes).start(0);

  this.part.loop = true;
  this.part.loopEnd = loopLength;

  // sampler voor eenvoudige kick, wordt later nog uitgebreide percussie
  /*sampler = new Tone.Sampler("http://localhost:8888/final%20work/leapMusic/build/samples/kick.wav", function () {
    Tone.Transport.scheduleRepeat(function (time) {
      sampler.triggerAttackRelease(0, time, time);
    }, "4n");

    // Tone.Transport.start();
  }).toMaster();*/
};

BT.prototype.play = function() {
  this.paused = false;
  this.part.start();
};

BT.prototype.pause = function() {
  this.paused = true;
  this.part.stop();
};

var ChainEffects = function(activeEffects) {
	console.log(_.compact(activeEffects));
	Tone.Master.chain.apply(_.compact(activeEffects));
};
var Effect = function(fx, name) {
	this.fx = fx;
	this.name = name;
}


var setEffect = function(fx) {
	fx.toMaster();
};
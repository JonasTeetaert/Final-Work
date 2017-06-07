var Particle = function(parent) {
	this.parent = parent;
	this.geometry = undefined
	this.material = undefined;
	this.threeObject = undefined;
	this.parent.array[this.parent.index] = this;
	this.id = this.parent.index;
	this.parent.index++;

	setTimeout(function() {
		this.destroy();
	}.bind(this), 10000);
}

Particle.prototype.setStartPos = function(startPos) {
	this.threeObject.position.z = startPos;
}

Particle.prototype.move = function(speed) {
	this.speed = speed;
	this.threeObject.position.z += this.speed;

	if (this.threeObject.position.z >= 200) {
		//this.destroy();
	}
}

Particle.prototype.destroy = function() {
	this.geometry.dispose();
	this.material.dispose();
	scene.remove(this.threeObject);
	delete this.parent.array[this.id];
}

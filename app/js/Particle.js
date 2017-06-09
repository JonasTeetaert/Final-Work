var Particle = function(parent) {
	this.parent = parent;
	this.x = undefined;
	this.y = undefined;
	this.geometry = undefined
	this.material = undefined;
	this.threeObject = undefined;
	this.parent.array[this.parent.index] = this;
	this.id = this.parent.index;
	this.parent.index++;
}

Particle.prototype.setStartPos = function(startPos) {
	this.threeObject.position.z = startPos;
}

Particle.prototype.move = function(speed) {
	this.speed = speed;
	this.threeObject.position.z += this.speed;

	if (this.threeObject.position.z >= 400) {
		this.destroy();
	}
}

Particle.prototype.destroy = function() {
	this.geometry.dispose();
	this.material.dispose();
	scene.remove(this.threeObject);
	delete this.parent.array[this.id];
}

Particle.prototype.setColor = function(fingerIndex) {
	switch (fingerIndex) {
		case 0: return new THREE.Color( 0xff0000 ); break;
		case 1: return new THREE.Color( 0x00ff00 ); break;
		case 2: return new THREE.Color( 0x0000ff ); break;
		case 3: return new THREE.Color( 0xffff00 ); break;
		case 4: return new THREE.Color( 0xff00ff ); break;
		default: return new THREE.Color( 0xffffff ); break;
	}
}

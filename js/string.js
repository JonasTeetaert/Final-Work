/* jshint browser: true */

function String(x, color, canvasHeight, scene) {
	'use strict';
	this.scene = scene;
	this.color = color;
	this.threeObj = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({
		color: this.color
	}));
	this.x = x;
	this.canvasHeight = canvasHeight;
	this.unit = 100;
	this.wave_height = 10 / this.unit;
	this.speed_incrementor = 5;
	this.wave_amount = 6;
	this.z = 0;
	this.y = 0;
	this.new_positions = [];
	this.active = false;
	this.scene.add(this.threeObj);
	console.log("String is aangemaakt");
}
String.prototype.constructor = String;

String.prototype.draw = function () {
	'use strict';
	this.new_positions = [];
	for (var i = -this.canvasHeight / 2 * this.unit; i <= this.canvasHeight / 2 * this.unit; i++) {
		var y = i / this.unit;
		this.new_positions.push(new THREE.Vector3(this.x, y, this.y));
	}
	this.threeObj.geometry.vertices = this.new_positions;
	this.threeObj.geometry.verticesNeedUpdate = true;
}

String.prototype.update = function (counter) {
	'use strict';
	this.new_positions = [];
	var speed = counter / this.speed_incrementor;
	for (var i = -this.canvasHeight / 2 * this.unit; i <= this.canvasHeight / 2 * this.unit; i++) {
		var x = this.x + Math.cos((y + speed) * this.wave_amount) * this.wave_height;
		var y = i / this.unit;
		this.new_positions.push(new THREE.Vector3(x, y, this.z));

	}
	this.threeObj.geometry.vertices = this.new_positions;
	this.threeObj.geometry.verticesNeedUpdate = true;
}
/* jshint browser: true */
function FPS(fps) {
    this.fps = fps;
    this.now = null;
    this.then = null;
    this.interval = 1000 / this.fps;
    this.delta = null;
    this.ticks = 0;

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function ( /* function */ callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}

FPS.prototype.reset = function () {
    this.ticks = 0;
    return true;
};

FPS.prototype.update = function () {
    this.now = Date.now();
    this.delta = this.now - this.then;

    if (this.delta > this.interval) {
        // Just `then = now` is not enough.
        // Lets say we set fps at 10 which means
        // each frame must take 100ms
        // Now frame executes in 16ms (60fps) so
        // the loop iterates 7 times (16*7 = 112ms) until
        // delta > interval === true
        // Eventually this lowers down the FPS as
        // 112*10 = 1120ms (NOT 1000ms).
        // So we have to get rid of that extra 12ms
        // by subtracting delta (112) % interval (100).
        // Hope that makes sense.
        this.then = this.now - (this.delta % this.interval);

        this.ticks++;
        return true;
    }
    return false;
};

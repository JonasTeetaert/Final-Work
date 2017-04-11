'use strict';
var frame, previousFrame, effect, synth, synth2, synths, currentSynth, fingerTypeMap, noteMap, part, fps, paused, pauseonGesture, controller, leftHand, rightHand, prevLH, prevRH, sampler, RHOnly, BKTToggle, LHHeight, RHHeight, camera, renderer, scene, obj, speed, canvasheight, canvasWidth, currInstr, counter, string_amount, strings, xPositions;
window.addEventListener("load", init);

function init() {
    fps = new FPS(60);

    counter = 0;
    string_amount = 10;
    xPositions = [];

    currInstr = document.getElementById('currentInstrument');

    RHOnly = true; // enkel rechterhand, linkerhand wordt dan gebruikt voor effecten/ instrument keuze
    BKTToggle = true; // backingtrack aan/uit

    controller = new Leap.Controller({
        host: '127.0.0.1',
        port: 6437,
        enableGestures: true,
        frameEventName: 'animationFrame',
        useAllPlugins: true
    });

    //effect = new Tone.Distortion(0.1).toMaster();
    //effect = new Tone.JCReverb(0).connect(Tone.Master);
    //effect = new Tone.PingPongDelay("16n", 0.2).toMaster();
    effect = new Tone.Filter(600).toMaster();

    synths = ['Tone.Synth', 'Tone.AMSynth', 'Tone.FMSynth', 'Tone.DuoSynth']; //toewijzen bespeelbare instrumenten

    currentSynth = 0;
    setSynth(synths[currentSynth], 1); // setSynth(synthsound, polyphony)
    synth2 = new Tone.PolySynth(3, Tone.Synth).toMaster(); // synth voor backingtrack
    fingerTypeMap = ['Duim', 'Wijsvinger', 'Middelvinger', 'Ringvinger', 'Pink']; // hulpmiddel voor testfase
    noteMap = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6', 'E6'];
    prevRH = [false, false, false, false, false]; // true wanneer vinger naar beneden wijst (noot afspelen), wordt gevalueerd in keyStroke()
    prevLH = [false, false, false, false, false];
    
    // part voor backingtrack akkoorden
    part = new Tone.Part(function (time, note) {
        //the notes given as the second element in the array
        //will be passed in as the second argument
        synth2.triggerAttackRelease(note, "1m", time);
    }, [[0, "C3"], [0, "E3"], [0, "G3"],
    ["1m", "C3"], ["1m", "F3"], ["1m", "A3"],
    ["2m", "D3"], ["2m", "G3"], ["2m", "B3"],
   ["3m", "C3"], ["3m", "E3"], ["3m", "G3"]]).start(0);

    part.loop = true;
    part.loopEnd = '4m';

    // sampler voor eenvoudige kick, wordt later nog uitgebreide percussie
    sampler = new Tone.Sampler("http://localhost:8888/final%20work/prototype/samples/kick.wav", function () {
        Tone.Transport.scheduleRepeat(function (time) {
            sampler.triggerAttackRelease(0, time, time);
        }, "4n");

        // Tone.Transport.start();
    }).toMaster();

    

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 10;

    // canvas width en height berekenen
    var vFOV = camera.fov * Math.PI / 180;
    canvasheight = 2 * Math.tan(vFOV / 2) * camera.position.z + 1;
    var aspect = window.innerWidth / window.innerHeight;
    canvasWidth = canvasheight * aspect;

    // Strings aanmaken
    strings = {};

    for (var i = 1; i <= string_amount; i++) {
        var x = (canvasWidth / (string_amount + 1)) * i - canvasWidth / 2;
        xPositions.push(x);

        var string = new String(x, "#fff", canvasheight, scene);
        strings[i - 1] = string;
    }

    for (var i = 0; i < string_amount; i++) {
        strings[i].draw();
        console.log("string is getekent");
    }

    controller.connect();

    paused = false;

    //gesture listener callback
    controller.on("gesture", function (gesture) {
        if (RHOnly) {
            switch (gesture.type) {
            case "circle":
                //console.log("Circle Gesture");
                break;
            case "keyTap":
                //console.log("Key Tap Gesture");
                break;
            case "screenTap":
                //console.log("Screen Tap Gesture");
                break;
            case "swipe":
                //console.log("Swipe Gesture");
                var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
                var swipeDirection;
                if (isHorizontal) {
                    if (gesture.direction[0] > 0) {
                        swipeDirection = "right";
                        if (gesture.state == 'stop') {
                            if (currentSynth == 0) {
                                currentSynth = synths.length - 1;
                            } else {
                                currentSynth--;
                            }
                            synth.releaseAll();
                            setSynth(synths[currentSynth], 1);
                        }
                    } else {
                        swipeDirection = "left";
                        if (gesture.state == 'stop') {
                            if (currentSynth == synths.length - 1) {
                                currentSynth = 0;
                            } else {
                                currentSynth++;
                            }
                            synth.releaseAll();
                            setSynth(synths[currentSynth], 1);
                        }
                    }
                }
                console.log(swipeDirection);
                break;
            }
        }
    });
    window.requestAnimFrame(render);
};

function render() {
    if (fps.update() && !paused) {
        frame = controller.frame();
        leftHand = [false, false, false, false, false]; // reset keystroke om valse positieven tegen te gaan
        rightHand = [false, false, false, false, false];

        if (frame.pointables.length > 0) {
            for (var j = 0; j < frame.hands.length; j++) {
                
                for (var i = 0; i < frame.hands[j].pointables.length; i++) {
                    
                    //update palmpositie van handen (enkel bij 1 handed mode)
                    if (frame.hands[j].type == 'right' && RHOnly) {
                        RHHeight = frame.hands[j].palmPosition[1];
                    } else if (frame.hands[j].type == 'left' && RHOnly) {
                        LHHeight = frame.hands[j].palmPosition[1];
                    }
                    
                    // als pointable naar beneden wijst, zet vinger in array op true
                    if (((Math.round(frame.hands[j].pointables[i].direction[1] * 100) / 100) <= -0.4)) {
                        if (frame.hands[j].type == 'right') {
                            rightHand[frame.hands[j].pointables[i].type] = true;
                        } else if (frame.hands[j].type == 'left') {
                            leftHand[frame.hands[j].pointables[i].type] = true;
                        }
                    }
                }
            }
        }

        // hoogte van linkerhand heeft invloed op effect
        if (!isNaN(LHHeight)) {
            effect.frequency.value = reMap(LHHeight, 100, 450, 0, 10000); // remap hoogte naar bereik van effect (in dit geval frequency)
        }

        keyStroke(); //speel noten wanneer vinger naar beneden is ( = index in array op true)

        //teken snaren
        counter++;
        if (!RHOnly) {
            for (var i = 0; i < string_amount; i++) {
                if (strings[i].active) {
                    strings[i].update(counter);
                } else {
                    strings[i].draw();
                }
            }
        } else {
            for (var i = 5; i < string_amount; i++) {
                if (strings[i].active) {
                    strings[i].update(counter);
                } else {
                    strings[i].draw();
                }
            }
        }
        prevLH = leftHand; // wordt gebruikt voor na te gaan wanneer een toets wordt aangeslagen/ losgelaten
        prevRH = rightHand;
    }
    window.requestAnimFrame(render);
    renderer.render(scene, camera);
}

function keyStroke() {
    for (var i = 0; i < leftHand.length; i++) {
        if (leftHand[i] && !prevLH[i] && !RHOnly) {
            synth.triggerAttack(noteMap[4 - i]);
            strings[4 - i].active = true;
        } else if (!leftHand[i] && prevLH[i]) {
            synth.triggerRelease(noteMap[4 - i]);
            strings[4 - i].active = false;
        }
    }
    for (var i = 0; i < rightHand.length; i++) {
        if (rightHand[i] && !prevRH[i]) {
            synth.triggerAttack(noteMap[5 + i]);
            strings[5 + i].active = true;
        } else if (!rightHand[i] && prevRH[i]) {
            synth.triggerRelease(noteMap[5 + i]);
            strings[5 + i].active = false;
        }
    }
}

function reMap(value, low1, high1, low2, high2) {
    return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

function initCanvas() {
    if (!CanvasHelper.canvasSupport()) {
        Debugger.log("Canvas is niet gevonden");
        return false;
    }
    canvas = new CanvasHelper("c");
    ctx = canvas.context;
    canvas.scaleOnHiDPI();
}

function togglePause() {
    paused = !paused;

    if (paused) {
        document.getElementById("pause").innerText = "Resume";
        Tone.Transport.stop();
        synth.releaseAll();
    } else {
        document.getElementById("pause").innerText = "Pause";
    }
}

function toggleHand() {
    RHOnly = !RHOnly;

    if (RHOnly) {
        document.getElementById("hand").innerText = "Both hands";
    } else {
        document.getElementById("hand").innerText = "Right hand only";
    }
}

function toggleBKT() {
    BKTToggle = !BKTToggle;

    if (BKTToggle) {
        document.getElementById("BKT").innerText = "Toggle backing track ON";
        Tone.Transport.stop();
    } else {
        document.getElementById("BKT").innerText = "Toggle backing track OFF";
        Tone.Transport.start();
    }
}

function setSynth(newSynth, poly) {
    currInstr.innerHTML = synths[currentSynth];
    if (typeof synth != 'undefined') {
        synth.dispose();
    }
    synth = new Tone.PolySynth(poly, eval(newSynth)).connect(effect);
}
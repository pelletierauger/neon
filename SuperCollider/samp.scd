g = Buffer.read(s, "/Users/guillaumepelletier/Desktop/grass-wind.wav");
g = Buffer.read(s, "/Users/guillaumepelletier/Desktop/grass-wind3.wav");

g.play;
(
~play.free;
~play = {
    var sig = PlayBuf.ar(2, g, BufRateScale.ir(g) * 0.5) * 4;
    sig = sig + ([SinOsc.ar(0.4), 0
    ]*0.75);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.ir(b), 0, BufFrames.ir(b)));
    0.0;
}.play;
)

(
~play.free;
~play = {
    var sig = SinOsc.ar(220) * 0.1!2;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
~play.free;
~play = {
    var t = Impulse.kr(0.5);
    var mel = Demand.kr(t, 0, Dseq([10, 8, 7, 3, 2].stutter(2), inf));
    var env = EnvGen.kr(Env([0,1,0], [0.01, 2 - 0.01]), gate: t);
    var op2 = SinOsc.ar(220 * mel.midiratio, 2pi * [0, 0.25]) * 0.3;
    var op1 = SinOsc.ar(220 * 24.midiratio, 2pi * [0, 0.25]) * 0.3;
    var op0 = SinOsc.ar(55 * 0.midiratio, 2pi * [0, 0.25]) * 0.3;
    var sig = op0 + op2 * env;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
~play.free;
~play = {
    var t = Impulse.kr(0.5);
    var mel = Demand.kr(t, 0, Dseq([10, 8, 7, 3, 2].stutter(2), inf));
    var env = EnvGen.kr(Env([0,1,0], [0.01, 2 - 0.01]), gate: t);
    var op2 = SinOsc.ar(220 * mel.midiratio, 2pi * [0, 0.25]) * 0.3;
    var op1 = SinOsc.ar(220 * 24.midiratio, 2pi * [0, 0.25]) * 0.3;
    var op0 = SinOsc.ar(55 * 0.midiratio, 2pi * [0, 0.25]) * 0.3;
    var sig = [0, 0];
    sig[0] = Phasor.ar(Impulse.kr(0), 1/(440), -1, 1, -1);
    sig[1] = SinOsc.ar(100) * 0.5;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)
(
x.free;
x = {
    var si = SinOsc;
    var sifb = SinOscFB;
    var t = Impulse.kr(1);
    var t2 = Impulse.kr(1);
    var mel = Demand.kr(t, 0, Dseq([0, -2, 3, 7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 0.1;
    var sig = (op0 * op1) * 8 * mel2.lag(0.1);
    // sig = GVerb.ar(
    sig = sig + ([si.ar(0.4), 0
    ]*0.75);
    // sig, 
    // roomsize: 10, revtime: 3, damping: 0.5, 
    // inputbw: 0.5, spread: 15, drylevel: 1, 
    // earlyreflevel: 0.7, taillevel: 0.5, 
    // maxroomsize: 300, mul: 1, add: 0) * 0.5 + (sig * 0.5);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
x.free;
x = {
    var si = SinOsc;
    var sifb = SinOscFB;
    var t = Impulse.kr(1);
    var t2 = Impulse.kr(1);
    var mel = Demand.kr(t, 0, Dseq([0, -2, 3, 0].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    // sig = GVerb.ar(
    // sig, 
    // roomsize: 10, revtime: 3, damping: 0.5, 
    // inputbw: 0.5, spread: 15, drylevel: 1, 
    // earlyreflevel: 0.7, taillevel: 0.5, 
    // maxroomsize: 300, mul: 1, add: 0) * 0.5 + (sig * 0.5);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
z.free;
z = { arg rate=1;
    var sig = BufRd.ar(2, b, Phasor.ar(0, BufRateScale.kr(b) * rate, 0, BufFrames.kr(b)));
    DelayN.ar(sig, 1, 0.005) * 0.1;
}.play(s);
)
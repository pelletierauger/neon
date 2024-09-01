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
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((0..48).linlin(0,48,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    sig = [hori * SinOsc.ar(220).range(1,0)*2, SinOsc.ar(220)*verti];
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((0..48).linlin(0,48,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    sig = [hori * SinOsc.ar(220).range(1,0)*1.5, SinOsc.ar(220)];
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((0..25).linlin(0,25,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((0..48).linlin(0,48,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    sig = [hori * SinOsc.ar(220*mel).range(1,0)*1.5*SinOsc.ar(0.1, 2pi * 0.25), SinOsc.ar(220*mel)*SinOsc.ar(0.1)];
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((0..25).linlin(0,25,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((0..48).linlin(0,48,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    sig = [hori * SinOsc.ar(220*mel).range(1,0)*1.5*SinOsc.ar(0.1, 2pi * 0.25), SinOsc.ar(220*mel)*SinOsc.ar(0.1)];
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((0..12).linlin(0,12,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((0..12).linlin(0,12,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    sig = [hori*SinOsc.ar(220*mel, 2pi * 0.25), SinOsc.ar(220*mel)*verti];
    
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((0..12).linlin(0,12,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((0..12).linlin(0,12,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    sig = [hori*SinOsc.ar(220*mel, 2pi * 0.25), SinOsc.ar(220*mel)*verti];
    verti = Phasor.ar(0, 1/(440*mel2));
    sig = [sin(verti * 2pi), cos(verti * 2pi + (verti * 2pi))];
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    sig = [hori*SinOsc.ar(220*mel, 2pi * 0.25), SinOsc.ar(220*mel)*hori];
    
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    sig = [hori*SinOsc.ar(220*mel, 2pi * 0.25), SinOsc.ar(220*mel)*hori];
    hori = sin(atan(sig[0], sig[1])*10);
    sig = sig * hori;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = sin(atan(sig[1], sig[0])*40) * 0.5;
    sig = sig *
    hori;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    hori = hori * 0.1;
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = sin(atan(sig[1], sig[0])*40) * 0.5;
    sig = sig * hori * 10;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.5) * 4);
    hori = hori * 0.1;
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = sin(atan(sig[1], sig[0])*40) * 0.5;
    sig = sig * hori * 10;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0, -5, -2, -7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.5) * 4);
    hori = hori * 0.1;
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = sin(atan(sig[1], sig[0])*10) * 0.85;
    sig = sig * hori * 10;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0, -5, -2, -7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.5) * 4);
    hori = hori * 0.1;
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = sin(atan(sig[1]*100, sig[0]*100)*100) * 0.35;
    sig = sig * hori * 10;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0, -5, -2, -7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.05) * 1);
    hori = hori * 0.1;
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = sin(atan(sig[1]*1, sig[0]*1)*10) * 0.35;
    sig = sig * hori * 10;
    hori = sin(atan(sig[1]*1, sig[0]*1)*10) * 0.35;
    sig = sig * hori * 10;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0, -5, -2, -7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.5) * 1);
    hori = hori * 0.1;
    sig = [hori, SinOsc.ar(110*mel)*hori];
    hori = pow(atan(sig[1]*100, sig[0]*100),12) * 0.05;
    sig = sig * hori * 10;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0, -5, -2, -7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(4) * 2);
    hori = hori * 0.1;
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = Phasor.ar(0, 1/(440*mel2));
    // sig = [cos(hori*2pi)/2pi, sin(hori*2pi)/2pi];
    hori = pow(atan(sig[1]*10000*tan(sig[0]), sig[0]*10000*tan(sig[0])),12) * 0.025;
    sig = sig * hori * 1;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0, -5, -2, -7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    hori = hori * 0.1;
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = Phasor.ar(0, 1/(440*mel2));
    // sig = [cos(hori*2pi)/2pi, sin(hori*2pi)/2pi];
    hori = pow(atan(sig[1]*10000*sin(sig[0]*50), sig[0]*10000*sin(sig[1]*50)),5) * 0.5;
    sig = sig * hori * 1;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0, -5, -2, -7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    hori = hori * 0.1;
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = Phasor.ar(0, 1/(440*mel2));
    // sig = [cos(hori*2pi)/2pi, sin(hori*2pi)/2pi];
    hori = pow(atan(sig[1]*10000*sin(sig[0]*50), sig[0]*10000*sin(sig[1]*50)),5) * 0.5;
    sig = sig * hori * 1;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var t = Impulse.kr(8);
    var d = Demand.kr(t, 0, Dseq((1..12).scramble, inf));
    var i = Phasor.ar(0, 1/(220))*2pi;
    var osc = sin(i*d).range(0.5, 1);
    var sig = [cos(i), sin(i)] * osc * 0.9;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
x.free;
x = {
    var t = Impulse.kr(8);
    var d = Demand.kr(t, 0, Dseq((1..12).scramble, inf)).lag(0.1);
    var i = Phasor.ar(0, 1/(220))*2pi;
    var osc = sin(i*d).range(0.5, 1);
    var sig = [cos(i), sin(i)] * osc * 0.9;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var t = Impulse.kr(8);
    var d = Demand.kr(t, 0, Dseq((1..12).scramble, inf)).lag(0.1);
    var i = Phasor.ar(0, 1/(220))*2pi;
    var osc = sin(i*d*0.5).range(-1, 1);
    var sig = [cos(i), sin(i)] * osc * 0.9;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var t = Impulse.kr(8);
    var t2 = Impulse.kr(1);
    var d2 = Demand.kr(t2, 0, Dwrand([0, 0.1], [0.4, 0.6], inf));
    var d = Demand.kr(t, 0, Dseq((1..12).scramble, inf)).lag(d2);
    var i = Phasor.ar(0, 1/(880*0.2))*2pi;
    var osc = sin(i*d+(2pi*[0,0.25])).range(-1, 1);
    var sig = [cos(i), sin(i)] * 0.9;
    sig = sig + osc * 0.5;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var t = Impulse.kr(8);
    var t2 = Impulse.kr(1);
    var d2 = Demand.kr(t2, 0, Dwrand([0, 0.1], [0.4, 0.6], inf));
    var d = Demand.kr(t, 0, Dseq((1..12).scramble, inf)).lag(d2);
    var i = Phasor.ar(0, 1/(880*0.2))*2pi;
    var osc = sin(i*d+(2pi*[0,0.25])).range(-1, 1);
    var sig = [cos(i*4), sin(i*4)] * 0.9;
    sig = sig + osc * 0.5;
    sig = LPF.ar(sig, 1000) * 1.5;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var t = Impulse.kr(2);
    var t2 = Impulse.kr(1);
    var d2 = Demand.kr(t2, 0, Dwrand([0.1, 1], [0.4, 0.6], inf));
    var d = Demand.kr(t, 0, Dseq((1..12).scramble, inf)).lag(d2);
    var i = Phasor.ar(0, 1/(880*0.2))*2pi;
    var osc = sin(i*d+(2pi*[0,0.25])).range(-1, 1);
    var sig = [cos(i*1), sin(i*1)] * 0.9;
    sig = sig + osc * 0.5;
    sig = LPF.ar(sig, 1000) * 1.5;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var t = Impulse.kr(2);
    var t2 = Impulse.kr(1);
    var d2 = Demand.kr(t2, 0, Dwrand([0.1, 1], [0.4, 0.6], inf));
    var d = Demand.kr(t, 0, Dseq((1..12).scramble, inf)).lag(d2);
    var i = Phasor.ar(0, 1/(880*0.2))*2pi;
    var osc = sin(i*d+(2pi*[0,0.25])).range(-1, 1);
    var sig = [cos(i*1), sin(i*1)] * 0.9;
    var angle = atan(sig[1], sig[0]);
    sig = sig + osc * 0.5;
    
    sig = LPF.ar(sig, 1000) * 1.5;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var sig, x, y, distance, velocity, pitchRatio, amplitude, azimuth, panValue;
    // object travels 200 meters in 6 secs (=120kph) passing 10 meters
    // from the listener
    x = 10;
    y = LFSaw.kr(1/6, 0, 100);
    distance = hypot(x, y);
    velocity = Slope.kr(distance);
    pitchRatio = (344 - velocity) / 344;  // speed of sound is 344 meters/sec
    amplitude = 10 / distance.squared;
    azimuth = atan2(y, x); // azimuth in radians
    panValue = (azimuth / 0.5pi).clip2(1);
    sig = Pan2.ar(FSinOsc.ar(1000 * pitchRatio), panValue, amplitude);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
    }.play;
)

(
x.free;
x = {
    var t = Impulse.ar(2);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var sig = [d, SinOsc.ar(220)];    
    sig = LPF.ar(sig, 1000) * 1.5;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
x.free;
x = {
    var t = Impulse.ar(8);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var sig = [d, SinOsc.ar(220)];
    sig = LPF.ar(sig, 4000) * 0.9;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
x.free;
x = {
    var t = Impulse.ar(4);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf)).lag(0.1);
    var d2 = Demand.ar(t, 0, Dseq([0, 2, 3, 5, 7, 8].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d + (SinOsc.ar(220*d2*d3, 2pi*0.25)*0.2), SinOsc.ar(220*d2)];
    sig = LPF.ar(sig, 4000) * 0.9;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
x.free;
x = {
    var t = Impulse.ar(4);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf)).lag(0.1);
    var d2 = Demand.ar(t, 0, Dseq([0, 2, 3, 5, 7, 8].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d + (SinOsc.ar(220*d2*d3, 2pi*0.25)*0.2), SinOsc.ar(220*d2)] * 0.9;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
x.free;
x = {
    var t = Impulse.ar(220);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var d2 = Demand.ar(t, 0, Dseq([0, 2, 3, 5, 7, 8].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d, SinOsc.ar(220)] * 0.9;
    sig = LPF.ar(sig, 500+SinOsc.ar(1).range(0,4000));
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var t = Impulse.ar(220);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var d2 = Demand.ar(t, 0, Dseq([0, 2, 3, 5, 7, 8].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d, SinOsc.ar(220)] * 0.9;
    // sig[0] = sig[0] + ((floor(sig[1]*5)%5)*WhiteNoise.ar(0.05));
    var x = sig[1];
    var slice = max(0, (x*5)%1-0.95)*20;
    sig[0] = sig[0] + (slice*SinOsc.ar(0.1));
    // sig = LPF.ar(sig, 5500);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var t = Impulse.ar(220);
    var t2 = Impulse.ar(2);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var d2 = Demand.ar(t2, 0, Dseq([0, 3, 5, 7, 0, 3, 7, 5].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d, SinOsc.ar(110*d2)] * 0.9;
    // sig[0] = sig[0] + ((floor(sig[1]*5)%5)*WhiteNoise.ar(0.05));
    var x = sig[1];
    var cut = 0.4;
    var slice = max(0, (x*5-SinOsc.ar(0.001).range(0,500))%1-(1-cut))*(1/cut);
    var y = sig[1];
    sig[0] = sig[0] + (slice*SinOsc.ar(0.1)*0.2);
    sig[0] = sig[0] * (1.0-(y*0.5+0.5*0.5))*1.5;
    // sig = LPF.ar(sig, 5500);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
x.free;
x = {
    var t = Impulse.ar(220);
    var t2 = Impulse.ar(2);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var d2 = Demand.ar(t2, 0, Dseq([0, 3, 5, 7, 0, 3, 7, 5].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d, SinOsc.ar(110*d2)] * 0.9;
    // sig[0] = sig[0] + ((floor(sig[1]*5)%5)*WhiteNoise.ar(0.05));
    var x = sig[1];
    var cut = 0.4;
    var slice = max(0, (x*2+SinOsc.ar(0.001).range(0,500))%1-(1-cut))*(1/cut);
    var y = sig[1];
    sig[0] = sig[0] + (slice*SinOsc.ar(0.1)*0.2);
    sig[0] = sig[0] * (1.0-(y*0.5+0.5*0.5))*1.5;
    // sig = LPF.ar(sig, 5500);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

// Les vignes
(
x.free;
x = {
    var t = Impulse.ar(220);
    var t2 = Impulse.ar(2);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var d2 = Demand.ar(t2, 0, Dseq([0, 3, 5, 7, 0, 3, 7, 5].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d, SinOsc.ar(220*d2)] * 0.9;
    // sig[0] = sig[0] + ((floor(sig[1]*5)%5)*WhiteNoise.ar(0.05));
    var x = sig[1];
    var cut = 0.4;
    var slice = max(0, (x*2+SinOsc.ar(0.0005).range(0,500))%1-(1-cut))*(1/cut);
    var dir = ((x*2+SinOsc.ar(0.0005).range(0,500))% 2) * 2 - 3;
    var y = sig[1];
    slice = pow(slice, 4);
    sig[0] = sig[0] + (slice*0.1*dir);
    // sig[0] = dir;
    sig[0] = sig[0] * (1.0-(y*0.5+0.5*0.5))*1.5;
    // sig = LPF.ar(sig, 5500);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
x.free;
x = {
    var t = Impulse.ar(220);
    var t2 = Impulse.ar(2);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var d2 = Demand.ar(t2, 0, Dseq([0, 3, 5, 7, 0, 3, 7, 5].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d, SinOsc.ar(220*d2)] * 0.9;
    // sig[0] = sig[0] + ((floor(sig[1]*5)%5)*WhiteNoise.ar(0.05));
    var x = sig[1];
    var cut = 0.4;
    var slice = max(0, (x*2+SinOsc.ar(0.0005).range(0,500))%1-(1-cut))*(1/cut);
    var dir = ((x*2+SinOsc.ar(0.0005).range(0,500))% 2) * 2 - 3;
    var y = sig[1];
    slice = pow(slice, 4);
    sig[0] = sig[0] + (slice*0.2*SinOsc.ar(0.4)*dir);
    // sig[0] = dir;
    sig[0] = sig[0] * (1.0-(y*0.5+0.5*0.5))*1.5;
    // sig = LPF.ar(sig, 5500);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

// Vignes 3d
(
x.free;
x = {
    var t = Impulse.ar(220);
    var t2 = Impulse.ar(2);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var d2 = Demand.ar(t2, 0, Dseq([0, 3, 5, 7, 0, 3, 7, 5].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d, SinOsc.ar(110*d2)] * 0.9;
    // sig[0] = sig[0] + ((floor(sig[1]*5)%5)*WhiteNoise.ar(0.05));
    var x = sig[1];
    var cut = 0.4;
    var slice = max(0, (x*2+SinOsc.ar(0.0005).range(0,500))%1-(1-cut))*(1/cut);
    var dir = ((x*2+SinOsc.ar(0.0005).range(0,500))% 2) * 2 - 3;
    var y = sig[1];
    slice = pow(slice, 4);
    sig[0] = sig[0] + (slice*0.2*SinOsc.ar(0.4)*dir);
    // sig[0] = dir;
    sig[0] = sig[0] * (1.0-(y*0.5+0.5*0.5 * SinOsc.ar(0.1)))*1.5;
    // sig[0] = SinOsc.ar(220+sig[0]*1000);
    // sig = LPF.ar(sig, 5500);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var t = Impulse.ar(220);
    var t2 = Impulse.ar(2);
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var d2 = Demand.ar(t2, 0, Dseq([0, 3, 5, 7, 0, 3, 7, 5].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d, SinOsc.ar(110*d2)] * 0.9;
    // sig[0] = sig[0] + ((floor(sig[1]*5)%5)*WhiteNoise.ar(0.05));
    var x = sig[1];
    var cut = 0.95;
    var slice = max(0, (x*2+SinOsc.ar(0.0005).range(0,500))%1-(1-cut))*(1/cut);
    var dir = ((x*2+SinOsc.ar(0.0005).range(0,500))% 2) * 2 - 3;
    var y = sig[1];
    slice = pow(slice, 4);
    sig[0] = sig[0] + (slice*0.1*SinOsc.ar(0.4)*dir);
    // sig[0] = dir;
    sig[0] = sig[0] * (1.0-(y*0.5+0.5*0.5 * SinOsc.ar(0.1)))*1.5;
    // sig[0] = SinOsc.ar(220+sig[0]*1000);
    // sig = LPF.ar(sig, 5500);
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
    var mel = Demand.kr(t, 0, Dseq([0].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,1]), gate: t2);
    var op2 = sifb.ar(110 * mel, mel3*5*env);
    var op1 = si.ar(110 * mel, 0) * 1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 1;
    var op3 = Pulse.ar(220 * 5 * 1.001, 0.5);
    var mix = MouseX.kr();
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = (op0 * mix) + (op0 * op3 * (1-mix)) + (op3*(1-mix));
    sig = [Phasor.ar(Impulse.kr(1), 1/(220*mel2), -1, 1, -1), LFTri.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    sig = [hori*SinOsc.ar(110*mel, 2pi * 0.25), SinOsc.ar(110*mel)*hori];
    hori = sin(atan(sig[1], sig[0])*40) * 0.5;
    sig = sig * hori;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
// sig, 
    // roomsize: 10, revtime: 3, damping: 0.5, 
    // inputbw: 0.5, spread: 15, drylevel: 1, 
    // earlyreflevel: 0.7, taillevel: 0.5, 
    // maxroomsize: 300, mul: 1, add: 0) * 0.5 + (sig * 0.5);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

// Fleur d'août
(
x.free;
x = {
    var si = SinOsc;
    var sifb = SinOscFB;
    var t = Impulse.kr(1);
    var t2 = Impulse.kr(1);
    var mel = Demand.kr(t, 0, Dseq([0].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..32).linlin(1,32,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = 0.0;
    // sig = [Phasor.ar(Impulse.kr(1), 1/(220), -1, 1, -1), SinOsc.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    // hori = 1;
    sig = [hori*SinOsc.ar(110, 2pi * 0.25), SinOsc.ar(110)*hori];
    hori = sin(atan2(sig[1], sig[0])*SinOsc.ar(0.1)*4) * 0.5;
    sig = sig * hori;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0, 3, 5, 7, 0, 3, 7, 5].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..12).linlin(1,12,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = 0.0;
    // sig = [Phasor.ar(Impulse.kr(1), 1/(220), -1, 1, -1), SinOsc.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    // hori = 1;
    sig = [hori*SinOsc.ar(110, 2pi * 0.25), SinOsc.ar(110)*hori];
    hori = sin(atan2(sig[1], sig[0])*SinOsc.ar(0.1)*4) * 0.5;
    sig = sig * hori;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    var mel = Demand.kr(t, 0, Dseq([0, 3, 5, 7, 0, 3, 7, 5].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var mel3 = Demand.kr(t2, 0, Dseq([0.25,1], inf));
    var tH = Impulse.ar(880);
    var hori = Demand.ar(tH, 0, Dseq((1..12).linlin(1,12,-1,1), inf));
    var verti = Demand.ar(tH, 0, Dseq(((1..32).linlin(1,32,-1,1)), inf));
    var sig = 0.0;
    // sig = [Phasor.ar(Impulse.kr(1), 1/(220), -1, 1, -1), SinOsc.ar(220)*0.9];
    hori = hori + (SinOsc.ar(0.1) * 2);
    // hori = 1;
    sig = [hori*SinOsc.ar(110, 2pi * 0.25), SinOsc.ar(110)*hori];
    hori = sin(atan2(sig[1], sig[0])*SinOsc.ar(0.1)*4) * 0.5;
    sig = sig * hori;
    // sig = GVerb.ar(
    // sig = sig * (1 - PinkNoise.ar(MouseY.kr()));
sig = sig * 0.9;
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
    // var t = SinOsc.ar(0.2);
    var t = Phasor.ar(0, 1/(220)) * 10;
    var x = cos(t);
    var y = sin(t);
    var sig = [tan(pi*t), tan(pi*t) + floor(t)] * 0.1;
    // sig = [tan(pi*t),floor(t)-tan(pi*t)];
    t = t * SinOsc.ar(0.2);
    sig = [tan(pi*t)*x, floor(t)*y] * 0.1;
    // var sig = [x, y];
    // sig = LPF.ar(sig, 4500);
BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)
(0..5)



(
x.free;
x = {
    var t = Impulse.ar(1);
    var t2 = Impulse.ar(8);
    var b = t2 * Demand.ar(t2, 0, Dseq([1, 0, 0, 1, 0, 0, 1, 0], inf));
    var b2 = t2 * Demand.ar(t2, 0, Dseq([1, 0, 1, 1], inf));
    var dd = Demand.ar(t2, 0, Drand([0.01, 0.05], inf));
    var env = EnvGen.ar(Env([0, 1, 0], [0.001, dd], -6), gate: [b, b2]);
    var snare = [WhiteNoise.ar(env[0]), PinkNoise.ar(env[1])*2];
    var d = Demand.ar(t, 0, Dseq((1..12), inf)).lag(0.8);
    var i = Phasor.ar(0, 1/(220))*2pi;
    var osc = sin(i*d).range(0.5, 1);
    var sig = [cos(i), sin(i)] * osc * 0.9;
    sig = sig + snare;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)


(
x.free;
x = {
    var t = Impulse.ar(220);
    var t2 = Impulse.ar(2);
    var t3 = Impulse.ar(8);
    var b = t3 * Demand.ar(t3, 0, Dseq([1, 0, 0, 1, 0, 0, 1, 0], inf));
    var b2 = t3 * Demand.ar(t3, 0, Dseq([1, 0, 1, 1], inf));
    var dd = Demand.ar(t2, 0, Drand([0.01, 0.05], inf));
    var env = EnvGen.ar(Env([0, 1, 0], [0.001, dd], -6), gate: [b, b2]);
    var snare = [WhiteNoise.ar(env[0]), PinkNoise.ar(env[1])*2];
    var d = Demand.ar(t, 0, Dseq((0..5).linlin(0,5,-1,1), inf));
    var d2 = Demand.ar(t2, 0, Dseq([0, 3, 5, 7, 0, 3, 7, 5].midiratio, inf)).lag(0.1);
    var d3 = Demand.ar(t, 0, Dseq([1, 2, 3, 5, 7, 8], inf)).lag(0.1);
    var sig = [d, SinOsc.ar(110*d2)] * 0.9;
    // sig[0] = sig[0] + ((floor(sig[1]*5)%5)*WhiteNoise.ar(0.05));
    var x = sig[1];
    var cut = 0.4;
    var slice = max(0, (x*2+SinOsc.ar(0.0005).range(0,500))%1-(1-cut))*(1/cut);
    var dir = ((x*2+SinOsc.ar(0.0005).range(0,500))% 2) * 2 - 3;
    var y = sig[1];
    slice = pow(slice, 4);
    sig[0] = sig[0] + (slice*0.2*SinOsc.ar(0.4)*dir);
    // sig[0] = dir;
    sig[0] = sig[0] * (1.0-(y*0.5+0.5*0.5 * SinOsc.ar(0.1)))*1.5;
    // sig[0] = SinOsc.ar(220+sig[0]*1000);
    // sig = LPF.ar(sig, 5500);
    sig = sig + snare;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)
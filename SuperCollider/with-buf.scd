(
s.boot;
~toOSC = NetAddr.new("127.0.0.1", 57121);    // create the NetAddr
// allocate a buffer for writing into
s = Server.local;
s.sendMsg("/b_alloc", 0, 48000 * 1);
b = Buffer.alloc(s, 48000, 2);
b = Buffer.alloc(s, 2000, 2);
)


//write into the buffer with a BufWr
(
y.free;
y = { arg rate=1;
    var in;
    in = SinOsc.ar(LFNoise1.kr(2, 300, 400)*[1,1.01], 0, 0.1);
    BufWr.ar(in, b, Phasor.ar(0, BufRateScale.kr(b) * rate, 0, BufFrames.kr(b)));
    0.0 //quiet
}.play;
)
(
x.free;
x = {
    var si = SinOsc;
    var sifb = SinOscFB;
    var t = Impulse.kr(1);
    var mel = Demand.kr(t, 0, Dseq([0,-2,3,7].midiratio, inf));
    var op2 = sifb.ar(110 * mel, MouseX.kr(0,5));
    var op1 = si.ar(110, 2pi * [0, 0.25]) * 0.1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 0.1;
    var sig = (op0 * op2) * 2;
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

(
x.free;
x = {
    var si = SinOsc;
    var sifb = SinOscFB;
    var t = Impulse.kr(4);
    var t2 = Impulse.kr(2);
    var mel = Demand.kr(t, 0, Dseq([0, -2, 3, 7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,0.05]),gate: t2);
    var env2 = EnvGen.kr(Env([0.001, 4000,0.001],[0.1,0.1], [-3,-3]), gate: t2);
    var hats = WhiteNoise.ar(env);
    var kick = si.ar(env2);
    var op2 = sifb.ar(110 * mel, MouseX.kr(0,5));
    var op1 = si.ar(55, 2pi * [0, 0.25]) * 0.1;
    var op0 = si.ar(220, 2pi * [0, 0.25]) * 0.1;
    var sig = (op0 * op2) * 8 * mel2.lag(0.1);
    // sig = GVerb.ar(
    // sig, 
    // sig = sig + [si.ar(0.4) * 0.5, si.ar(0.4, 2pi*0.25) * 0.5];
    // sig = sig * 0 +(kick * 0.1);
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
    var t2 = Impulse.kr(2);
    var mel = Demand.kr(t, 0, Dseq([0, -2, 3, 7].midiratio, inf)).lag(0.1);
    var mel2 = Demand.kr(t, 0, Dseq([0.25,0.5,0.75, 1], inf));
    var env = EnvGen.kr(Env([0,1,0],[0.001,0.05]),gate: t2);
    var env2 = EnvGen.kr(Env([0.001, 4000,0.001],[0.1,0.1], [-3,-3]), gate: t2);
    var hats = WhiteNoise.ar(env);
    var kick = si.ar(env2);
    var op2 = sifb.ar(110 * mel, MouseX.kr(0,5));
    var op1 = si.ar(55, 2pi * [0, 0.25]) * 0.1;
    var op0 = si.ar(110, 2pi * [0, 0.25]) * 0.1;
    var sig = (op0 * op2) * 8 * mel2.lag(0.1);
    
    // sig = GVerb.ar(
    // sig, 
    // sig = sig + [si.ar(0.4) * 0.5, si.ar(0.4, 2pi*0.25) * 0.5];
    // sig = sig * 0 +(kick * 0.1);
// roomsize: 10, revtime: 3, damping: 0.5, 
    // inputbw: 0.5, spread: 15, drylevel: 1, 
    // earlyreflevel: 0.7, taillevel: 0.5, 
    // maxroomsize: 300, mul: 1, add: 0) * 0.5 + (sig * 0.5);
    BufWr.ar(sig, b, Phasor.ar(0, BufRateScale.kr(b), 0, BufFrames.kr(b)));
    0.0;
}.play;
)

s.scope
//read it with a BufRd
(
z.free;
z = { arg rate=1;
    BufRd.ar(2, b, Phasor.ar(0, BufRateScale.kr(b) * rate, 0, BufFrames.kr(b)));
}.play(s);
)

(
z.free;
z = { arg rate=1;
    var sig = BufRd.ar(2, b, Phasor.ar(0, BufRateScale.kr(b) * rate, 0, BufFrames.kr(b)));
    DelayN.ar(sig,1,0.0005);
}.play(s);
)

b.loadToFloatArray(action: { arg array; ~fl = array;});
~fl.size
~fl.insert(0, "/dot")
~fl.asArray.size
a = ~fl.collect({|i|i});
a
a.insert(0, "/dot")
a[1]

(
~sendTask.stop;
~sendTask = Task {
    {
        b.loadToFloatArray(action: 
            { arg array; 
            // array.size.postln;
            var a = array.collect({|i|i});
            var msg = a.insert(0, "/dot");
            ~toOSC.sendMsg(*msg);
        });
        (1/30).wait;
    }.loop;
}.start();
)
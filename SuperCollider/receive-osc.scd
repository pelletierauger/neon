s.boot;

(
SynthDef.new(\pulseTest, {
    arg frequency = 220;
    var sig1, sig2, lfo, lfo2, env;
    env = XLine.kr(0.05, 0.001, 3, 1, 0, 2);
    lfo = SinOsc.kr(3);
    lfo2 = SinOsc.kr(ExpRand(20,800), mul: 0.75, add:1);
    env = env * lfo;
    sig1 = LFTri.ar((frequency + 1)) * env;
    sig2 = LFTri.ar(frequency) * env;
    // sig1 = FreeVerb.ar(sig1, mix: 0.3, room: 0.95, damp: 0.15, mul: 1, add: 0);
    // sig2 = FreeVerb.ar(sig2, mix: 0.3, room: 0.95, damp: 0.15, mul: 1, add: 0);
    Out.ar(0, sig1);
    Out.ar(1, sig2);
}).add;
)

(
SynthDef.new(\pulseTest, {
    arg frequency = 220;
    var sig, env, shift;
    env = EnvGen.kr(
    Env([0,1,0.5,0], [0.1,0.3,3]),
    doneAction:2);
    shift = round(Rand(1,2))*12;
    sig = MiBraids.ar(
    frequency.cpsmidi+shift, 
    timbre: 0.5, color: 0.5, model:42);
    sig = sig * 0.2 * env;
    Out.ar(0, sig!2);
}).add;
)

(
SynthDef.new(\pulseTest, {
    arg frequency = 220;
    var sig, env, shift;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.1,0.3,6]),
    doneAction:2);
    shift = round(Rand(1,2))*12;
    sig = MiBraids.ar(
    ~toMidi.("C#2") +
    Demand.kr(Impulse.kr(1/64),0,
    Drand([0,2,3,5,7,8,10],inf)), 
    timbre: 0.5, color: 0.5, model:42);
    sig = sig * 0.4 * env;
    Out.ar(0, sig!2);
}).add;
)

(
SynthDef.new(\pulseTest, {
    arg frequency = 220;
    var sig, env, shift;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.1,0.3,6]),
    doneAction:2);
    shift = round(Rand(1,2))*12;
    sig = MiBraids.ar(
    Demand.kr(Impulse.kr(1/64),0,Drand([0,2,3,5,7,8,10],inf))+~toMidi.("C#6"), 
    timbre: 0.99, color: 0.99, model:45, resamp:2, decim:[32,31], bits:2);
    sig = VadimFilter.ar(sig,Line.kr(2000,10000,3),0,5);
    sig = sig * 0.8 * env;
    Out.ar(0, sig);
}).add;
)

(
SynthDef.new(\pulseTest, {
    arg frequency = 220;
    var sig, env, shift;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.1,0.3,6]),
    doneAction:2);
    shift = round(Rand(1,2))*12;
    sig = MiBraids.ar(
    Demand.kr(Impulse.kr(1/64),0,Drand([0,2,3,5,7,8,10],inf))+~toMidi.("C#6"), 
    timbre: 0.99, color: 0.99, model:45, resamp:2, decim:[32,31]-22, bits:3);
    sig = VadimFilter.ar(sig,Line.kr(2000,10000,3),0,5);
    sig = sig * 0.8 * env;
    Out.ar(0, sig);
}).add;
)

(
SynthDef.new(\pulseTest, {
    arg frequency = 220;
    var sig, env, shift;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.1,0.3,6]),
    doneAction:2);
    shift = round(Rand(1,2))*12;
    sig = MiBraids.ar(
    Demand.kr(Impulse.kr(1/64),0,
    Drand([0,2,3,5,7,8,10],inf))
    +~toMidi.("C#2"), 
    timbre: 0.99, color: 0.99, 
    model:45, resamp:0, 
    decim:[32,31]-24, bits:2);
    sig = VadimFilter.ar(
    sig,Line.kr(800,10000,3),0,5);
    sig = sig * 0.8 * env;
    Out.ar(0, sig);
}).add;
)

(
SynthDef.new(\pulseTest, {
    arg frequency = 220;
    var sig, env, shift;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.1,0.3,6]),
    doneAction:2);
    shift = round(Rand(1,2))*12;
    sig = MiBraids.ar(
    Demand.kr(Impulse.kr(1/64),0,
    Drand([0,2,3,5,7,8,10],inf))
    +~toMidi.("C#2"), 
    timbre: 0.99, color: 0.99, 
    model:45, resamp:2, 
    decim:[32,31]-24, bits:2);
    sig = VadimFilter.ar(
    sig,Line.kr(800,10000,3),0,3);
    sig = sig * 1.2 * env;
    Out.ar(0, sig);
}).add;
)

(
SynthDef.new(\pulseTest, {
    arg frequency = 220;
    var sig, env, shift;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.1,0.3,6]),
    doneAction:2);
    shift = round(Rand(1,2))*12;
    sig = MiBraids.ar(
    Demand.kr(Impulse.kr(1/64),0,
    Drand([0,2,3,5,7,8,10],inf))
    +~toMidi.("C#1"), 
    timbre: 0.99, color: 0.99, 
    model:42, resamp:0, 
    decim:[32,31]-24, bits:1,ws:0);
    sig = VadimFilter.ar(
    sig,Line.kr(1000,10000,6),0,5);
    sig = sig * 0.125 * env;
    Out.ar(0, sig);
}).add;
)

(
OSCdef.new(
    \fromnode,
    {
        arg msg, time, addr, port;
        // [msg, time, addr, port].postln;
        // msg[1].postln;
        // d = Synth.new(\pinkTest, [\frequency, msg[1] * 2]);
        d = Synth.new(\pulseTest, [\note, msg[1]]);
    },
    '/hello/from/oscjs'
);
)
~reverbBus = Bus.audio(s, 2);

(
~reverb.free;
~reverb = {
    var in = In.ar(~reverbBus, 2);
    var sig = MiClouds.ar(
        inputArray: in, pit: 0, pos: 0,
        size: 0, dens: 0.01, tex: 0.25,
        drywet: 0.5, in_gain: 1, spread: 0,
        rvb: 1, fb: 0.5, freeze: 0,
        mode: 1, lofi: 0
    );
    sig + (in * 0.0);
}.play;
)


(
SynthDef.new(\pulseTest, {
    arg note = 0;
    var sig, env, shift;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.001,0.2,0.01]),
    doneAction:2);
    shift = round(Rand(0,2))*12;
    sig = MiBraids.ar(
    ~toMidi.("C#2") + note, 
    timbre: 0.85, color: 0.65, model:[42,45]);
    sig = sig * 2 * env;
    sig = sig[0] * 0.5 + sig[1];
    Out.ar(~reverbBus, sig!2);
}).add;
)


(
SynthDef.new(\pulseTest, {
    arg note = 0;
    var sig, env, shift, z;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.001,0.2,0.01]),
    doneAction:2);
    shift = round(Rand(0,2))*12;
    z = note.linlin(-1, 1, 0.65, 1);
    sig = MiBraids.ar(
    ~toMidi.("C#2") + 0, 
    timbre: [0.85, 1], color: [z, Rand(0,1)], model:[42,45]);
    sig = sig * 2 * env;
    sig = sig[0] * 0.5 + sig[1];
    Out.ar(~reverbBus, sig!2);
}).add;
)


(
SynthDef.new(\pulseTest, {
    arg note = 0, x = 0;
    var sig, env, shift, z;
    z = note;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.001,0.2+z,0.01]),
    doneAction:2);
    shift = round(Rand(0,2))*12;
    // z = note.linlin(2.5, 0.5, 0.0, 1.0);
    // z = (note - 0.5) * -0.5;
    sig = MiBraids.ar(
    ~toMidi.("C#2") + 0, 
    timbre: [0.85, z], color: [0.65, Rand(0,1)], model:[42,45]);
    sig = sig * 2 * env;
    // sig = sig + (~v.(sig, 3000, 0, 5) * z * 4);
    sig = sig[0] * 0.5 + sig[1] * (1 + (z*2));
    sig = Pan2.ar(sig, x * 0.5);
    Out.ar(~reverbBus, sig);
}).add;
)

(
SynthDef.new(\pulseTest, {
    arg note = 0, x = 0;
    var sig, env, shift, z;
    z = note;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.001,0.1,1.11]),
    doneAction:2);
    shift = round(Rand(0,2))*12;
    // z = note.linlin(2.5, 0.5, 0.0, 1.0);
    // z = (note - 0.5) * -0.5;
    sig = MiBraids.ar(
    ~toMidi.("C#2") + 0, 
    timbre: [0.85, z], color: [0.65, Rand(0,1)], model:[42,45]);
    sig = sig * 2 * env;
    // sig = sig + (~v.(sig, 3000, 0, 5) * z * 4);
    sig = sig[0] * 0.5 + sig[1] * (1 + (pow(z,4)*4));
    sig = Pan2.ar(sig, x * 0.5);
    Out.ar(~reverbBus, sig);
}).add;
)
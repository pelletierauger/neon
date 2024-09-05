(
OSCdef.new(
    \fromnode,
    {
        arg msg, time, addr, port;
        // [msg, time, addr, port].postln;
        // var note = msg[1];
        // var z = (note - 0.5) * -0.5;
        var z = ~map.(msg[1], 2.5, 0.5, 0.0, 1.0);
        var scale = Scale.minor.degrees;
        var i = floor(rrand(0.0,scale.size));
        var note = scale[i];
        // z.postln;
        z = max(0, z);
        z = min(1, z);
        // msg.postln;
        // d = Synth.new(\pinkTest, [\frequency, msg[1] * 2]);
        d = Synth.new(\pulseTest, [\z, z, \x, msg[2], \note, note]);
    },
    '/hello/from/oscjs'
);
)

(
var scale = Scale.minor.degrees;
var i = floor(rrand(0.0,scale.size));
scale[i];
)

m = Pseq([-4,0,3,5], inf).asStream;

(
SynthDef.new(\pulseTest, {
    arg z = 0, x = 0, note = 0;
    var sig, env, shift;
    // z = note;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.001,0.1,1], -6),
    doneAction:2);
    shift = round(Rand(0,2))*12;
    // z = note.linlin(2.5, 0.5, 0.0, 1.0);
    // z = (note - 0.5) * -0.5;
    sig = MiBraids.ar(
    ~toMidi.("E1") + (note*0) + m.next, 
    timbre: 0.5, color: z, model:14);
    sig = sig * env;
    sig = ~v.(sig, 4000 * z + 50, 0, 1);
    // sig = sig + (~v.(sig, 3000, 0, 5) * z * 4);
    // sig = (sig[0] * 0.125 + sig[1]) ! 2;
    // sig = Pan2.ar(sig, x);
    sig = Balance2.ar(sig, sig, x * 0.9) * 2;
    Out.ar(~reverbBus, sig);
    Out.ar(0, sig * (pow(z,4)*2));
    // Out.ar(0, sig);
}).add;
)

(
SynthDef.new(\pulseTest, {
    arg z = 0, x = 0, note = 0;
    var sig, env, shift;
    // z = note;
    env = EnvGen.kr(
    Env([0,1,0.4,0], [0.001,0.1,5], -6),
    doneAction:2);
    shift = round(Rand(0,2))*12;
    // z = note.linlin(2.5, 0.5, 0.0, 1.0);
    // z = (note - 0.5) * -0.5;
    sig = MiBraids.ar(
    ~toMidi.("E4") + note, 
    timbre: 0.5, color: z, model:14);
    sig = sig * env;
    sig = ~v.(sig, 4000 * z + 50, 0, 1);
    // sig = sig + (~v.(sig, 3000, 0, 5) * z * 4);
    // sig = (sig[0] * 0.125 + sig[1]) ! 2;
    // sig = Pan2.ar(sig, x);
    sig = Balance2.ar(sig, sig, x * 0.9) * 2;
    Out.ar(~reverbBus, sig);
    Out.ar(0, sig * (pow(z,4)*2));
    // Out.ar(0, sig);
}).add;
)
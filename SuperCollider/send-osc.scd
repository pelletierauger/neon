s.boot;
~toOSC = NetAddr.new("127.0.0.1", 57121);    // create the NetAddr
~toOSC.sendMsg("/hello", 0);    // send the application the message "hello" with the parameter "there"
{SinOsc.ar(220)*0.1!2}.play;
(
~listen.free;
~listen = OSCdef(\listener, {|msg|
        var data = msg[3..];
    // var data = msg;
        // data.postln;
        ~toOSC.sendMsg("/dot", data[0], data[1]);
}, '/dotListener');
)
~listen.free;

[0,3,2][0..1]

~dotBus = Bus.audio(s, 2);
(
~catchAndSend.free;
~catchAndSend = {
    arg in, out = 0;
    var sig = In.ar(~dotBus, 2);
    SendReply.ar(Impulse.ar(20000),  '/dotListener',  sig, 1);
    Out.ar(0, sig);
}.play;
)


(
~play.free;
~play = {
    var sig = SinOsc.ar(220, 2pi*[0,0.25])*0.1;
    Out.ar(~dotBus, sig);
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
    var sig = op0 * op2 + (op1 * 0.5);
        Out.ar(~dotBus, sig);
}.play;
)

~xy = [];
~xy = ~xy.add([0,1])
~xy = ~xy.add(2, 3)
~xy.size
~xy = ~xy.insert(0, "/dot");
(
~xy = [];
~listen.free;
~listen = OSCdef(\listener, {|msg|
        var data = msg[3..];
    // var data = msg;
        // data.postln;
        ~xy = ~xy.add(data[0]);
        ~xy = ~xy.add(data[1]);
        // if (~xy.size >= 1600, {
        //     var msg = ~xy.insert(0, "/dot");
        //     ~toOSC.sendMsg(*msg);
        //     ~xy = [];
        // });
}, '/dotListener');
)

(
~xy = [];
~sendTask.stop;
~sendTask = Task {
    {
        var msg;
        ~xy.size.postln;
        msg = ~xy.insert(0, "/dot");
        // ~toOSC.sendMsg(*msg);
        ~xy = [];
        (1/30).wait;
    }.loop;
}.start();
)
TempoClock.default.tempo;


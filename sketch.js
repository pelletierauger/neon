let looping = true;
let keysActive = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "./frames/sketch";
let maxFrames = 20;
let gl, shaderProgram;
let vertices = [];
let colors = [];
let indices = [];
let amountOfLines = 0;
let drawCount = 0;

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
    // cnvs = createCanvas(windowWidth, windowWidth / 16 * 9, WEBGL);
    noCanvas();
    cnvs = document.getElementById('my_Canvas');
    gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
    // canvasDOM = document.getElementById('my_Canvas');
    // canvasDOM = document.getElementById('defaultCanvas0');
    // gl = canvasDOM.getContext('webgl');
    // gl = cnvs.drawingContext;

    // gl = canvasDOM.getContext('webgl', { premultipliedAlpha: false });



    // gl.colorMask(false, false, false, true);
    // gl.colorMask(false, false, false, true);

    // Clear the canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(false);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.colorMask(true, true, true, true);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

    // Set the view port
    gl.viewport(0, 0, cnvs.width, cnvs.height);


    frameRate(30);
    background(0);
    fill(255, 50);
    noStroke();
    if (!looping) {
        noLoop();
    }

}
let ww;

draw = function() {
    // ww = map(sin(frameCount * 0.05), -1, 1, 0.05, 1);
    // rectangles = 0;
    // let t = frameCount * 5;
    // let osc = 0.1;
    // vertices = [];
    // colors = [];
    // indices = [];
    // let rectangle;
    // rectangle = makeQuad({
    //     c: [0, 0, 0, 1],
    //     v: [
    //         [-2 + (Math.sin(t * 0.05) * osc), -2 + (Math.cos(t * 0.05) * osc)],
    //         [2 + (Math.sin(t * 0.015) * osc), -2 + (Math.cos(t * 0.015) * osc)],
    //         [2 + (Math.sin(t * 0.015) * osc), 2 + (Math.cos(t * 0.015) * osc)],
    //         [-2 + (Math.sin(t * 0.05) * osc), 2 + (Math.cos(t * 0.05) * osc)]
    //     ]
    // });
    // addRectangleToBuffers(rectangle);
    // setShaders2();
    // amountOfLines = 0;
    // for (let i = 0; i < 10; i++) {
    //     lineOptions.r = 0.5;
    //     lineOptions.g = 0; lineOptions.b = 0;
    //     lineOptions.a = 1;
    //     lineOptions.weight = 0.001;
    //     lineOptions.blurFactor = 0.075;
    //     makeLine(0 - 1 + (i * 0.15), -0.2, 0.5 - 1 + (i * 0.15), 0.5);
    //     amountOfLines++;
    //     makeLine(0 - 1 + (i * 0.15), 0.2, 0.5 - 1 + (i * 0.15), -0.5);
    //     amountOfLines++;
    //     lineOptions.blurFactor = 0.005;
    //             lineOptions.r = 1;
    //     lineOptions.a = 1;
    //     // amountOfLines = 0;
    //     makeLine(0 - 1 + (i * 0.15), -0.2, 0.5 - 1 + (i * 0.15), 0.5);
    //     amountOfLines++;
    //     makeLine(0 - 1 + (i * 0.15), 0.2, 0.5 - 1 + (i * 0.15), -0.5);
    //     amountOfLines++;
    // }
    // let posR = [0, 0, Math.cos(t), Math.sin(t)];
    // let rotate = function(p, a) {
    //     return [
    //         p.x * a.y + p.y * a.x,
    //         p.y * a.y - p.x * a.x
    //     ];
    // };
    let testnew = true;
if (testnew) {
        let makeLine = function(x0, y0, x1, y1, w) {
        let a0 = Math.atan2(y1 - y0, x1 - x0);
        let halfPI = Math.PI * 0.5;
        let c0 = Math.cos(a0 + halfPI) * w;
        let c1 = Math.cos(a0 - halfPI) * w;
        let s0 = Math.sin(a0 + halfPI) * w;
        let s1 = Math.sin(a0 - halfPI) * w;
        let xA = x0 + c0;
        let yA = y0 + s0;
        let xB = x0 + c1;
        let yB = y0 + s1;
        let xC = x1 + c0;
        let yC = y1 + s0;
        let xD = x1 + c1;
        let yD = y1 + s1;
        return [xA, yA, xB, yB, xC, yC, xD, yD];
    };
    let ii = [0, 1, 2, 0, 2, 3];
    indices = [];
    vertices = [];
    colors = [];
    for (let j = 0; j < 20; j++) {
        for (let k = 0; k < ii.length; k++) {
            indices.push(ii[k] + (j*4));
        }
        let nj = Math.PI * 2 / 20 * j;
        let x1 = -0.5  + Math.cos(j+frameCount*1.5e-3);
        let y1 = -0.0 + (j/30);
        let x0 = x1 + 1.75;
        let y0 = y1  + Math.sin(j+frameCount*1.5e-2);
        // x1 = 0.5;
        // y1 = 0;
        let ml = makeLine(x0, y0 - 0.75, x1, y1 - 0.75, 0.75);
        let vv = [
            ml[0], ml[1], 0, 
            ml[2], ml[3], 0,
            ml[6], ml[7], 0,
            ml[4], ml[5], 0,
        ];
        for (let k = 0; k < vv.length; k++) {
            vertices.push(vv[k]);
        }
        let a = Math.sin(nj - frameCount * -1e-1) * 0.5 + 0.5;
        let cc = [
            0, 0, 0, a, 
            1, 0, 0, a, 
            1, 0, 1, a, 
            0, 0, 1, a,
        ];
        for (let k = 0; k < cc.length; k++) {
            colors.push(cc[k]);
        }
    }
}
        let rotate = function(p, a) {
        return [
            p.x * a.y + p.y * a.x,
            p.y * a.y - p.x * a.x
        ];
    };
            let rotateAngle = {x: Math.cos(frameCount * 1e-2), y: Math.sin(frameCount * 1e-2)};
        for (let i = 0; i < vertices.length; i += 3) {
            let newPos = rotate({x: vertices[i], y: vertices[i+1]}, rotateAngle);
            // vertices[i] = newPos[0];
            // vertices[i+1] = newPos[1];
        }
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Create an empty buffer object and store Index data
    var Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Create an empty buffer object and store color data
    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    setShaders();
    /* ======== Associating shaders to buffer objects =======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // get the attribute location
    var color = gl.getAttribLocation(shaderProgram, "color");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(color);
    /*============Drawing the Quad====================*/
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.colorMask(false, false, false, true);
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.colorMask(true, true, true, true);
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
    //Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
}

function keyPressed() {
    if (keysActive) {
        if (keyCode === 32) {
            if (looping) {
                noLoop();
                looping = false;
            } else {
                loop();
                looping = true;
            }
        }
        if (key == 'p' || key == 'P') {
            frameExport();
        }
        if (key == 'r' || key == 'R') {
            window.location.reload();
        }
        if (key == 'm' || key == 'M') {
            redraw();
        }
    }
}

const supported = (() => {
    try {
        if (typeof WebAssembly === "object" &&
            typeof WebAssembly.instantiate === "function") {
            const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
            if (module instanceof WebAssembly.Module)
                return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
        }
    } catch (e) {}
    return false;
})();

console.log(supported ? "WebAssembly is supported" : "WebAssembly is not supported");
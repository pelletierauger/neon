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

let x = 0;
let y = 0;
let a = 0;
let amp = 0.001;

function draw() {
    ww = map(sin(frameCount * 0.05), -1, 1, 0.05, 1);
    rectangles = 0;

    let t = frameCount * 5;
    let osc = 0.1;
    vertices = [];
    colors = [];
    indices = [];

    let rectangle;
    // rectangle = makeQuad({
    //     c: [0.0, 0.0, 0.0, 0.15],
    //     v: [
    //         [-2 + (Math.sin(t * 0.05) * osc), -2 + (Math.cos(t * 0.05) * osc)],
    //         [2 + (Math.sin(t * 0.015) * osc), -2 + (Math.cos(t * 0.015) * osc)],
    //         [2 + (Math.sin(t * 0.015) * osc), 2 + (Math.cos(t * 0.015) * osc)],
    //         [-2 + (Math.sin(t * 0.05) * osc), 2 + (Math.cos(t * 0.05) * osc)]
    //     ]
    // });
    // addRectangleToBuffers(rectangle);
    // let r = map(sin(frameCount * 0.15), -1, 1, 0, 1);
    // rectangle = makeQuad({
    //     c: [0.9, r, 1 - r, 1.0],
    //     v: [
    //         [-0.35 + (Math.sin(t * 0.05) * osc), 0.25 + (Math.cos(t * 0.05) * osc)],
    //         [0.35 + (Math.sin(t * 0.015) * osc), 0.25 + (Math.cos(t * 0.015) * osc)],
    //         [0.35 + (Math.sin(t * 0.015) * osc), 0.27 + (Math.cos(t * 0.015) * osc)],
    //         [-0.35 + (Math.sin(t * 0.05) * osc), 0.27 + (Math.cos(t * 0.05) * osc)]
    //     ],
    //     blurFactor: 1
    // });
    // addRectangleToBuffers(rectangle);
    // // osc = 0.02;
    // r = map(sin(frameCount * 0.05), -1, 1, 0, 1);
    // rectangle = makeQuad({
    //     c: [r * 0.5, 1 - r, 1, 1.0],
    //     v: [
    //         [0.245 + (Math.sin(t * 0.05) * osc), 0.35 + (Math.cos(t * 0.05) * osc)],
    //         [0.25 + (Math.sin(t * 0.05) * osc), 0.35 + (Math.cos(t * 0.05) * osc)],
    //         [0.25 + (Math.sin(t * 0.045) * osc), -0.35 + (Math.cos(t * 0.015) * osc)],
    //         [0.245 + (Math.sin(t * 0.045) * osc), -0.35 + (Math.cos(t * 0.015) * osc)]
    //     ]
    // });
    // addRectangleToBuffers(rectangle);

    // osc = 0.04;
    // rectangle = makeQuad({
    //     c: [0.0, 0.0, 0.0, 1.0],
    //     v: [
    //         [0.245 + (Math.sin(t * 0.05) * osc), 0.35 + (Math.cos(t * 0.05) * osc)],
    //         [0.25 + (Math.sin(t * 0.05) * osc), 0.35 + (Math.cos(t * 0.05) * osc)],
    //         [0.25 + (Math.sin(t * 0.045) * osc), -0.35 + (Math.cos(t * 0.015) * osc)],
    //         [0.245 + (Math.sin(t * 0.045) * osc), -0.35 + (Math.cos(t * 0.015) * osc)]
    //     ]
    // });
    // addRectangleToBuffers(rectangle);


    // Thin lines
    // let increment = 0.06;
    // for (let i = -1.45; i < 1.45; i += increment) {
    //     increment += 0.001;
    //     let blur = map(i, -1.25, 1.25, 0.01, 0.05);
    //     let weight = map(i, -1.25, 1.25, 0.001, 0.001);
    //     lineOptions.weight = weight;
    //     lineOptions.blurFactor = blur;
    //     let r = map(i, -1.25, 1.25, 0.0, 1.0);
    //     let g = map(i, -1.25, 1.25, 0.5, 1.0);
    //     let b = map(i, -1.25, 1.25, 1.0, 0.0);
    //     // lineOptions.r = r;
    //     // lineOptions.g = g;
    //     // lineOptions.b = b;
    //     let x = sin(frameCount * 0.01 + i) * 0.75;
    //     let x1 = sin(frameCount * 0.02 + i) * 0.75;
    //     makeLine(i, -0.85, i, 0.85);
    // }


// lineOptions.blurFactor = 0.01;
// lineOptions.weight = 0.00015;
// lineOptions.r = 1.0;
// lineOptions.g = 1.0;
// lineOptions.b = 1.0;
// lineOptions.a = 0.5;
// for (let i = 0; i < 10000; i++) {
//     let newA = a + noise(i * 0.001, (frameCount * 0.00005)) * 100;
//     let weight = map(sin(newA * 0.01), -1, 1, 0.00015, 0.009);
//     let blurFactor = map(sin(newA * 0.01), -1, 1, 0.00015, 0.009);
//     lineOptions.weight = weight;
//     lineOptions.blurFactor = blurFactor;
//     let newX = x + cos(newA) * amp;
//     let newY = y + sin(newA) * amp;
//     makeLine(x * 25, y * 25, newX * 25, newY * 25);
//     x = newX;
//     y = newY;
//     a = newA;
// }

    // Thick lines
    // let increment = 0.1;
    // for (let i = -1.45; i < 1.45; i += increment) {

    //     let blur = map(i, -1.25, 1.25, 0.04, 0.15);
    //     let weight = map(i, -1.25, 1.25, 0.01, 0.1);
    //     increment += weight * 0.7;
    //     lineOptions.weight = weight;
    //     lineOptions.blurFactor = blur;
    //     let r = map(i, -1.25, 1.25, 0.0, 1.0);
    //     let g = map(i, -1.25, 1.25, 0.5, 1.0);
    //     let b = map(i, -1.25, 1.25, 1.0, 0.0);
    //     // lineOptions.r = r;
    //     // lineOptions.g = g;
    //     // lineOptions.b = b;
    //     let x = sin(frameCount * 0.01 + i) * 0.75;
    //     let x1 = sin(frameCount * 0.02 + i) * 0.75;
    //     makeLine(i, -0.85, i, 0.85);
    // }



    lineOptions.weight = 0.001;
    // lineOptions.blurFactor = 0.01;
    amountOfLines = 0;
    let s = 0.01;
    for (let i = 0; i < Math.PI * 50; i += 0.2) {
        let blur = map(i, 0, Math.PI * 50, 0.01, 0.1);
        let weight = map(i, 0, Math.PI * 50, 0.001, 0.005);
        lineOptions.weight = weight;
        lineOptions.blurFactor = blur;
        // lineOptions.blurFactor = map(i, 0, Math.PI * 50, 0.01, 0.r1);
        let maxG = map(sin(frameCount * 0.01), -1, 1, 0, 1);
        let r = map(i, 0, Math.PI * 25, 1.0, 0.5);
        // r = map(sin(i * 0.1), -1, 1, 0.0, 1.0);
        let g = map(i, 0, Math.PI * 25, 0.5, maxG);
        let b = map(i, 0, Math.PI * 25, 0.0, 0.7);
        lineOptions.r = r;
        lineOptions.g = g;
        lineOptions.b = b;
        let x0 = cos(frameCount * 0.0001) * cos(frameCount * 0.025 + i) * i * s;
        let y0 = cos(frameCount * 0.0001) * sin(frameCount * 0.025 + i) * i * s;
        let x1 = cos(frameCount * 0.01) * cos(frameCount * 0.025 + i + 1) * (i + 1) * s * 0.25;
        let y1 = cos(frameCount * 0.01) * sin(frameCount * 0.025 + i + 1) * (i + 1) * s * 0.25;
        makeLine(x0 * 1, y0 * 1, x1 * 1, y1 * 1);
        amountOfLines++;
    }



    // var vertices = [-0.75, 0.0, 0.0, -0.5, -0.5, 0.0,
    //     0.75, 0.0, 0.0, 0.5, 0.5, 0.0
    // ];
    // var colors = [0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0];
    // var indices = [3, 2, 1, 3, 1, 0];

    // vertices = rectangle.vertices;
    // colors = rectangle.colors;
    // indices = rectangle.indices;
    // console.log(indices);

    // Create an empty buffer object and store vertex data
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
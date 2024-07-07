let looping = false;
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
let vertex_buffer, indices2_buffer, Index_Buffer, color_buffer, width_buffer, uv_buffer;

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

    vertex_buffer = gl.createBuffer();
    indices2_buffer = gl.createBuffer();
    Index_Buffer = gl.createBuffer();
    color_buffer = gl.createBuffer();
    width_buffer = gl.createBuffer();
    uv_buffer = gl.createBuffer();

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
    setTimeout(function() {
        scdConsoleArea.setAttribute("style", "display:block;");
        scdArea.style.display = "none";
        scdConsoleArea.setAttribute("style", "display:none;");
        jsCmArea.style.height = "685px";
        jsArea.style.display = "block";
        displayMode = "js";
        javaScriptEditor.cm.refresh();
    }, 1);
    setTimeout( function() {
        keysControl.addEventListener("mouseenter", function(event) {
            document.body.style.cursor = "none";
            document.body.style.backgroundColor = "#000000";
            appControl.setAttribute("style", "display:none;");
            let tabs = document.querySelector("#file-tabs");
            tabs.setAttribute("style", "display:none;");
            cinemaMode = true;
            scdArea.style.display = "none";
            scdConsoleArea.style.display = "none";
            jsArea.style.display = "none";
            jsConsoleArea.style.display = "none";
        }, false);
        keysControl.addEventListener("mouseleave", function(event) {
            if (!grimoire) {
                document.body.style.cursor = "default";
                document.body.style.backgroundColor = "#1C1C1C";
                appControl.setAttribute("style", "display:block;");
                let tabs = document.querySelector("#file-tabs");
                tabs.setAttribute("style", "display:block;");
                // let slider = document.querySelector("#timeline-slider");
                // slider.setAttribute("style", "display:block;");
                // slider.style.display = "block";
                // canvasDOM.style.bottom = null;
                if (displayMode === "both") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                } else if (displayMode == "scd") {
                    scdArea.style.display = "block";
                    scdConsoleArea.style.display = "block";
                } else if (displayMode == "js") {
                    jsArea.style.display = "block";
                    jsConsoleArea.style.display = "block";
                }
                cinemaMode = false;
                clearSelection();
            }   
        }, false);
    }, 1);

}

draw = function() {
    let t = drawCount;
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
    let iii = [0, 1, 2, 3];
    indices = [];
    indices2 = [];
    vertices = [];
    colors = [];
    widths = [];
    uvs = [];
    ws = [3, 0.05];
    for (let j = 0; j < 2; j++) {
        for (let k = 0; k < ii.length; k++) {
            indices.push(ii[k] + (j*4));
        }        
        for (let k = 0; k < iii.length; k++) {
            indices2.push(iii[k]);
        }
        let x0 = 0 + (j*0.25) - 0.5; let y0 = -0.2 + (j*-0.25);
        let x1 = 0.5 + (j*0.25) - 0.5; let y1 = 0.2*Math.sin(drawCount*1e-1) + (j*-0.25);
        x0 = 0; y0 = 0;
        x1 = Math.cos(drawCount*2e-2) * 0.5; y1 = Math.sin(drawCount*2e-2) * 0.5;
        // x1 = 1; y1=-0.5;
        let w = ws[j];
        // x1 = 0.5;
        // y1 = 0;
        // let ml = makeLine(x0, y0 - 0.75, x1, y1 - 0.75, 0.75);
        let ml = makeLine(x0, y0, x1, y1, 0.125);
        let vv = [
            ml[0], ml[1], 0, 
            ml[2], ml[3], 0,
            ml[6], ml[7], 0,
            ml[4], ml[5], 0,
        ];
        vv = [
            x0, y0, x1, y1,
            x0, y0, x1, y1,
            x0, y0, x1, y1,
            x0, y0, x1, y1
        ];
        for (let k = 0; k < vv.length; k++) {
            vertices.push(vv[k]);
        }
        let cc = [
            0, 0, 0, 1, 
            1, 0, 0, 1, 
            1, 0, 1, 1, 
            0, 0, 1, 1,
        ];
        for (let k = 0; k < cc.length; k++) {
            colors.push(cc[k]);
        }
        widths.push(w, w, w, w);
        let uv = [
            0, 0, 
            1, 0, 
            1, 1, 
            0, 1
        ];
        for (let k = 0; k < uv.length; k++) {
            uvs.push(uv[k]);
        }
    }
    // var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // var indices2_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices2), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Create an empty buffer object and store Index data
    // var Index_Buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // Create an empty buffer object and store color data
    // var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // setShaders();    
    // var width_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(widths), gl.STATIC_DRAW);
    // var uv_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW); 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    setShaders();
    /* ======== Associating shaders to buffer objects =======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    // bind the indices2 buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    // get the attribute location
    var indices2AttribLocation = gl.getAttribLocation(shaderProgram, "index");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(indices2AttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(indices2AttribLocation);
    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // get the attribute location
    var color = gl.getAttribLocation(shaderProgram, "color");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(color);
    // bind the width buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    // get the attribute location
    var widthAttribLocation = gl.getAttribLocation(shaderProgram, "width");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(widthAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(widthAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    var uvAttribLocation = gl.getAttribLocation(shaderProgram, "uv");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(uvAttribLocation);
    resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
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
    drawCount++;
}

let rotate = function(p, a) {
    return [
        p.x * a.y + p.y * a.x,
        p.y * a.y - p.x * a.x
    ];
};

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
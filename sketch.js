let looping = false;
let keysActive = true;
let socket, cnvs, ctx, canvasDOM;
let fileName = "./frames/sketch";
let maxFrames = 20;
let gl, currentProgram;
let vertices = [];
let verticesA = [];
let verticesB = [];
let colors = [];
let indices = [];
let amountOfLines = 0;
let drawCount = 0;
let vertex_buffer, indices2_buffer, Index_Buffer, color_buffer, width_buffer, uv_buffer, dots_buffer;
let vertex_bufferA, vertex_bufferB;
let field = [];
let makeField;
let reached, unreached;

function setup() {
    socket = io.connect('http://localhost:8080');
    pixelDensity(1);
    // cnvs = createCanvas(windowWidth, windowWidth / 16 * 9, WEBGL);
    noCanvas();
    cnvs = document.getElementById('my_Canvas');
    // gl = cnvs.getContext('webgl', { preserveDrawingBuffer: true });
    gl = cnvs.getContext('webgl', {antialias: false, depth: false});
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
    dots_buffer = gl.createBuffer();
    vertex_bufferA = gl.createBuffer();
    vertex_bufferB = gl.createBuffer();
    shadersReadyToInitiate = true;
    initializeShaders();
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);

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
    makeField = function() {
        field = [];
        let n = 400;
        for (var i = 0; i < n; i++) {
            let x = Math.cos(i*1e2*Math.sin(i*1e2)+(Math.random()*1e4))*i/n * 2;
            let y = Math.sin(i*1e2*Math.sin(i*1e2)+(Math.random()*1e4))*i/n * 2;
            // x = Math.random()*2-1;
            // y = Math.random()*2-1;
            x *= cnvs.width/cnvs.height;
            field.push([x, y]);
        }
        reached = [];
        unreached = field.slice();
        reached.push(unreached[Math.floor(Math.random()*unreached.length)]);
        unreached.splice(0, 1);
        pairs = [];
    };
    // makeField();
}

if (false) {

makeField = function() {
    field = [];
    for (let x = -(16/9); x < (16/9); x+= 0.075) {
        for (let y = -1; y < 1; y += 0.075) {
            if (Math.random() < 0.25) {
               field.push([x, y]); 
            }
            
        }
    }
    reached = [];
    unreached = field.slice();
    reached.push(unreached[Math.floor(Math.random()*unreached.length)]);
    unreached.splice(0, 1);
    pairs = [];
};
makeField();

makeField = function() {
    field = [];
    let n = 400;
    for (var i = 0; i < n; i++) {
        let x = Math.cos(i*1e2*Math.sin(i*1e2)+(Math.random()*1e4))*i/n * 2;
        let y = Math.sin(i*1e2*Math.sin(i*1e2)+(Math.random()*1e4))*i/n * 2;
        // x = Math.random()*2-1;
        // y = Math.random()*2-1;
        x *= cnvs.width/cnvs.height;
        field.push([x, y]);
    }
    reached = [];
    unreached = field.slice();
    reached.push(unreached[Math.floor(Math.random()*unreached.length)]);
    unreached.splice(0, 1);
    pairs = [];
};
makeField();

}

makeField3D = function() {
    field3D = [];
    let n = 400;
    for (var i = 0; i < n; i++) {
        // let p = randomPointInSphere();
        let p = randomPointOnSphere();
        field3D.push(p);
    }
    reached3D = [];
    unreached3D = field3D.slice();
    reached3D.push(unreached3D[Math.floor(Math.random()*unreached3D.length)]);
    unreached3D.splice(0, 1);
    pairs3D = [];
    vertices = [].concat.apply([], field3D);
    num = n;
};
makeField3D();


makeTree = function() {
    if (unreached.length > 0) {
        let record = Infinity;
        var rIndex;
        var uIndex;
        let found = false;
        for (var i = 0; i < reached.length; i++) {
          for (var j = 0; j < unreached.length; j++) {
            var v1 = reached[i];
            var v2 = unreached[j];
            var d = dist(v1[0], v1[1], v2[0], v2[1]);
              if (d < record) {
              record = d;
              rIndex = i;
              uIndex = j;
              found = true;
            }
          }
        }
        if (found) {
            pairs.push([reached[rIndex], unreached[uIndex]]);
            reached.push(unreached[uIndex]);
            unreached.splice(uIndex, 1);
        }
    } else {
        makeField();
    }
};

makeTree3D = function() {
    if (unreached3D.length > 0) {
        let record = Infinity;
        var rIndex;
        var uIndex;
        let found = false;
        for (var i = 0; i < reached3D.length; i++) {
          for (var j = 0; j < unreached3D.length; j++) {
            var v1 = reached3D[i];
            var v2 = unreached3D[j];
            var d = dist(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
              if (d < record) {
              record = d;
              rIndex = i;
              uIndex = j;
              found = true;
            }
          }
        }
        if (found) {
            pairs3D.push([reached3D[rIndex], unreached3D[uIndex]]);
            reached3D.push(unreached3D[uIndex]);
            unreached3D.splice(uIndex, 1);
        }
    } else {
        makeField3D();
    }
};

// makeTree();

// for (let i =0; i < 100; i++) {
//     makeTree();
// }

blades = [];
for (let i = 0; i < 1500; i++) {
    let x = Math.random() * 2 - 1;
    do {x = Math.random() * 2 - 1} while (Math.abs(x) < 0.1);
    let y = 0.5 * Math.random() + 0.05;
    let z = Math.random() * 1.5;
    blades.push([x, y, z])
}
blades.sort((a, b) => b[2] - a[2]);

flakes = [];
maps = function(n,sa1,so1,sa2,so2) {
    return (n-sa1)/(so1-sa1)*(so2-sa2)+sa2;
};
for (let i = 0; i < 1500; i++) {
    let x = Math.random() * 2 - 1;
    // do {x = Math.random() * 2 - 1} while (Math.abs(x) < 0.1);
    let y = maps(Math.random(), 0, 1, -0.5, 1);
    let z = Math.random() * 1.5;
    flakes.push([x, y, z, i])
}
flakes.sort((a, b) => b[2] - a[2]);

sc = 0.75;
clearPath = true;
clearPathCounter = 0;
draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    reset3DLines();
    clearPathCounter++;
    if (clearPathCounter > 500) {
        clearPath = !clearPath;
        clearPathCounter = 0;
    }
    // add3DLine(
    //     0, 0, 2,
    //     0, 0.5, 2,
    //     1/45,
    //     1, 0, 0, 0.25
    // );
    vertices = [];
    for (let i = 0; i < blades.length; i++) {
        blades[i][2] -= 0.0025 * 0.75;
        if (blades[i][2] < -0.01) {
            blades[i][2] = 1.5;
            let x = Math.random() * 2 - 1;
            if (clearPath) {
                do {x = Math.random() * 2 - 1} while (Math.abs(x) < 0.1);
            }
            blades[i][0] = x;
        }
        
        flakes[i][2] -= 0.005 * 0.75;
        flakes[i][1] -= 0.0025 * 0.75;
        flakes[i][0] += Math.sin(flakes[i][3]*1e1)*0.5e-3;
//         if (flakes[i][2] < -0.1) {
//             flakes[i][2] = 2;
//             let x = Math.random() * 2 - 1;
//             flakes[i][0] = x;
//         }
//         if (flakes[i][1] < -0.5) {
//             let y = 0.75;
//             flakes[i][1] = y;
            
//         }
        if (flakes[i][2] < -0.1 || flakes[i][1] < -0.5) {
            flakes[i][2] = 1.5;
            let x = Math.random() * 2 - 1;
            flakes[i][0] = x;
            let y = map(Math.random(), 0, 1, 0.5, 1.25);
            flakes[i][1] = y;
            
        }
    }
    blades.sort((a, b) => b[2] - a[2]);
    flakes.sort((a, b) => b[2] - a[2]);
    for (let i = 700; i < blades.length; i++) {
        let b = blades[i];
        // let f = flakes[i];
        // let alpha = map(b[2], 5, 0, 0.0, 1);
        // let width = map(b[2], 5, 0, 1/50, 1/30);
        // let sway = (Math.sin(drawCount*5e-2+b[1]*1e-3))*0.05;
        if (Math.abs(b[0]) < 0.7) {
            add3DLine(
                b[0], 0,    b[2],
                b[0], b[1], b[2],
                0.25,
                1, 0, 0, 0.35
            );
            add3DLine(
                b[0], 0,    b[2],
                b[0], b[1], b[2],
                0.03125,
                1, 0, 0, 1
            );
        }
    }
    for (let i = 400; i < flakes.length; i++) {
        vertices.push(flakes[i][0], flakes[i][1], flakes[i][2]);
    }
    currentProgram = getProgram("smooth-line-3D");
    gl.useProgram(currentProgram);
    draw3DLines();
    currentProgram = getProgram("smooth-dots-3D");
    gl.useProgram(currentProgram);
    draw3DDots(currentProgram);
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
    drawCount++;
};


resetLines = function() {
    indices = [];
    indices2 = [];
    vertices = [];
    colors = [];
    widths = [];
    uvs = [];
    lineAmount = 0;
};

reset3DLines = function() {
    indices = [];
    indices2 = [];
    verticesA = [];
    verticesB = [];
    colors = [];
    widths = [];
    uvs = [];
    lineAmount = 0;
};

add3DLine = function(x0, y0, z0, x1, y1, z1, w, r, g, b, a) {
    let ii = [0, 1, 2, 0, 2, 3];
    let iii = [0, 1, 2, 3];
    for (let k = 0; k < ii.length; k++) {
        indices.push(ii[k] + (lineAmount*4));
    }        
    for (let k = 0; k < iii.length; k++) {
        indices2.push(iii[k]);
    }
    let vv = [
        x0, y0, z0,
        x0, y0, z0,
        x0, y0, z0,
        x0, y0, z0
    ];
    for (let k = 0; k < vv.length; k++) {
        verticesA.push(vv[k]);
    }
    let vvv = [
        x1, y1, z1,
        x1, y1, z1,
        x1, y1, z1,
        x1, y1, z1
    ];
    for (let k = 0; k < vvv.length; k++) {
        verticesB.push(vvv[k]);
    }
    let cc = [
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a
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
    lineAmount++;
};

draw3DLines = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_bufferA);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesA), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_bufferB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesB), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices2), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(widths), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW); 
    // setShaders();
    /* ======== Associating shaders to buffer objects =======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_bufferA);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coordA = gl.getAttribLocation(currentProgram, "coordinatesA");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coordA, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coordA);
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_bufferB);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coordB = gl.getAttribLocation(currentProgram, "coordinatesB");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coordB, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coordB);
    // bind the indices2 buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    // get the attribute location
    var indices2AttribLocation = gl.getAttribLocation(currentProgram, "index");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(indices2AttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(indices2AttribLocation);
    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // get the attribute location
    var color = gl.getAttribLocation(currentProgram, "color");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(color);
    // bind the width buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    // get the attribute location
    var widthAttribLocation = gl.getAttribLocation(currentProgram, "width");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(widthAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(widthAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    var uvAttribLocation = gl.getAttribLocation(currentProgram, "uv");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(uvAttribLocation);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);    
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};

addLine = function(x0, y0, x1, y1, w, r, g, b, a) {
    let ii = [0, 1, 2, 0, 2, 3];
    let iii = [0, 1, 2, 3];
    for (let k = 0; k < ii.length; k++) {
        indices.push(ii[k] + (lineAmount*4));
    }        
    for (let k = 0; k < iii.length; k++) {
        indices2.push(iii[k]);
    }
    let vv = [
        x0, y0, x1, y1,
        x0, y0, x1, y1,
        x0, y0, x1, y1,
        x0, y0, x1, y1
    ];
    for (let k = 0; k < vv.length; k++) {
        vertices.push(vv[k]);
    }
    let cc = [
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a, 
        r, g, b, a
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
    lineAmount++;
};


drawLines = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices2), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(widths), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW); 
    // setShaders();
    /* ======== Associating shaders to buffer objects =======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(currentProgram, "coordinates");
    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    // bind the indices2 buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, indices2_buffer);
    // get the attribute location
    var indices2AttribLocation = gl.getAttribLocation(currentProgram, "index");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(indices2AttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(indices2AttribLocation);
    // bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // get the attribute location
    var color = gl.getAttribLocation(currentProgram, "color");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(color);
    // bind the width buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, width_buffer);
    // get the attribute location
    var widthAttribLocation = gl.getAttribLocation(currentProgram, "width");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(widthAttribLocation, 1, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(widthAttribLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    var uvAttribLocation = gl.getAttribLocation(currentProgram, "uv");
    // point attribute to the volor buffer object
    gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 0, 0);
    // enable the color attribute
    gl.enableVertexAttribArray(uvAttribLocation);
    resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);    
    timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
};


let rotate = function(p, a) {
    return [
        p.x * a.y + p.y * a.x,
        p.y * a.y - p.x * a.x
    ];
};

let makeLine2 = function(x0, y0, x1, y1, w) {
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
            makeField();
        }
        if (key == 'r' || key == 'R') {
            window.location.reload();
        }
        if (key == 'm' || key == 'M') {
            redraw();
        }
    }
}


drawAlligatorQuiet = function(selectedProgram) {
    vertices = [];
    num=0;
    for (let i = 0; i < 500; i++) {
        let x = Math.cos(i-drawCount) * i * 9e-4 * sc;
        let y = Math.sin(i-drawCount) * i * 9e-4 * sc;
        vertices.push(x, y);
        num++;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, num);
}


set3DDots = function(selectedProgram) {
    vertices = [];
    num = 0;
    for (let i = 0; i < 1500; i++) {
        // let x = Math.random();
        // let y = Math.random();
        // let z = Math.random();
        let p = randomPointInSphere();
        vertices.push(p[0] * 0.5, p[1] * 0.5, p[2] * 0.5);
        num++;
    }
};
// set3DDots();

function randomPointInSphere() {
    var d, x, y, z;
    do {
        x = Math.random() * 2.0 - 1.0;
        y = Math.random() * 2.0 - 1.0;
        z = Math.random() * 2.0 - 1.0;
        d = x * x + y * y + z * z;
    } while(d > 1.0);
    return [x, y, z];
}

function randomPointOnSphere(x0 = 0, y0 = 0, z0 = 0, radius = 1) {
   var y = Math.random() * 2 - 1;  // random y from -1 to 1
   var r = Math.sqrt(1 - y*y);     // radius on xz plane at y
   var long = Math.random() * 2 * Math.PI;  // random longitude
   return [x0 + radius * r * Math.sin(long),
           y0 + radius * y,
           z0 + radius * r * Math.cos(long)];
};

draw3DDots = function(selectedProgram) {
    gl.bindBuffer(gl.ARRAY_BUFFER, dots_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Get the attribute location
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, vertices.length / 3);
};
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
let vbuffer;
let field = [];
let makeField;
let reached, unreached;
let clearSelection = function() {};
let g;
let walkerVertices = [];
let walker_buffer;
let w;
const openSimplex = openSimplexNoise(25);
// openSimplex.noise2D(0, drawCount * 5e-2 + 1e5) * 0.0025;

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
    vbuffer = gl.createBuffer();
    walker_buffer = gl.createBuffer();
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
    // g = new Graph();
    // makeField3D();
    // do {
    //     makeTree3D();
    // } while(unreached3D.length > 0.0);
    // w = new Walker(g.vertices[0], g);
    makeFog();
}

makeField3D = function() {
    field3D = [];
    let field3DArrays = [];
    let n = 400;
    for (var i = 0; i < n; i++) {
        // let p = randomPointInSphere();
        let p = randomPointOnSphere();
        field3DArrays.push(p);
        let v = new Vertex(p[0], p[1], p[2], g);
        field3D.push(v);
    }
    reached3D = [];
    unreached3D = field3D.slice();
    let firstReached = Math.floor(Math.random() * unreached3D.length);
    reached3D.push(unreached3D[firstReached]);
    unreached3D.splice(firstReached, 1);
    pairs3D = [];
    vertices = [].concat.apply([], field3DArrays);
    vertices3 = [].concat.apply([], vertices);
    verticesAlt = [];
    for (let i = 0; i < vertices.length; i++) {
        vertices3.push(vertices[i] * 1.2);
        verticesAlt.push(vertices[i] * 1.2);
    }
    for (let i = 0; i < vertices.length; i++) {
        vertices3.push(vertices[i] * 1.4);
        verticesAlt.push(vertices[i] * 1.4);
    }
    newPairs3D = [];
    do {
        let r0 = Math.floor(Math.random() * verticesAlt.length / 3);
        let r1; 
        do {r1 = Math.floor(Math.random() * verticesAlt.length / 3)} while (r1 == r0);
        let a = [verticesAlt[r0 * 3], verticesAlt[r0 * 3 + 1], verticesAlt[r0 * 3 + 2]];
        let b = [verticesAlt[r1 * 3], verticesAlt[r1 * 3 + 1], verticesAlt[r1 * 3 + 2]];
        let d = dist(a[0], a[1], a[2], b[0], b[1], b[2]);
        if (d < 0.15) { 
            newPairs3D.push([a, b]);
        }
    } while(newPairs3D.length < 300);
    num = n;
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
            // var d = dist(v1[0], v1[1], v1[2], v2[0], v2[1], v2[2]);
            var d = dist(
                v1.pos.x, v1.pos.y, v1.pos.z, 
                v2.pos.x, v2.pos.y, v2.pos.z
            );
            if (d < record) {
              record = d;
              rIndex = i;
              uIndex = j;
              found = true;
            }
          }
        }
        if (found) {
            let e = new Edge(reached3D[rIndex], unreached3D[uIndex], g);
            pairs3D.push([
                reached3D[rIndex].posArray(), 
                unreached3D[uIndex].posArray()
            ]);
            reached3D.push(unreached3D[uIndex]);
            unreached3D.splice(uIndex, 1);
        }
    } else {
        makeField3D();
    }
};

draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    reset3DLines();
    // makeTree3D();
    walkerVertices = [];
    for (let i = 0; i < g.walkers.length; i++) {
        let gw = g.walkers[i];
        // gw.speed = map(Math.sin(drawCount*1e-3), -1, 1, 0.01, 0.001);
        if (!gw.walking && !gw.sleeping) {
            gw.startWalking();
        }
        if (gw.walking) {
            gw.walk();
        }
        gw.show();
    }
    let ce;
    for (let i = 0; i < g.edges.length; i++) {
        if (g.edges[i] === g.walkers[0].e) {
            ce = i;
        }
    }
    for (let i = 0; i < pairs3D.length; i++) {
        if (i !== ce && g.edges[i].fire > 0.1) {
            add3DLine(
                pairs3D[i][0][0], 
                pairs3D[i][0][1], 
                pairs3D[i][0][2], 
                pairs3D[i][1][0], 
                pairs3D[i][1][1], 
                pairs3D[i][1][2], 
                1/6,
                1, 0, g.edges[i].fire, 0.5
            );
        }
    }
    for (let i = 0; i < pairs3D.length; i++) {
        if (i !== ce && g.edges[i].fire > 0.1) {
        add3DLine(
            pairs3D[i][0][0], 
            pairs3D[i][0][1], 
            pairs3D[i][0][2], 
            pairs3D[i][1][0], 
            pairs3D[i][1][1], 
            pairs3D[i][1][2], 
            1/45,
            1, 0, g.edges[i].fire, 1
        );
        }
    }
    // for (let i = 0; i < newPairs3D.length; i++) {
    //     add3DLine(
    //         newPairs3D[i][0][0], 
    //         newPairs3D[i][0][1], 
    //         newPairs3D[i][0][2], 
    //         newPairs3D[i][1][0], 
    //         newPairs3D[i][1][1], 
    //         newPairs3D[i][1][2], 
    //         1/6,
    //         1, 0, 0, 0.5
    //     );
    // }
    // for (let i = 0; i < newPairs3D.length; i++) {
    //     add3DLine(
    //         newPairs3D[i][0][0], 
    //         newPairs3D[i][0][1], 
    //         newPairs3D[i][0][2], 
    //         newPairs3D[i][1][0], 
    //         newPairs3D[i][1][1], 
    //         newPairs3D[i][1][2], 
    //         1/45,
    //         1, 0, 0, 1
    //     );
    // }
    currentProgram = getProgram("holy-hills");
    gl.useProgram(currentProgram);
    // drawRectangle(currentProgram, -1, -1, 1, 1);
    if (indices.length) {
        currentProgram = getProgram("smooth-line-3D");
        gl.useProgram(currentProgram);
        draw3DLines();
    }
    vertices = [];
    for (let i = 0; i < field3D.length; i++) {
        let p = field3D[i].pos;
        let f = 0;
        for (let j = 0; j < field3D[i].edges.length; j++) {
            if (field3D[i] === g.walkers[0].v) {
                f += 1;
            } else {
                f += field3D[i].edges[j].fire;
            }
        }
        f /= field3D[i].edges.length;
        f *= 2;
        if (f > 0.01) {
            vertices.push(p.x, p.y, p.z, 0.0625*f);
        }
    }
    for (let i = 0; i < field3D.length; i++) {
        let p = field3D[i].pos;
        let f = 0;
        for (let j = 0; j < field3D[i].edges.length; j++) {
            if (field3D[i] === g.walkers[0].v) {
                f += 1;
            } else {
                f += field3D[i].edges[j].fire;
            }
        }
        f /= field3D[i].edges.length;
        f *= 2;
        if (f > 0.01) {
            vertices.push(p.x, p.y, p.z, 1*f);
        }
    }
    currentProgram = getProgram("smooth-dots-3D");
    gl.useProgram(currentProgram);
    draw3DDots(currentProgram);
    currentProgram = getProgram("smooth-walker-3D");
    gl.useProgram(currentProgram);
    drawWalker(currentProgram);
    for (let i = 0; i < g.edges.length; i++) {
        g.edges[i].fire *= 0.999;
    }
     if (exporting && frameCount < maxFrames) {
        frameExport();
    }
    // let msg = {
    //     address: "/frame",
    //     args: [{
    //         type: "f",
    //         value: drawCount
    //     }]
    // };
    // socket.emit('msgToSCD', msg);
    drawCount++;
};

if (false) {

makeFog = function() {
    zPos = 2;
    vertices = [];
    randomVertices = 0;
    let amount = 120;
    let inc = 2 / amount;
    for (let x = -0.5; x < 0.5; x += inc) {
        for (let y = -0.5; y < 0.5; y += inc) {
            for (let z = 0; z < 2; z += inc) {
                let n = openSimplex.noise3D(x*1, y*1, z*10);
                vertices.push(x+Math.random()*0.1, y+Math.random()*0.1, z+Math.random()*0.1, map(n,-1,1,0,1));
            }
        }
    }
    randomVertices = vertices.length;
    let dotPerStroke = 100;
    let strokeAmount = 20;
    for (let i = 0; i < strokeAmount; i++) {
            let z = Math.random() * 2;
            let r = Math.random();
        r = 0.15;
        for (let j = 0; j < Math.PI*2; j+=(Math.PI*2/dotPerStroke)) {
            let x = Math.cos(j) * r + (Math.random() - 0.5) * 0.015;
            let y = Math.sin(j) * r + (Math.random() - 0.5) * 0.015;
            vertices.push(x, y, z, 1);
        }
    }
};
makeFog();

}

makeFog = function() {
    zPos = 2;
    vertices = [];
    randomVertices = 0;
    let amount = 120;
    let inc = 2 / amount;
    for (let x = -0.5; x < 0.5; x += inc) {
        for (let y = -0.5; y < 0.5; y += inc) {
            for (let z = 0; z < 2; z += inc) {
                let n = openSimplex.noise3D(x*1, y*1, z*10);
                vertices.push(x+Math.random()*0.1, y+Math.random()*0.1, z+Math.random()*0.1, n*0.5+0.5);
            }
        }
    }
    randomVertices = vertices.length;
    let dotPerStroke = 300;
    let strokeAmount = 20;
    for (let j = 0; j < strokeAmount; j++) {
        let x = (Math.random() - 0.5);
        let z = Math.random() * 2;
        for (let i = 0; i < dotPerStroke; i++) {
            let y = map(i,0,dotPerStroke,-0.5,0.5);
            vertices.push(x, y, z, 1);
            x += (Math.random() - 0.5) * 0.015;
            // z += (Math.random() - 0.5) * 0.015;
        }
    }
    for (let j = 0; j < strokeAmount; j++) {
        let y = (Math.random() - 0.5);
        let z = Math.random() * 2;
        for (let i = 0; i < dotPerStroke; i++) {
            let x = map(i,0,dotPerStroke,-0.75,0.75);
            vertices.push(x, y, z, 1);
            y += (Math.random() - 0.5) * 0.015;
            // z += (Math.random() - 0.5) * 0.015;
        }
    }
};
// makeFog();

makeFog = function() {
    zPos = 2;
    vertices = [];
    randomVertices = 0;
    let amount = 120;
    let inc = 2 / amount;
    for (let x = -0.5; x < 0.5; x += inc) {
        for (let y = -0.5; y < 0.5; y += inc) {
            for (let z = 0; z < 2; z += inc) {
                let n = openSimplex.noise3D(x*1, y*1, z*10);
                vertices.push(x+Math.random()*0.1, y+Math.random()*0.1, z+Math.random()*0.1, n*0.5+0.5);
            }
        }
    }
    randomVertices = vertices.length;
    let dotPerStroke = 300;
    let strokeAmount = 20;
    for (let j = 0; j < strokeAmount; j++) {
        let x = (Math.random() - 0.5);
        let z = Math.random() * 2;
        let zInc = (Math.random()-0.5) * 0.01;
        for (let i = 0; i < dotPerStroke; i++) {
            let y = map(i,0,dotPerStroke,-0.75,0.75);
            vertices.push(x, y, z, 1);
            x += (Math.random() - 0.5) * 0.015;
            z += zInc;
            // z += (Math.random() - 0.5) * 0.015;
        }
    }
    for (let j = 0; j < strokeAmount; j++) {
        let y = (Math.random() - 0.5);
        let z = Math.random() * 2;
        let zInc = (Math.random()-0.5) * 0.01;
        for (let i = 0; i < dotPerStroke; i++) {
            let x = map(i,0,dotPerStroke,-0.75,0.75);
            vertices.push(x, y, z, 1);
            y += (Math.random() - 0.5) * 0.015;
            z += zInc;
            // z += (Math.random() - 0.5) * 0.015;
        }
    }
};
// makeFog();

walkInFog = function() {
    let fogStep = 0.005;
    zPos += fogStep;
    for (let i = 0; i < vertices.length; i+=4) {
        vertices[i+2] -= fogStep;
        if (vertices[i+2] <= 0) {
            vertices[i+2] = 2;
            if (i < randomVertices) {
                let n = openSimplex.noise3D(vertices[i], vertices[i+1], zPos*10);
                vertices[i+3] = n*0.5+0.5;
            }
        }
    }
};
// walkInFog();

draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    reset3DLines();
    walkInFog();
    // currentProgram = getProgram("holy-hills");
    // gl.useProgram(currentProgram);
    // drawRectangle(currentProgram, -1, -1, 1, 1);
    // currentProgram = getProgram("smooth-line-3D");
    // gl.useProgram(currentProgram);
    // draw3DLines();
    currentProgram = getProgram("smooth-dots-3D");
    gl.useProgram(currentProgram);
    draw3DDots(currentProgram);
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
    drawCount++;
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
    let resolutionUniformLocation = gl.getUniformLocation(currentProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    let timeUniformLocation = gl.getUniformLocation(currentProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    // gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    // gl.drawElements(gl.TRIANGLES, 6 * 1, gl.UNSIGNED_SHORT, 0);
        // gl.drawArrays(gl.TRIANGLES, 4);
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
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, vertices.length/4);
};

if (false) {

draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    reset3DLines();
    walkerVertices = [];
    let p = {x: 1, y: 0, z: 2};
    // p = yRotate(p.x, p.y, p.z, Math.PI*-0.25);
    p = xRotate(p.x, p.y, p.z, Math.PI*0.25);
    walkerVertices.push(p.x, p.y, p.z, 5);
    currentProgram = getProgram("smooth-walker-3D");
    gl.useProgram(currentProgram);
    drawWalker(currentProgram);
};

}

drawWalker = function(selectedProgram) {
    gl.bindBuffer(gl.ARRAY_BUFFER, walker_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(walkerVertices), gl.STATIC_DRAW);
    var coord = gl.getAttribLocation(selectedProgram, "coordinates");
    gl.vertexAttribPointer(coord, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.POINTS, 0, walkerVertices.length/3);
};

drawRectangle = function(selectedProgram, x0, y0, x1, y1) {
    let triangleVertices = new Float32Array([
        x0, y0, x1, y0, x1, y1, // Triangle 1
        x0, y0, x1, y1, x0, y1  // Triangle 2
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);
    let positionLocation = gl.getAttribLocation(selectedProgram, "position");
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
    let timeUniformLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeUniformLocation, drawCount);
    let resolutionUniformLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform2f(resolutionUniformLocation, cnvs.width, cnvs.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    // console.log(cnvs.width, cnvs.height);
};

yRotate = function(x, y, z, a) {
    return {
        x: x * Math.cos(a) + z * Math.sin(a),
        y: y,
        z: -x * Math.sin(a) + z * Math.cos(a)
    }
};

xRotate = function(x, y, z, a) {
    return {
        x: x,
        y: y * Math.cos(a) - z * Math.sin(a),
        z: y * Math.sin(a) + z * Math.cos(a)
    }
};
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

let points = []
    sticks = [],
    ball_radius = 1.5,
    bounce = 0.9,                     // reduce velocity after every bounce
    gravity = 0.05,
    friction = 1;

let row = 35, cols = 80, space = 2.5;
let width = 1280, height = 720;
let mouse = {
    x: width/2,
    y: height/2
};

function distance(p1, p2){
    let dx = p1.x - p2.x,
        dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Cloth simulation code from:
// https://github.com/Pragyay/Cloth-simulation
// Pragyay's code appears to be based on this tutorial video:
// Coding Math: Episode 36 - Verlet Integration Part I
// https://www.youtube.com/watch?v=3HjO_RGIjCU
function generatePoints(rows, cols, space){
    let initial_x = (width - (cols*space))/2,
        initial_y = 0;
    for(let i=0; i<rows; i++){
        initial_y += space;

        for(let j=0; j<cols; j++){
            initial_x += space;
            let point = {
                x: initial_x,
                y: initial_y,
                oldx: initial_x - 2,
                oldy: initial_y,
                color: "red"
            }
            points.push(point);
        }

        initial_x = (width - (cols*space))/2;
    }
}

function generateSticks(rows, cols, space){
    // hzt sticks
    let initial_index = 0;
    for(let i=0;i<rows;i++){
        initial_index = cols*i;

        for(let j=0;j<cols-1;j++){
            let stick = {
                p1: points[initial_index + j],
                p2: points[initial_index + j + 1],
                length: distance(points[initial_index + j], points[initial_index + j + 1])
            }
            sticks.push(stick);
        }
    }

    initial_index = 0;

    // vrt sticks
    for(let i=0;i<rows-1;i++){
        initial_index = i*cols;
        for(let j=0;j<cols;j++){
            let stick = {
                p1: points[initial_index + j],
                p2: points[initial_index + cols + j],
                length: distance(points[initial_index + j], points[initial_index+cols+j])
            }
            sticks.push(stick);
        }
    }
}

function pinPoints(){ 
    for(let i=0;i<cols;i++){
        points[i].pinned = true;
    }
}


generatePoints(row, cols, space);
generateSticks(row, cols, space);

pinPoints();


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
    // makeField = function() {
    //     field = [];
    //     let n = 400;
    //     for (var i = 0; i < n; i++) {
    //         let x = Math.cos(i*1e2*Math.sin(i*1e2)+(Math.random()*1e4))*i/n * 2;
    //         let y = Math.sin(i*1e2*Math.sin(i*1e2)+(Math.random()*1e4))*i/n * 2;
    //         // x = Math.random()*2-1;
    //         // y = Math.random()*2-1;
    //         x *= cnvs.width/cnvs.height;
    //         field.push([x, y]);
    //     }
    //     reached = [];
    //     unreached = field.slice();
    //     reached.push(unreached[Math.floor(Math.random()*unreached.length)]);
    //     unreached.splice(0, 1);
    //     pairs = [];
    // };
    // makeField();
    makeField();
    makeTree();
    
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

}

makeField = function() {
    field = [];
    let n = 400;
    for (var i = 0; i < n; i++) {
        let x = Math.cos(i*1e2*Math.sin(i*1e2)+(Math.random()*1e4))*i/n * 2;
        let y = Math.sin(i*1e2*Math.sin(i*1e2)+(Math.random()*1e4))*i/n * 2;
        x = Math.random()*2-1;
        y = Math.random()*2-1;
        x *= cnvs.width/cnvs.height;
        field.push([x, y]);
    }
    reached = [];
    unreached = field.slice();
    reached.push(unreached[Math.floor(Math.random()*unreached.length)]);
    unreached.splice(0, 1);
    pairs = [];
};




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


makeTree = function() {
    while (unreached.length > 0) {
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
    }
};

makeTree3D = function() {
    while (unreached3D.length > 0) {
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
    }
};
// makeTree3D();

// makeTree();

// for (let i =0; i < 100; i++) {
//     makeTree();
// }

sc = 0.75;
draw = function() {
    // makeTree3D(); 
    gl.clear(gl.COLOR_BUFFER_BIT);
    // vertices = [];
    reset3DLines();
    // add3DLine(
    //     0, 0, 1, 
    //     Math.cos(drawCount*0.01) * 0.125, Math.sin(drawCount*0.01) * 0.125, 1,
    //     1/2,
    //     1, 0, 0, 0.25
    // );
    // for (let i = 0; i < pairs.length; i++) {
    //     add3DLine(
    //         pairs[i][0][0], 
    //         pairs[i][0][1],
    //         1,
    //         pairs[i][1][0], 
    //         pairs[i][1][1],
    //         1,
    //         1/2,
    //         1, 0, 0, map(Math.sin(i),-1,1,0,1)
    //     );
    // }
    // for (let i = 0; i < pairs3D.length; i++) {
    //     let d = dist(
    //         pairs3D[i][0][0], pairs3D[i][0][1], pairs3D[i][0][2], 
    //         pairs3D[i][1][0], pairs3D[i][1][1], pairs3D[i][1][2]);
    //     d *= d * 35;
    //     add3DLine(
    //         pairs3D[i][0][0], 
    //         pairs3D[i][0][1],
    //         pairs3D[i][0][2],
    //         pairs3D[i][1][0], 
    //         pairs3D[i][1][1],
    //         pairs3D[i][0][2],
    //         0.85,
    //         1, 0, 0,Math.min(1.2, d)
    //     );
    // }
    for (let i = 0; i < pairs.length; i++) {
        let d = dist(
            pairs[i][0][0], pairs[i][0][1], 
            pairs[i][1][0], pairs[i][1][1]);
        d *= d * 35;
        add3DLine(
            pairs[i][0][0], 
            pairs[i][0][1],
            1,
            pairs[i][1][0], 
            pairs[i][1][1],
            1,
            0.95,
            1, 0, 0,Math.min(1.2, d)
        );
    }
    // currentProgram = getProgram("smooth-dots-3D");
    // gl.useProgram(currentProgram);
    // drawAlligatorQuiet(currentProgram);
    // draw3DDots(currentProgram);
    currentProgram = getProgram("smooth-line-3D");
    gl.useProgram(currentProgram);
    draw3DLines();
    if (exporting && frameCount < maxFrames) {
        frameExport();
    }
    drawCount++;
}

function updatePoints(){
    for(let i = 0; i < points.length; i++){
        let p = points[i];

        if(!p.pinned){
            let vx = (p.x - p.oldx)*friction,
                vy = (p.y - p.oldy)*friction;

            p.oldx = p.x;
            p.oldy = p.y;

            p.x += vx;
            p.y += vy;
            p.y += gravity;
        

            //handling edges
            let rightEdge = (width - ball_radius),
                leftEdge = topEdge = ball_radius,
                bottomEdge = (height - ball_radius);

            if(p.x > rightEdge){
                p.x = rightEdge;
                p.oldx = p.x + vx*bounce;
            }

            else if(p.x < leftEdge){
                p.x = leftEdge;
                p.oldx = p.x + vx*bounce;
            }

            else if(p.y < topEdge){
                p.y = topEdge;
                p.oldy = p.y + vy*bounce;
            }

            else if(p.y > bottomEdge){
                p.y = bottomEdge;
                p.oldy = p.y + vy*bounce;
                // points.splice(i, 1);    
            }
        }

    }
}

function updateSticks(){
    for(let i=0; i < sticks.length; i++){
        let s = sticks[i];

        let dx = s.p2.x - s.p1.x,
            dy = s.p2.y - s.p1.y,
            distance = Math.sqrt(dx*dx + dy*dy),

            difference = distance - s.length,
            percent = difference / distance / 2,
            offsetX = dx * percent,
            offsetY = dy * percent;
        
        if(!s.p1.pinned){
            s.p1.x += offsetX;
            s.p1.y += offsetY;
        }

        if(!s.p2.pinned){
            s.p2.x -= offsetX;
            s.p2.y -= offsetY;    
        }
    }
}

renderPoints = function() {
    for(let i = 0; i < points.length; i++){
        let p = points[i];
        // vertices.push(p.x, p.y, 1);
        vertices.push(p.x * 0.02 - 12.875, -p.y * 0.02 + 1.9, 1);
    //     if(p.pinned){
    //         ctx.beginPath();
    //         ctx.fillStyle = p.color;
    //         ctx.arc(p.x, p.y, ball_radius, 0, Math.PI*2);
    //         ctx.fill();
    //     }
    //     ctx.beginPath();
    //     ctx.fillStyle = "gray";
    //     ctx.arc(p.x, p.y, ball_radius, 0, Math.PI*2);
    //     ctx.fill();
    }
};

renderSticks = function() {
    // ctx.beginPath();
    for(let i = 0; i < sticks.length; i++){
        let s = sticks[i];
        // ctx.moveTo(s.p1.x, s.p1.y);
        // ctx.lineTo(s.p2.x, s.p2.y);
        // add3DLine(
        //     s.p1.x * 0.02 - 12, -s.p1.y * 0.02 + 1.2, 1, 
        //     s.p2.x * 0.02 - 12, -s.p2.y * 0.02 + 1.2, 1,
        //     1/10,
        //     1, 0, 0, 0.001
        // );
        add3DLine(
            s.p1.x * 0.02 - 12.875, -s.p1.y * 0.02 + 1.9, 1, 
            s.p2.x * 0.02 - 12.875, -s.p2.y * 0.02 + 1.9, 1,
            1/30,
            1, 0, 0, 0.0001
        );
    }
    // ctx.strokeStyle = "white";
    // ctx.strokeWidth = 0.1;
    // ctx.stroke();
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
    for (let i = 0; i < reached.length; i++) {
        vertices.push(reached[i][0], reached[i][1], 1);
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
};

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
set3DDots();

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
    gl.drawArrays(gl.POINTS, 0, vertices.length/3);
};


wind = function() {
    for (let i = row; i < (cols*row); i++) {
        let w = i % row;
        w = Math.sin(i * 0.001 + drawCount * 0.05);
        points[i].x -= w * 0.01;
    }
};
// wind();


if (false) {

for (let i = 0; i < 30; i++) {
    sticks.splice(Math.floor(Math.random()*sticks.length), 1);
}

let s = Math.floor(Math.random()*sticks.length);
for (let i = s; i < s + 5; i++) {
    sticks.splice(s, 1);
}

}

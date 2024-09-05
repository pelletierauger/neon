if (false) {

makeField3D = function() {
    g = new Graph();
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
        for (var i = 0; i < n; i++) {
        // let p = randomPointInSphere();
        let p = randomPointOnSphere();
            p = [p[0] * 0.5, p[1] * 0.5, p[2] * 0.5];
        field3DArrays.push(p);
        let v = new Vertex(p[0], p[1], p[2], g);
        field3D.push(v);
    }
    for (var i = 0; i < n * 2; i++) {
        // let p = randomPointInSphere();
        let p = randomPointOnSphere();
            p = [p[0] * 1.5, p[1] * 1.5, p[2] * 1.5];
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
        do {
        makeTree3D();
    } while(unreached3D.length > 0.0);
    w = new Walker(g.vertices[0], g);
};

makeField3D = function() {
    g = new Graph();
    field3D = [];
    let field3DArrays = [];
    let n = 400;
    let ii = Math.floor(Math.random()*400);
    let iii = Math.floor(Math.random()*400);
    let pointOnSmallSphere, pointOnMediumSphere, 
        pointOnMediumSphere2, pointOnLargeSphere;
    for (var i = 0; i < n; i++) {
        // let p = randomPointInSphere();
        let p = randomPointOnSphere();
        field3DArrays.push(p);
        let v = new Vertex(p[0], p[1], p[2], g);
        field3D.push(v);
        if (i == ii) {
            pointOnMediumSphere = p;
        }        
        if (i == iii) {
            pointOnMediumSphere2 = p;
        }
    }
        for (var i = 0; i < n; i++) {
        // let p = randomPointInSphere();
        let p = randomPointOnSphere();
            p = [p[0] * 0.5, p[1] * 0.5, p[2] * 0.5];
        field3DArrays.push(p);
        let v = new Vertex(p[0], p[1], p[2], g);
        field3D.push(v);
        if (i == ii) {
            pointOnSmallSphere = p;
        }
    }
    for (var i = 0; i < n * 2; i++) {
        // let p = randomPointInSphere();
        let p = randomPointOnSphere();
            p = [p[0] * 1.75, p[1] * 1.75, p[2] * 1.75];
        field3DArrays.push(p);
        let v = new Vertex(p[0], p[1], p[2], g);
        field3D.push(v);
        if (i == ii) {
            pointOnLargeSphere = p;
        }
    }
    for (let i = 0; i < 15; i++) {
        let mi = map(i, 0, 15, 0, 1);
        let x = (Math.random() - 0.5) * 0.1;
        let y = (Math.random() - 0.5) * 0.1;
        let z = (Math.random() - 0.5) * 0.1;
        let p = [
            lerp(pointOnSmallSphere[0], pointOnMediumSphere[0], mi) + x,
            lerp(pointOnSmallSphere[1], pointOnMediumSphere[1], mi) + y,
            lerp(pointOnSmallSphere[2], pointOnMediumSphere[2], mi) + z
        ];
        field3DArrays.push(p);
        let v = new Vertex(p[0], p[1], p[2], g);
        field3D.push(v);
    }
    for (let i = 0; i < 15; i++) {
        let mi = map(i, 0, 15, 0, 1);
        let x = (Math.random() - 0.5) * 0.3;
        let y = (Math.random() - 0.5) * 0.3;
        let z = (Math.random() - 0.5) * 0.3;
        let p = [
            lerp(pointOnMediumSphere2[0], pointOnLargeSphere[0], mi) + x,
            lerp(pointOnMediumSphere2[1], pointOnLargeSphere[1], mi) + y,
            lerp(pointOnMediumSphere2[2], pointOnLargeSphere[2], mi) + z
        ];
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
        do {
        makeTree3D();
    } while(unreached3D.length > 0.0);
    w = new Walker(g.vertices[0], g);
};

makeField3D();

}
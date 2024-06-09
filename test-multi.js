if (testnew) {
    indices = [0, 1, 2, 0, 2, 3];
    for (let j = 0; j < 5; j++) {

    }
        indices = [0, 1, 2, 0, 2, 3];
        vertices = [
        0,   0,   0, 
        0,   0.75, 0, 
        0.125, 0.75, 0, 
        0.125, 0,   0];

        colors = [
        0, 0, 0, 1, 
        0, 0, 1, 1, 
        1, 0, 1, 1, 
        1, 0, 0, 1,
        ];
        let rotateAngle = {x: Math.cos(t * 0.005), y: Math.sin(t * 0.005)};
        for (let i = 0; i < vertices.length; i += 3) {
            let newPos = rotate({x: vertices[i], y: vertices[i+1]}, rotateAngle);
            vertices[i] = newPos[0];
            vertices[i+1] = newPos[1];
        }
    }
drawTexture = function(selectedProgram, selectedTexture, alpha = 1) {
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // gl.viewport(0, 0, cnvs.width, cnvs.height);
    gl.bindTexture(gl.TEXTURE_2D, selectedTexture);
    gl.useProgram(selectedProgram);
    // aspect = cnvs.width / cnvs.height;
    let vertices = new Float32Array([
        -1, 1, 1, 1, 1, -1, // Triangle 1
        -1, 1, 1, -1, -1, -1 // Triangle 2
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    let positionLocation = gl.getAttribLocation(selectedProgram, "a_position");
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
    let textureLocation = gl.getUniformLocation(selectedProgram, "u_texture");
    gl.uniform1i(textureLocation, 0);
    let alphaLocation = gl.getUniformLocation(selectedProgram, "alpha");
    gl.uniform1f(alphaLocation, alpha);
    let timeLocation = gl.getUniformLocation(selectedProgram, "time");
    gl.uniform1f(timeLocation, drawCount);
    let resolutionLocation = gl.getUniformLocation(selectedProgram, "resolution");
    gl.uniform1f(resolutionLocation, resolutionScalar);
    let texcoordLocation = gl.getAttribLocation(selectedProgram, "a_texcoord");
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texcoordLocation);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
};
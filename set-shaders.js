setShaders = function() {
    /*======================= Shaders =======================*/
    // vertex shader source code
    var vertCode = `
        attribute vec3 coordinates;
        attribute vec4 color;
        varying vec4 vColor;
        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
            gl_Position.x = gl_Position.x * (1600.0 / 2560.0);
        vColor = color;
    }`;
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);
    // fragment shader source code
    var fragCode = `
    // beginGLSL
    precision mediump float;
    varying vec4 vColor;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        vec2 uv = gl_FragCoord.xy / vec2(1600, 1600);
        vec2 pos = gl_PointCoord;
        float rando = rand(pos);
        float r = vColor.x;
        uv = vColor.rb;
        uv.r = (uv.r + 1.) * 0.333;
        r = r * r * (3. - 2. * r);
        // r = r * r * (3. - 2. * r);
        // r = smoothstep(0., 1., r);
        // gl_FragColor = vec4(r, vColor.y, vColor.z, vColor.w - (rando * 0.15));
        gl_FragColor = vec4(r, vColor.y, vColor.z, vColor.w - (rando * 0.15));
        // float re = roundedRectangle(uv, vec2(0.5, 0.5), vec2(0.0005, 0.4) * 0.5, 0.01, 1.);
        // re = re * 0.2 + roundedRectangle(uv, vec2(0.5, 0.5), vec2(0.0, 0.4) * 0.5, 0.01, 0.5) * 0.8;
        // gl_FragColor = vec4(vec3(re), 1.0);
        // gl_FragColor.gb = vec2(0.);
        // gl_FragColor.r += 0.1;
        // gl_FragColor.a = vColor.w - (rando * 0.25);
        // gl_FragColor.rgb *= sin(gl_FragCoord.x * 100.);
        // gl_FragColor.rgb = vec3(1.0) - gl_FragColor.rgb;
    }
    // endGLSL
    `;
    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);
    // Compile the fragmentt shader
    gl.compileShader(fragShader);
    // Create a shader program object to
    // store the combined shader program
    shaderProgram = gl.createProgram();
    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);
    // Link both the programs
    gl.linkProgram(shaderProgram);
    // Use the combined shader program object
    gl.useProgram(shaderProgram);
}


setShaders = function() {
    /*======================= Shaders =======================*/
    // vertex shader source code
    var vertCode = `
        attribute vec3 coordinates;
        attribute vec4 color;
        varying vec4 vColor;
        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
            gl_Position.x = gl_Position.x * (1600.0 / 2560.0);
        vColor = color;
    }`;
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);
    // fragment shader source code
    var fragCode = `
    // beginGLSL
    precision mediump float;
    varying vec4 vColor;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        vec2 uv = gl_FragCoord.xy / vec2(1600, 1600);
        vec2 pos = gl_PointCoord;
        float rando = rand(pos);
        float r = vColor.x;
        uv = vColor.rb * 2. - 1.;
        // uv.r = (uv.r + 1.) * 0.333;
        r = r * r * (3. - 2. * r);
        // r = r * r * (3. - 2. * r);
        // r = smoothstep(0., 1., r);
        // gl_FragColor = vec4(r, vColor.y, vColor.z, vColor.w - (rando * 0.15));
        gl_FragColor = vec4(r, vColor.y, vColor.z, vColor.w - (rando * 0.15));
        float re = roundedRectangle(uv, vec2(0.5, 0.5), vec2(0.0005, 0.4) * 0.5, 0.01, 1.);
        re = re * 0.2 + roundedRectangle(uv, vec2(0.5, 0.5), vec2(0.0, 0.4) * 0.5, 0.01, 0.5) * 0.8;
        gl_FragColor = vec4(vec3(re), 1.0);
        gl_FragColor.gb = vec2(0.);
        // gl_FragColor.r += 0.1;
        gl_FragColor.a = vColor.w - (rando * 0.25);
            vec3 col = 1.0 - vec3(max(abs(uv.x), abs(uv.y)));
    gl_FragColor = vec4(col, 1.0);
        // gl_FragColor.rgb *= sin(gl_FragCoord.x * 100.);
        // gl_FragColor.rgb = vec3(1.0) - gl_FragColor.rgb;
    }
    // endGLSL
    `;
    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);
    // Compile the fragmentt shader
    gl.compileShader(fragShader);
    // Create a shader program object to
    // store the combined shader program
    shaderProgram = gl.createProgram();
    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);
    // Link both the programs
    gl.linkProgram(shaderProgram);
    // Use the combined shader program object
    gl.useProgram(shaderProgram);
}


setShaders = function() {
    /*======================= Shaders =======================*/
    // vertex shader source code
    var vertCode = `
        attribute vec3 coordinates;
        attribute vec4 color;
        varying vec4 vColor;
        void main(void) {
            gl_Position = vec4(coordinates, 1.0);
            gl_Position.x = gl_Position.x * (1600.0 / 2560.0);
        vColor = color;
    }`;
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);
    // fragment shader source code
    var fragCode = `
    // beginGLSL
    precision mediump float;
    varying vec4 vColor;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        vec2 uv = gl_FragCoord.xy / vec2(1600, 1600);
        vec2 pos = gl_PointCoord;
        float rando = rand(pos);
        float r = vColor.x;
        uv = vColor.rb;
        // uv.r = (uv.r + 1.) * 0.333;
        // r = r * r * (3. - 2. * r);
        // r = r * r * (3. - 2. * r);
        // r = smoothstep(0., 1., r);
        // gl_FragColor = vec4(r, vColor.y, vColor.z, vColor.w - (rando * 0.15));
        vec3 col = vColor.rgb;
        // col = (col + 0.5) * 0.25;
        // col.b = abs(max(col.r, col.b));
        // col.b = max(abs((col.r-0.5)*2.), abs((col.b-0.5)*2.));
        // col.b = abs(col.b * 4. - 2.) * -1. + 1.;
        // col.rb = vec2(sin(min(col.r, col.b) * 20.));
        // col.r = sin(col.b* 20.);
        // col.r = 0.0;
        // victoire 1 
        // col.r = abs(col.r * 4. - 2.) * -1. + 1.;
        // col.r = min(col.r, abs(col.b * 12. * 2. - 6. * 2.) * -1. + 6. * 2.);
        // col.b = 0.0;
        // victoire 1, fin
        float rr = abs(col.r * 4. - 2.) * -1. + 1.;
        float bb = abs(col.b * 12. * 1.5 - 6. * 1.5) * -1. + 6. * 1.5;
        col.r = min(rr, bb);
        col.r = 1.0 - length(vec2(rr, min(1.0, bb)) - vec2(1., 1.));
        // col.r = max(0.0, col.r);
        // col.r = rr;
        // col.r = max(col.r, min(rr, bb));
        // col.r = min(rr, bb) - col.r;
        col.b = 0.0;
        vec2 size = vec2(0.01, 0.01);
        // vec2 pos = 
        float d = length(max(abs(uv - vec2(0.5, 0.5)), size) - size) - 0.001;
        // col.r = smoothstep(0.66, 0.33, d / 10.001);
        // col.r = roundedRectangle(uv, vec2(0.5, 0.5), size, 0.1, 0.01);
        // col.r = length(vec2(col.r, col.r));
        col.r = smoothstep(0., 1., col.r);
        // col.b = 1.0;
        vec3 mm = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), vColor.a);
        gl_FragColor = vec4(mm, col.r - (rando * 0.1));
        // float col = uv.x;
        // col = abs(col * 4. - 2.) * -1. + 1.;
        // col = smoothstep(0., 1., col);
        // col = col * col * (3. - 2. * col);
        // if (uv.x > 0.25 && uv.x < 0.75) {
        //     uv.x = 1.;
        // } else {
        //     uv.x = map()
        // }
        // gl_FragColor = vec4(vec3(col), 1.0);
        // float re = roundedRectangle(uv, vec2(0.5, 0.5), vec2(0.0005, 0.4) * 0.5, 0.01, 1.);
        // re = re * 0.2 + roundedRectangle(uv, vec2(0.5, 0.5), vec2(0.0, 0.4) * 0.5, 0.01, 0.5) * 0.8;
        // gl_FragColor = vec4(vec3(re), 1.0);
        // gl_FragColor.gb = vec2(0.);
        // gl_FragColor.r += 0.1;
        // gl_FragColor.a = vColor.w - (rando * 0.25);
        // gl_FragColor.rgb *= sin(gl_FragCoord.x * 100.);
        // gl_FragColor.rgb = vec3(1.0) - gl_FragColor.rgb;
    }
    // endGLSL
    `;
    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);
    // Compile the fragmentt shader
    gl.compileShader(fragShader);
    // Create a shader program object to
    // store the combined shader program
    shaderProgram = gl.createProgram();
    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);
    // Link both the programs
    gl.linkProgram(shaderProgram);
    // Use the combined shader program object
    gl.useProgram(shaderProgram);
}
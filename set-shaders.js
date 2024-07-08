setShaders = function() {
    /*======================= Shaders =======================*/
    // vertex shader source code
    var vertCode = `
        // beginGLSL
        #define pi 3.1415926535897932384626433832795
        attribute float index;
        attribute vec4 coordinates;
        attribute vec4 color;
        attribute float width;
        attribute vec2 uv;
        uniform vec2 resolution;
        varying vec4 vColor;
        varying vec2 uvs;
        varying float angle;
        varying vec2 wh;
        void main(void) {
            float ratio = (resolution.y / resolution.x);
            vec2 pos = vec2(0., 0.);
            vec2 pos0 = coordinates.xy;
            vec2 pos1 = coordinates.zw;
            float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
            float pi75 = pi * 0.75;
            float pi25 = pi * 0.25;
            float w = width * 24.;
            if (index == 0.) {
                pos = pos0 + vec2(cos(a + pi75), sin(a + pi75)) * w;
            } else if (index == 1.) {
                pos = pos0 + vec2(cos(a - pi75), sin(a - pi75)) * w;
            } else if (index == 2.) {
                pos = pos1 + vec2(cos(a - pi25), sin(a - pi25)) * w;
            } else if (index == 3.) {
                pos = pos1 + vec2(cos(a + pi25), sin(a + pi25)) * w;
            }
            pos.x *= ratio;
            gl_Position = vec4(pos, 0.0, 1.0);
            wh = vec2(w * sin(pi75), length(pos1 - pos0));
            vColor = color;
            angle = a;
            uvs = uv;
        }
        // endGLSL
    `;
    var fragCode = `
    // beginGLSL
    precision mediump float;
    uniform float time;
    varying vec4 vColor;
    varying vec2 uvs;
    varying vec2 wh;
    varying float angle;
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
        vec2 fc = gl_FragCoord.xy;
        vec2 pos = gl_PointCoord;
        float rando = rand(pos);
        vec2 fwh = vec2(wh.x*2., wh.y+(wh.x*2.));
        vec2 uv = uvs * fwh;
        uv -= fwh * 0.5;
        float radius = wh.x;
        vec2 size = fwh * 0.5 - radius;
        float col = length(max(abs(uv), size) - size) - radius;
        col = min(col * -1. * (1. / (radius * 1.)), 1.0);
        radius = wh.x * 1.;
        size = fwh * 0.5 - radius;
        float col2 = length(max(abs(uv), size) - size) - radius;
        // col = pow(col, 7.);
        // col = 1.0 - col * 4.;
        col2 = min(col2 * -1. * (1. / (radius * 1.)), 1.0);
        col = smoothstep(0., 1., col);
        // col = col + col2;
        // col = col2 + col * 0.01;
        float g = pow(col, 24.0) * 0.15;
        col = (pow(col, 24.0) * 0.75) + (col * 0.25);
        col = smoothstep(0., 1., col);
        col = mix(pow(col, 10.), col, sin(time*0.1+pos.y*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(vec3(1.0, g, g), col - (rando * 0.05));
    }
    // endGLSL
    `;
    vertCode = vertCode.replace(/[^\x00-\x7F]/g, "");
    fragCode = fragCode.replace(/[^\x00-\x7F]/g, "");
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);
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

// Basic, smooth segment with minimal glow
setShaders = function() {
    /*======================= Shaders =======================*/
    // vertex shader source code
    var vertCode = `
        // beginGLSL
        #define pi 3.1415926535897932384626433832795
        attribute float index;
        attribute vec4 coordinates;
        attribute vec4 color;
        attribute float width;
        attribute vec2 uv;
        uniform vec2 resolution;
        varying vec4 c;
        varying vec2 uvs;
        varying vec2 wh;
        void main(void) {
            float ratio = (resolution.y / resolution.x);
            vec2 pos = vec2(0., 0.);
            vec2 pos0 = coordinates.xy;
            vec2 pos1 = coordinates.zw;
            float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
            float pi75 = pi * 0.75;
            float pi25 = pi * 0.25;
            if (index == 0.) {
                pos = pos0 + vec2(cos(a + pi75), sin(a + pi75)) * width;
            } else if (index == 1.) {
                pos = pos0 + vec2(cos(a - pi75), sin(a - pi75)) * width;
            } else if (index == 2.) {
                pos = pos1 + vec2(cos(a - pi25), sin(a - pi25)) * width;
            } else if (index == 3.) {
                pos = pos1 + vec2(cos(a + pi25), sin(a + pi25)) * width;
            }
            pos.x *= ratio;
            gl_Position = vec4(pos, 0.0, 1.0);
            wh = vec2(width * sin(pi75), length(pos1 - pos0));
            c = color;
            uvs = uv;
        }
        // endGLSL
    `;
    var fragCode = `
    // beginGLSL
    precision mediump float;
    uniform float time;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        vec2 fc = gl_FragCoord.xy;
        vec2 pos = gl_PointCoord;
        float rando = rand(pos);
        vec2 fwh = vec2(wh.x*2., wh.y+(wh.x*2.));
        vec2 uv = uvs * fwh;
        uv -= fwh * 0.5;
        float radius = wh.x;
        vec2 size = fwh * 0.5 - radius;
        radius *= 2.;
        float col = length(max(abs(uv), size) - size) - radius;
        col = min(col * -1. * (1. / radius), 1.0);
        col = pow(col, 3.) * 0.75 + pow(col, 43.);
        col = smoothstep(0., 1., col);
        // col = mix(pow(col, 10.)*0.25, col, sin(time*0.1+pos.y*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
    }
    // endGLSL
    `;
    vertCode = vertCode.replace(/[^\x00-\x7F]/g, "");
    fragCode = fragCode.replace(/[^\x00-\x7F]/g, "");
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);
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

if (false) {

setShaders = function() {
    /*======================= Shaders =======================*/
    // vertex shader source code
    var vertCode = `
        // beginGLSL
        #define pi 3.1415926535897932384626433832795
        attribute float index;
        attribute vec4 coordinates;
        attribute vec4 color;
        attribute float width;
        attribute vec2 uv;
        uniform vec2 resolution;
        varying vec4 vColor;
        varying vec2 uvs;
        varying float angle;
        varying vec2 wh;
        void main(void) {
            float ratio = (resolution.y / resolution.x);
            vec2 pos = vec2(0., 0.);
            vec2 pos0 = coordinates.xy;
            vec2 pos1 = coordinates.zw;
            float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
            float pi75 = pi * 0.75;
            float pi25 = pi * 0.25;
            float w = width * 0.1;
            if (index == 0.) {
                pos = pos0 + vec2(cos(a + pi75), sin(a + pi75)) * w;
            } else if (index == 1.) {
                pos = pos0 + vec2(cos(a - pi75), sin(a - pi75)) * w;
            } else if (index == 2.) {
                pos = pos1 + vec2(cos(a - pi25), sin(a - pi25)) * w;
            } else if (index == 3.) {
                pos = pos1 + vec2(cos(a + pi25), sin(a + pi25)) * w;
            }
            pos.x *= ratio;
            gl_Position = vec4(pos, 0.0, 1.0);
            wh = vec2(w * sin(pi75), length(pos1 - pos0));
            vColor = color;
            angle = a;
            uvs = uv;
        }
        // endGLSL
    `;
    var fragCode = `
    // beginGLSL
    precision mediump float;
    varying vec4 vColor;
    varying vec2 uvs;
    varying vec2 wh;
    varying float angle;
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
        vec2 pos = gl_PointCoord;
        float rando = rand(pos);
        vec2 fwh = vec2(wh.x*2., wh.y+(wh.x*2.));
        vec2 uv = uvs * fwh;
        uv -= fwh * 0.5;
        float radius = wh.x;
        vec2 size = fwh * 0.5 - radius;
        float col = length(max(abs(uv), size) - size) - radius;
        // col = pow(col, 7.);
        // col = 1.0 - col * 4.;
        col = min(col * -1. * (1. / (radius * 1.)), 1.0);
        col = smoothstep(0., 1., col);
        gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), col * 0.5 - (rando * 0.05));
    }
    // endGLSL
    `;
    vertCode = vertCode.replace(/[^\x00-\x7F]/g, "");
    fragCode = fragCode.replace(/[^\x00-\x7F]/g, "");
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);
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
        float rr = abs(col.r * 4. * 1.3 - 2. * 1.3) * -1. + 1.;
        float bb = abs(col.b * 12. * 0.55 - 6. * 0.55) * -1. + 6. * 0.55;
        // col.r = min(rr, bb);
        float rr2 = abs(col.r * 32. * 3. - 16. * 3.) * -1. + 1.;
        col.b = map(col.b, 0.0, 1.0, -0.2, 1.2);
        float bb2 = abs(col.b * 12. * 5.5 - 6. * 5.5) * -1. + 6. * 5.5;
        // col.r = min(rr2, bb2);
        // col.r = rr;
        // col.r = abs(col.b * 4. - 2.) * -1. + 1.;
        float glow = 1.0 - length(vec2(rr, min(1.0, bb)) - vec2(1., 1.));
        // col.r *= 0.5;
        float neon = 1.0 - length(vec2(rr2, min(1.0, bb2)) - vec2(1., 1.));
        // float neon = neon;
        neon = min(1.0, max(0.0, neon));
        glow = min(1.0, max(0.0, glow));
        // neon = smoothstep(0., 1., neon);
        // glow = smoothstep(0., 1., glow);
        // neon = neon * 0.6 + (glow * 0.4);
        neon = neon * 1. + max(0.0, ((glow * 0.7) - 0.25 - (neon * 0.7)));
        // col.r = max(0.0, col.r);
        // col.r *= 0.5;
        // col.r = col.r * col.r * (3. - 3. * col.r);
        // col.b = 1.0;
        vec3 mm = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), 0.);
        gl_FragColor = vec4(vec3(1.0, 0.0, 0.), neon - (rando * 0.1) + 0.);
        // float col = uv.x;
        // gl_FragColor.a = 1.0;
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
        vec3 col = vColor.rgb;
        // victoire 1 
        // col.r = abs(col.r * 4. - 2.) * -1. + 1.;
        // col.r = min(col.r, abs(col.b * 12. * 2. - 6. * 2.) * -1. + 6. * 2.);
        // col.b = 0.0;
        // victoire 1, fin
        float rr = abs(col.r * 4. * 0.3 - 2. * 0.3) * -1. + 1.;
        float wideb = map(col.b, 0.0, 1.0, 0.06, 0.94);
        float bb = abs(wideb * 12. * 0.575 - 6. * 0.575) * -1. + 6. * 0.575;
        // col.r = min(rr, bb);
        float rr2 = abs(col.r * 32. * 0.5 - 16. * 0.5) * -1. + 1.;
        col.b = map(col.b, 0.0, 1.0, -0.08, 1.08);
        float bb2 = abs(col.b * 12. * 3. - 6. * 3.) * -1. + 6. * 3.;
        // col.r = min(rr2, bb2);
        // col.r = rr;
        // col.r = abs(col.b * 4. - 2.) * -1. + 1.;
        float glow = 1.0 - length(vec2(rr, min(1.0, bb)) - vec2(1., 1.));
        // col.r *= 0.5;
        float neon = 1.0 - length(vec2(rr2, min(1.0, bb2)) - vec2(1., 1.));
        // float neon = neon;
        neon = min(1.0, max(0.0, neon));
        glow = min(1.0, max(0.0, glow));
        // neon = smoothstep(0., 1., neon);
        // glow = smoothstep(0., 1., glow);
        // neon = neon * 0.6 + (glow * 0.4);
        neon = neon * 1.2 + max(0.0, ((glow * 0.7) - 0.25 - (neon * 0.7)));
        gl_FragColor = vec4(vec3(1.0, neon*0.5, neon*0.25), neon - (rando * 0.1) + 0.);
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

}
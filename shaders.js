let smoothLine = new ShaderProgram("smooth-line");

// The original 2d line model
smoothLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute vec4 coordinates;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(0., 0.);
        vec2 pos0 = coordinates.xy;
        vec2 pos1 = coordinates.zw;
        // pos0 += vec2(
        //     cos(pos0.x*pos0.y*4.+time*0.1*sign(pos0.x*pos0.y*4.)), 
        //     sin(pos1.x*pos1.y*4.+time*0.1*sign(pos1.x*pos1.y*4.)))*0.01;
        // pos1 += vec2(
        //     cos(pos0.x*pos0.y*4.+time*0.1*sign(pos0.x*pos0.y*4.)), 
        //     sin(pos1.x*pos1.y*4.+time*0.1*sign(pos1.x*pos1.y*4.)))*0.01;
        // pos0 += vec2(
        //     cos(pos0.x*pos0.y*400.+time*1.1*sign(pos.x*pos0.y*400.)), 
        //     sin(pos1.x*pos1.y*400.+time*1.1*sign(pos.x*pos0.y*400.)))*0.0025;
        // pos1 += vec2(
        //     cos(pos0.x*pos0.y*400.+time*1.1*sign(pos.x*pos1.y*400.)), 
        //     sin(pos1.x*pos1.y*400.+time*1.1*sign(pos.x*pos1.y*400.)))*0.0025;
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
        // pos = rotateUV(pos, time * 1e-2, 0.);
        pos.x *= ratio;
        gl_Position = vec4(pos, 0.0, 1.0);
        wh = vec2(width * sin(pi75), length(pos1 - pos0));
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
smoothLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
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
                // col = mix(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
                col = mix(pow(col, 10.)*0.2, col, sin(-t*0.1+length(pos * vec2(16./9.,1.))*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
        // gl_FragColor.rgb = gl_FragColor.gbr;
    }
    // endGLSL
`;
smoothLine.vertText = smoothLine.vertText.replace(/[^\x00-\x7F]/g, "");
smoothLine.fragText = smoothLine.fragText.replace(/[^\x00-\x7F]/g, "");
smoothLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);
}

// An early 3d version that doesn't work
smoothLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute vec4 coordinates;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(0., 0.);
        vec2 pos0 = coordinates.xy;
        vec2 pos1 = coordinates.zw;
        // vec4 pos04 = vec4(pos0.x, pos0.y, 0., 1.);
        // vec4 pos14 = vec4(pos1.x, pos1.y, 0., 1.);
        // pos04 = xRotate(pi * 0.2) * pos04;
        // pos14 = xRotate(pi * 0.2) * pos14;
        // pos0 = pos04.xy * pos04.w;
        // pos1 = pos14.xy * pos14.w;
        // pos0 += vec2(
        //     cos(pos0.x*pos0.y*4.+time*0.1*sign(pos0.x*pos0.y*4.)), 
        //     sin(pos1.x*pos1.y*4.+time*0.1*sign(pos1.x*pos1.y*4.)))*0.01;
        // pos1 += vec2(
        //     cos(pos0.x*pos0.y*4.+time*0.1*sign(pos0.x*pos0.y*4.)), 
        //     sin(pos1.x*pos1.y*4.+time*0.1*sign(pos1.x*pos1.y*4.)))*0.01;
        // pos0 += vec2(
        //     cos(pos0.x*pos0.y*400.+time*1.1*sign(pos.x*pos0.y*400.)), 
        //     sin(pos1.x*pos1.y*400.+time*1.1*sign(pos.x*pos0.y*400.)))*0.0025;
        // pos1 += vec2(
        //     cos(pos0.x*pos0.y*400.+time*1.1*sign(pos.x*pos1.y*400.)), 
        //     sin(pos1.x*pos1.y*400.+time*1.1*sign(pos.x*pos1.y*400.)))*0.0025;
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
        // pos = rotateUV(pos, time * 1e-2, 0.);
        vec4 pos4 = vec4(pos.x, pos.y, 1.0, 1.0);
        pos4 = translate(0.0, 0.7, 0.0) * xRotate(pi * -0.2) * pos4;
        pos4.x *= ratio;
        pos4.xyz /= pos4.z;
        gl_Position = vec4(pos4.x, pos4.y, pos4.z, 2.0);
        wh = vec2(width * sin(pi75), length(pos1 - pos0));
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
smoothLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
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
                col = mix(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
                // col = mix(pow(col, 10.)*0.2, col, sin(-t*0.1+length(pos * vec2(16./9.,1.))*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
        // gl_FragColor.rgb = gl_FragColor.gbr;
    }
    // endGLSL
`;
smoothLine.vertText = smoothLine.vertText.replace(/[^\x00-\x7F]/g, "");
smoothLine.fragText = smoothLine.fragText.replace(/[^\x00-\x7F]/g, "");
smoothLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);
}

// A faulty 3d version that squishes the glow while rotating.
smoothLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute vec4 coordinates;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(0., 0.);
        vec2 pos0 = coordinates.xy;
        vec2 pos1 = coordinates.zw;
        vec4 pos04 = vec4(pos0.x, pos0.y, 0., 1.);
        vec4 pos14 = vec4(pos1.x, pos1.y, 0., 1.);
        pos04 = translate(0.0, 0., 1.5) * xRotate(time*4e-2*1.) * translate(0.0, 0., -1.5) * pos04;
        pos14 = translate(0.0, 0., 1.5) * xRotate(time*4e-2*1.) * translate(0.0, 0., -1.5) * pos14;
        // pos0 = pos04.xy * pos04.w;
        // pos1 = pos14.xy * pos14.w;
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
        vec4 pos4 = vec4(pos.x, pos.y, 1.0, 1.0);
        pos4 = translate(0.0, 0., 1.5)  * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos4;
        pos4.x *= ratio;
        gl_Position = vec4(pos4.x, pos4.y, 0.0, pos4.z);
        wh = vec2(width * sin(pi75), length(pos1 - pos0));
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
smoothLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
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
        // col = mix(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
        col = mix(pow(col, 10.)*0.2, col, sin(-t*0.1+length(pos * vec2(16./9.,1.))*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
        // gl_FragColor.rgb = gl_FragColor.gbr;
    }
    // endGLSL
`;
smoothLine.vertText = smoothLine.vertText.replace(/[^\x00-\x7F]/g, "");
smoothLine.fragText = smoothLine.fragText.replace(/[^\x00-\x7F]/g, "");
smoothLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);
}

// The correct 3d version that preserves the glow while rotating
smoothLine.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute vec4 coordinates;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(0., 0.);
        vec2 pos0 = coordinates.xy;
        vec2 pos1 = coordinates.zw;
        vec4 pos04 = vec4(pos0.x, pos0.y, 1., 1.);
        vec4 pos14 = vec4(pos1.x, pos1.y, 1., 1.);
        pos04 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos04;
        pos14 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos14;
        pos0 = pos04.xy / pos04.z;
        pos1 = pos14.xy / pos14.z;
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
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.);
        wh = vec2(width * sin(pi75), length(pos1 - pos0));
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
smoothLine.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
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
                // c2l =x(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
                col = mix(pow(col, 10.)*0.2, col, sin(-t*0.1+length(pos * vec2(16./9.,1.))*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
        // gl_FragColor.rgb = gl_FragColor.gbr;
    }
    // endGLSL
`;
smoothLine.vertText = smoothLine.vertText.replace(/[^\x00-\x7F]/g, "");
smoothLine.fragText = smoothLine.fragText.replace(/[^\x00-\x7F]/g, "");
smoothLine.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("smooth-line");
    gl.useProgram(currentProgram);
}


let smoothLine3D = new ShaderProgram("smooth-line-3D");

// The correct 3d version that preserves the glow while rotating
smoothLine3D.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute vec3 coordinatesA;
    attribute vec3 coordinatesB;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    varying vec2 oriPos;
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(0., 0.);
        vec4 pos0 = vec4(coordinatesA, 1.);
        vec4 pos1 = vec4(coordinatesB, 1.);
        oriPos = pos0.xy;
        // pos0 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos0;
        // pos1 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos1;
        // pos0.xyz *= map(sin(time *1e-1+pos0.y*2.), -1., 1., 0.95, 1.0);
        // pos1.xyz *= map(sin(time *1e-1+pos1.y*2.), -1., 1., 0.95, 1.0);
        // pos0.xyz *= 0.15
        // pos1.xyz *= 0.1;
        // pos0 = yRotate(-time*0.5e-2) * pos0;
        // pos0 = xRotate(-time*0.5e-2) * pos0;
        // pos0.xy *= (1.2+length(pos0.xyz)*0.1)*0.4;
        // pos1.xy *= (1.2+length(pos1.xyz)*0.1)*0.4;
        pos0 = translate(cos(time*-1e-2)*0.25, sin(time*-1e-2)*0.25, 0.0) * pos0;
        // pos1 = yRotate(-time*0.5e-2) * pos1;
        // pos1 = xRotate(-time*0.5e-2) * pos1;
        pos1 = translate(cos(time*-1e-2)*0.25, sin(time*-1e-2)*0.25, 0.0) * pos1;
        pos0.xy = pos0.xy / pos0.z;
        pos1.xy = pos1.xy / pos1.z;
        float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
        float pi75 = pi * 0.75;
        float pi25 = pi * 0.25;
        if (index == 0.) {
            pos = pos0.xy + vec2(cos(a + pi75), sin(a + pi75)) * width;
        } else if (index == 1.) {
            pos = pos0.xy + vec2(cos(a - pi75), sin(a - pi75)) * width;
        } else if (index == 2.) {
            pos = pos1.xy + vec2(cos(a - pi25), sin(a - pi25)) * width;
        } else if (index == 3.) {
            pos = pos1.xy + vec2(cos(a + pi25), sin(a + pi25)) * width;
        }
        pos.x *= ratio;
        pos.xy *= 1.25-length(pos.xy-vec2(cos(time*-1e-2)*0.5, sin(time*-1e-2)*0.5))*0.2;
        pos.xy +=vec2(cos(time*-1e-2)*0.25, sin(time*-1e-2)*0.25);
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.);
        wh = vec2(width * sin(pi75), length(pos1.xy - pos0.xy));
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
smoothLine3D.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    varying vec2 oriPos;
    ${blendingMath}
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    vec2 hash(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    float noise( in vec2 p ) {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;
        vec2  i = floor(p + (p.x + p.y) * K1 );
        vec2  a = p - i + (i.x + i.y) * K2;
        float m = step(a.y, a.x); 
        vec2  o = vec2(m, 1.0 - m);
        vec2  b = a - o + K2;
        vec2  c = a - 1.0 + 2.0 * K2;
        vec3  h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
        vec3  n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
        return dot(n, vec3(70.0));
    }
    void main(void) {
        vec2 fc = gl_FragCoord.xy;
        vec2 pos = gl_PointCoord;
        float rando = rand(pos);
        vec2 fwh = vec2(wh.x*5.5, wh.y+(wh.x*5.5));
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
                // c2l =x(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
                // col = mix(pow(col, 10.)*0.2, col, sin(-t*0.1+length(pos * vec2(16./9.,1.))*0.5e1)*0.5+0.5);
        vec2 ffc = fc / vec2(1280., 720.)-0.5;
        ffc.x *= 16./9.;
        ffc += vec2(cos(t*-1e-2)*0.25, sin(t*-1e-2)*0.25);
        float mask = max(0., 1.-length(ffc * 1.95));
        mask = pow(mask, 4.)*1.5;
        mask = max(mask,min(0.9,1./length(ffc*2.) *0.1));
        // col += (mask*0.1);
        gl_FragColor = vec4(c.rgb * (pow(col, 5.)), c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.rgb *= 1.-noise(vec2(uv.x * 15., uv.y * 0.5) * 2. + oriPos.x * 1232. + oriPos.y * 0.3)*0.6;
        // gl_FragColor.rgb *= 1.-noise(oriPos)*0.5;
        gl_FragColor.rgb *= 1.-noise((uv+oriPos)*0.75)*0.5;
        gl_FragColor.rgb = gl_FragColor.bgr;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.)) + 0.;
        gl_FragColor.rgb *= mask * (1.0-rando*0.2);
        gl_FragColor.rgb *= 1.0-uvs.y*0.75;
        if (c.b == 1.) {
        gl_FragColor.rgb = gl_FragColor.bgr * vec3(1., 1., 2.);
            gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 1.6) * 1.;
            gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, -0.3).rgb * 0.85;
        } else {
            // gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, uvs.y*0.75).rgb;
            
            // gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, -0.3).rgb * 0.85;
        }
        vec2 muvs = vec2(abs(uvs.x*2.), abs(uvs.y*0.75));
        // muvs *= vec2(sin(uvs.x*0.5), cos(uvs.y*0.5));
        float no = min(1.,max(0.,pow(noise(vec2(floor(muvs.x*20.)-0.5+oriPos.x, floor(muvs.y*20.)-0.5+oriPos.y)), 10.)))*20.;
        // no = min(1., no*2.);
        // no = max(0., no);
        gl_FragColor.rgb *= min(vec3(1.0),1.-vec3(1.0-length(vec2(mod(muvs.x*20., 1.)-0.5, mod(muvs.y*20., 1.)-0.5))*1.9) *no);
        // gl_FragColor.rgb *= 1.0-no;
        // gl_FragColor.rgb = vec3(abs(uvs.x*2.-1.));
        // gl_FragColor.g += pow(mask, 1.) * 0.2 * col;
    }
    // endGLSL
`;
smoothLine3D.vertText = smoothLine3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothLine3D.fragText = smoothLine3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothLine3D.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("smooth-line-3D");
    gl.useProgram(currentProgram);
}

if (false) {

// The correct 3d version that preserves the glow while rotating
// and also adjusts the width of lines according to their Z value.
smoothLine3D.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute float index;
    attribute vec3 coordinatesA;
    attribute vec3 coordinatesB;
    attribute vec4 color;
    attribute float width;
    attribute vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
    vec2 rotateUV(vec2 uv, float rotation, float mid) {
        return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
        );
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(0., 0.);
        vec4 pos0 = vec4(coordinatesA, 1.);
        vec4 pos1 = vec4(coordinatesB, 1.);
        // pos0 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos0;
        // pos1 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos1;
        pos0 = yRotate(-time*0.5e-2) * pos0;
        // pos0 = xRotate(-time*0.5e-2) * pos0;
        pos0 = translate(0.0, 0.0, 1.5) * pos0;
        pos1 = yRotate(-time*0.5e-2) * pos1;
        // pos1 = xRotate(-time*0.5e-2) * pos1;
        pos1 = translate(0.0, 0.0, 1.5) * pos1;
        pos0.xy = pos0.xy / pos0.z;
        pos1.xy = pos1.xy / pos1.z;
        float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
        float pi75 = pi * 0.75;
        float pi25 = pi * 0.25;
        float w = width / pos1.z;
        if (index == 0.) {
            pos = pos0.xy + vec2(cos(a + pi75), sin(a + pi75)) * w;
        } else if (index == 1.) {
            pos = pos0.xy + vec2(cos(a - pi75), sin(a - pi75)) * w;
        } else if (index == 2.) {
            pos = pos1.xy + vec2(cos(a - pi25), sin(a - pi25)) * w;
        } else if (index == 3.) {
            pos = pos1.xy + vec2(cos(a + pi25), sin(a + pi25)) * w;
        }
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.);
        wh = vec2(w * sin(pi75), length(pos1.xy - pos0.xy));
        c = color;
        uvs = uv;
        t = time;
    }
    // endGLSL
`;
smoothLine3D.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec4 c;
    varying vec2 uvs;
    varying vec2 wh;
    varying float t;
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
                // c2l =x(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
                // col = mix(pow(col, 10.)*0.2, col, sin(-t*0.1+length(pos * vec2(16./9.,1.))*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
        // gl_FragColor.rgb = gl_FragColor.gbr;
    }
    // endGLSL
`;
smoothLine3D.vertText = smoothLine3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothLine3D.fragText = smoothLine3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothLine3D.init();
if (shadersReadyToInitiate) {
    currentProgram = getProgram("smooth-line-3D");
    gl.useProgram(currentProgram);
}

}
let smoothDots = new ShaderProgram("smooth-dots");

// Spatially fluctuating smoothDots
smoothDots.vertText = `
    // beginGLSL
    attribute vec2 coordinates;
    uniform float time;
    varying float t;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        gl_Position = vec4(coordinates.x, coordinates.y, 0.0, 1.0);
        gl_PointSize = 24.;
        gl_PointSize += (sin((coordinates.y*0.02+time*2e-1))*0.5+0.5)*4.;
    // gl_PointSize *= (sin(time*0.1+gl_Position.y*1e-2)*0.5+0.5);
        t = time;
        }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 0.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        distSquared -= 1.2;
        l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.5;
        l = smoothstep(0., 1., l);
        l = mix(pow(l, 10.), l, (sin(t*0.1+gl_FragCoord.y*1e-2)*0.5+0.5));
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.75, 0.25), l+halo-noise);
        gl_FragColor.a *= (sin(t*0.1+gl_FragCoord.y*1e-2)*0.5+0.5);
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();

smoothDots.vertText = `
    // beginGLSL
    attribute vec2 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    float roundedRectangle (vec2 uv, vec2 pos, vec2 size, float radius, float thickness) {
        float d = length(max(abs(uv - pos),size) - size) - radius;
        return smoothstep(0.66, 0.33, d / thickness * 5.0);
    }
    void main(void) {
        vec2 pos = coordinates.xy;
        // pos += vec2(
        //     cos(pos.x*pos.y*4.+time*0.1*sign(pos.x*pos.y*40.)), 
        //     sin(pos.x*pos.y*4.+time*0.1*sign(pos.x*pos.y*40.)))*0.01;
        // pos += vec2(
        //     cos(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)), 
        //     sin(pos.x*pos.y*400.+time*1.1*sign(pos.x*pos.y*400.)))*0.0025;
        pos.x *= resolution.y / resolution.x;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.0);
        gl_PointSize = 15.;
        gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
    }
    // endGLSL
`;
smoothDots.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 0.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        distSquared -= 1.2;
        l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.5;
        l = smoothstep(0., 1., l);
        l = pow(l, 3.);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.75, 0.25), (l+halo-noise)*0.5);
    }
    // endGLSL
`;
smoothDots.vertText = smoothDots.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots.fragText = smoothDots.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots.init();

let smoothDots3D = new ShaderProgram("smooth-dots-3D");

smoothDots3D.vertText = `
    // beginGLSL
    attribute vec3 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = resolution.y / resolution.x;
        vec4 pos = vec4(coordinates, 1.);
        pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 25.;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
    }
    // endGLSL
`;
smoothDots3D.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 0.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        distSquared -= 1.2;
        l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.5;
        l = smoothstep(0., 1., l);
        l = pow(l, 3.);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.75, 0.25), (l+halo-noise)*0.5);
    }
    // endGLSL
`;
smoothDots3D.vertText = smoothDots3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.fragText = smoothDots3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.init();

// A version of smoothDots3D that adjusts the dot size according to its Z value
smoothDots3D.vertText = `
    // beginGLSL
    attribute vec3 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    mat4 translate(float x, float y, float z) {
        return mat4(
            1.0,  0.0,  0.0,  0.0,
            0.0,  1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,  0.0,
            x,      y,    z,  1.0
        );
    }
    mat4 xRotate(float a) {
        return mat4(
           1.0, 0.0,        0.0, 0.0,
           0.0, cos(a), -sin(a), 0.0,
           0.0, sin(a),  cos(a), 0.0,
           0.0, 0.0,        0.0, 1.0
        );
    }
    mat4 yRotate(float a) {
        return mat4(
           cos(a),  0.0, sin(a), 0.0,
           0.0,     1.0,    0.0, 0.0,
           -sin(a), 0.0, cos(a), 0.0,
           0.0,     0.0,    0.0, 1.0
        );
    }
    mat4 zRotate(float a) {
        return mat4(
           cos(a), -sin(a), 0.0, 0.0,
           sin(a),  cos(a), 0.0, 0.0,
           0.0,        0.0, 1.0, 0.0,
           0.0,        0.0, 0.0, 1.0
        );
    }
    void main(void) {
        float ratio = resolution.y / resolution.x;
        vec4 pos = vec4(coordinates, 1.);
        // pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        // pos.xyz *= map(sin(time *1e-1+pos.y*2.), -1., 1., 0.95, 1.0);
        // pos = yRotate(-time*0.5e-2) * pos;
        // pos = xRotate(-time*0.5e-2) * pos;
        // pos = translate(0.0, 0.0, 1.5) * pos;
        // pos = rotate()
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = 45. / pos.z;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
    }
    // endGLSL
`;
smoothDots3D.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    void main(void) {
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 0.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        distSquared -= 1.2;
        l += (distSquared - (l * distSquared));
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.5;
        l = smoothstep(0., 1., l);
        l = pow(l, 3.);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.25, 0.25), (l+halo-noise)*0.5);
        // gl_FragColor.rgb = gl_FragColor.bgr;
    }
    // endGLSL
`;
smoothDots3D.vertText = smoothDots3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.fragText = smoothDots3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothDots3D.init();
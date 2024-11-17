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
        // pos0 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos0;
        // pos1 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos1;
        // pos0.xyz *= map(sin(time *1e-1+pos0.y*2.), -1., 1., 0.95, 1.0);
        // pos1.xyz *= map(sin(time *1e-1+pos1.y*2.), -1., 1., 0.95, 1.0);
        // pos0.xyz *= 0.15
        // pos1.xyz *= 0.1;
        pos0.x += map(cos(time *-4e-2+pos0.x*20.), -1., 1., -0.01, 0.01);
        pos1.x += map(cos(time *-4e-2+pos1.x*20.), -1., 1., -0.01, 0.01);
        pos0.y += map(sin(time *-4e-2+pos0.x*20.), -1., 1., -0.01, 0.01);
        pos1.y += map(sin(time *-4e-2+pos1.x*20.), -1., 1., -0.01, 0.01);
        // pos0 = yRotate(-time*0.5e-2) * pos0;
        // pos0 = xRotate(-time*0.5e-2) * pos0;
        // pos0 = translate(0.0, 0.0, 0.5) * pos0;
        // pos1 = yRotate(-time*0.5e-2) * pos1;
        // pos1 = xRotate(-time*0.5e-2) * pos1;
        // pos1 = translate(0.0, 0.0, 0.5) * pos1;
        pos0.xy = pos0.xy / pos0.z;
        pos1.xy = pos1.xy / pos1.z;
        float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
        float pi75 = pi * 0.75;
        float pi25 = pi * 0.25;
        // pi75 = pi * 0.95; pi25 = pi * 0.05;
        if (index == 0.) {
            pos = pos0.xy + vec2(cos(a + pi75), sin(a + pi75)) * width;
        } else if (index == 1.) {
            pos = pos0.xy + vec2(cos(a - pi75), sin(a - pi75)) * width;
        } else if (index == 2.) {
            pos = pos1.xy + vec2(cos(a - pi25), sin(a - pi25)) * width;
        } else if (index == 3.) {
            pos = pos1.xy + vec2(cos(a + pi25), sin(a + pi25)) * width;
        }
                // pos0.xyz *= map(sin(time *1e-1+pos0.y*2.), -1., 1., 0.95, 1.0);
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.);
        wh = vec2(width * sin(pi75) * 2., length(pos1.xy - pos0.xy));
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
    ${blendingMath}
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
        vec2 fwh = vec2(wh.x, wh.y + wh.x);
        vec2 uv = (uvs - 0.5) * fwh;
        // uv *= 0.35;
        float a = 0.15;
        float L = wh.y * 0.5;
        float r = L / sin(a);
        float w = r * cos(a);
        vec2 tuv = vec2(abs(uv.x * 0.35), uv.y * 0.35) + vec2(w, 0.0);
        float circle = length(tuv);
        // circle = 1.0-smoothstep(r*0.9999,r*1.0001, circle);
        // circle = 1.0-smoothstep(r*0.9999,r*1., circle);
        circle = 1.0-smoothstep(r*0.9,r*1.1, circle);
        circle = circle*circle*2.;
        // circle = 1.0-1.0/(circle*10.);
        // circle = max(0., (1.0-smoothstep(r*0.9999,r*1.1, length(tuv)))*0.75);
        gl_FragColor = vec4(1.0);
        gl_FragColor = vec4(vec3(abs(uv.y)), 1.0);
        gl_FragColor = vec4(vec3(1.-length(uv*2.)), 1.0);
        gl_FragColor = vec4(vec3(circle), 1.0);
        circle = smoothstep(0., 1., circle);
        // circle = smoothstep(0., 1., circle);
        // circle = smoothstep(0., 1., circle);
        gl_FragColor = vec4(vec3(1.0, pow(circle, 7.)*1.25, pow(circle, 7.)*1.25), circle*c.a);
        if ((abs(uv.y) < 0.0025) || 
            (abs(uv.x) < 0.0025) ||
            (abs(abs(uv.y) - fwh.y * 0.5) < 0.005) || 
            (abs(abs(uv.x) - fwh.x * 0.5) < 0.005) ||
            (abs(abs(uv.y)-abs(uv.x)-0.5) < 0.005)) {
           // gl_FragColor = vec4(vec3(1.0,0.0,0.0), 1.0);
        }
        // gl_FragColor.rgb = gl_FragColor.brr;
        // gl_FragColor.b *= pow(circle, 0.5);
        gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, 1.0-c.a).rgb;
        // gl_FragColor = vec4(1.0);
        
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
        // pos0 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos0;
        // pos1 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos1;
        // pos0.xyz *= map(sin(time *1e-1+pos0.y*2.), -1., 1., 0.95, 1.0);
        // pos1.xyz *= map(sin(time *1e-1+pos1.y*2.), -1., 1., 0.95, 1.0);
        // pos0.xyz *= 0.15
        // pos1.xyz *= 0.1;
        pos0.x += map(cos(time *-4e-2+pos0.x*20.), -1., 1., -0.01, 0.01);
        pos1.x += map(cos(time *-4e-2+pos1.x*20.), -1., 1., -0.01, 0.01);
        pos0.y += map(sin(time *-4e-2+pos0.x*20.), -1., 1., -0.01, 0.01);
        pos1.y += map(sin(time *-4e-2+pos1.x*20.), -1., 1., -0.01, 0.01);
        // pos0 = yRotate(-time*0.5e-2) * pos0;
        // pos0 = xRotate(-time*0.5e-2) * pos0;
        // pos0 = translate(0.0, 0.0, 0.5) * pos0;
        // pos1 = yRotate(-time*0.5e-2) * pos1;
        // pos1 = xRotate(-time*0.5e-2) * pos1;
        // pos1 = translate(0.0, 0.0, 0.5) * pos1;
        pos0.xy = pos0.xy / pos0.z;
        pos1.xy = pos1.xy / pos1.z;
        float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
        float pi75 = pi * 0.75;
        float pi25 = pi * 0.25;
        // pi75 = pi * 0.95; pi25 = pi * 0.05;
        if (index == 0.) {
            pos = pos0.xy + vec2(cos(a + pi75), sin(a + pi75)) * width;
        } else if (index == 1.) {
            pos = pos0.xy + vec2(cos(a - pi75), sin(a - pi75)) * width;
        } else if (index == 2.) {
            pos = pos1.xy + vec2(cos(a - pi25), sin(a - pi25)) * width;
        } else if (index == 3.) {
            pos = pos1.xy + vec2(cos(a + pi25), sin(a + pi25)) * width;
        }
                // pos0.xyz *= map(sin(time *1e-1+pos0.y*2.), -1., 1., 0.95, 1.0);
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.);
        wh = vec2(width * sin(pi75) * 2., length(pos1.xy - pos0.xy));
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
    ${blendingMath}
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
        vec2 fwh = vec2(wh.x, wh.y + wh.x);
        vec2 uv = (uvs - 0.5) * fwh;
        // uv *= 0.35;
        float a = 0.15;
        float L = wh.y * 0.5;
        float r = L / sin(a);
        float w = r * cos(a);
        vec2 tuv = vec2(abs(uv.x * 0.35*0.6), uv.y * 0.35) + vec2(w, 0.0);
        float circle = length(tuv);
        // circle = 1.0-smoothstep(r*0.9999,r*1.0001, circle);
        // circle = 1.0-smoothstep(r*0.9999,r*1., circle);
        circle = 1.0-smoothstep(r*0.9,r*1.1, circle);
        circle = circle*circle*2.;
        // circle = 1.0-1.0/(circle*10.);
        // circle = max(0., (1.0-smoothstep(r*0.9999,r*1.1, length(tuv)))*0.75);
        gl_FragColor = vec4(1.0);
        gl_FragColor = vec4(vec3(abs(uv.y)), 1.0);
        gl_FragColor = vec4(vec3(1.-length(uv*2.)), 1.0);
        gl_FragColor = vec4(vec3(circle), 1.0);
        circle = smoothstep(0., 1., circle);
        // circle = smoothstep(0., 1., circle);
        // circle = smoothstep(0., 1., circle);
        gl_FragColor = vec4(vec3(1.0, pow(circle, 7.)*1.25, pow(circle, 7.)*1.25), circle*min(1.,c.a*c.a*2.5)-rando*0.025);
        if ((abs(uv.y) < 0.0025) || 
            (abs(uv.x) < 0.0025) ||
            (abs(abs(uv.y) - fwh.y * 0.5) < 0.005) || 
            (abs(abs(uv.x) - fwh.x * 0.5) < 0.005) ||
            (abs(abs(uv.y)-abs(uv.x)-0.5) < 0.005)) {
           // gl_FragColor = vec4(vec3(1.0,0.0,0.0), 1.0);
        }
        // gl_FragColor.rgb = gl_FragColor.brr;
        // gl_FragColor.b *= pow(circle, 0.5);
        gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, 1.0-c.a).rgb;
        // gl_FragColor = vec4(1.0);
        
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

if (false) {

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
    varying float z;
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
        // pos0 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos0;
        // pos1 = translate(0.0, 0., 1.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -1.5) * pos1;
        // pos0.xyz *= map(sin(time *1e-1+pos0.y*2.), -1., 1., 0.95, 1.0);
        // pos1.xyz *= map(sin(time *1e-1+pos1.y*2.), -1., 1., 0.95, 1.0);
        // pos0.xyz *= 0.15
        // pos1.xyz *= 0.1;
        // pos0.x += map(cos(time *-4e-2+pos0.x*20.), -1., 1., -0.01, 0.01);
        // pos1.x += map(cos(time *-4e-2+pos1.x*20.), -1., 1., -0.01, 0.01);
        // pos0.y += map(sin(time *-4e-2+pos0.x*20.), -1., 1., -0.01, 0.01);
        // pos1.y += map(sin(time *-4e-2+pos1.x*20.), -1., 1., -0.01, 0.01);
        pos0 = yRotate(-time*0.5e-2) * pos0;
        pos0 = xRotate(-time*0.5e-2) * pos0;
        pos0 = translate(0.0, 0.0, 1.5) * pos0;
        pos1 = yRotate(-time*0.5e-2) * pos1;
        pos1 = xRotate(-time*0.5e-2) * pos1;
        pos1 = translate(0.0, 0.0, 1.5) * pos1;
        pos0.xy = pos0.xy / pos0.z;
        pos1.xy = pos1.xy / pos1.z;
        float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
        float pi75 = pi * 0.75;
        float pi25 = pi * 0.25;
        // pi75 = pi * 0.95; pi25 = pi * 0.05;
        if (index == 0.) {
            pos = pos0.xy + vec2(cos(a + pi75), sin(a + pi75)) * width;
        } else if (index == 1.) {
            pos = pos0.xy + vec2(cos(a - pi75), sin(a - pi75)) * width;
        } else if (index == 2.) {
            pos = pos1.xy + vec2(cos(a - pi25), sin(a - pi25)) * width;
        } else if (index == 3.) {
            pos = pos1.xy + vec2(cos(a + pi25), sin(a + pi25)) * width;
        }
                // pos0.xyz *= map(sin(time *1e-1+pos0.y*2.), -1., 1., 0.95, 1.0);
        pos.x *= ratio;
        pos.xy *= 2.;
        gl_Position = vec4(pos.x, pos.y, 0.0, 1.);
        z = pos0.z;
        wh = vec2(width * sin(pi75) * 2., length(pos1.xy - pos0.xy));
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
    varying float z;
    ${blendingMath}
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
        vec2 fwh = vec2(wh.x, wh.y + wh.x);
        vec2 uv = (uvs - 0.5) * fwh;
        // uv *= 0.35;
        float a = 0.15;
        float L = wh.y * 0.45;
        float r = L / sin(a);
        float w = r * cos(a);
        vec2 tuv = vec2(abs(uv.x * 0.35*0.5), uv.y * 0.35) + vec2(w, 0.0);
        float circle = length(tuv);
        // circle = 1.0-smoothstep(r*0.9999,r*1.0001, circle);
        // circle = 1.0-smoothstep(r*0.9999,r*1., circle);
        circle = 1.0-smoothstep(r*0.9,r*1.1, circle);
        circle = circle*circle*2.;
        // circle = 1.0-1.0/(circle*10.);
        // circle = max(0., (1.0-smoothstep(r*0.9999,r*1.1, length(tuv)))*0.75);
        gl_FragColor = vec4(1.0);
        gl_FragColor = vec4(vec3(abs(uv.y)), 1.0);
        gl_FragColor = vec4(vec3(1.-length(uv*2.)), 1.0);
        gl_FragColor = vec4(vec3(circle), 1.0);
        circle = smoothstep(0., 1., circle);
        // circle = smoothstep(0., 1., circle);
        // circle = smoothstep(0., 1., circle);
        gl_FragColor = vec4(vec3(1.0, pow(circle, 7.)*1.25, pow(circle, 7.)*1.25), circle*(1.0-z*0.35));
        if ((abs(uv.y) < 0.0025) || 
            (abs(uv.x) < 0.0025) ||
            (abs(abs(uv.y) - fwh.y * 0.5) < 0.005) || 
            (abs(abs(uv.x) - fwh.x * 0.5) < 0.005) ||
            (abs(abs(uv.y)-abs(uv.x)-0.5) < 0.005)) {
           // gl_FragColor = vec4(vec3(1.0,0.0,0.0), 1.0);
        }
        // gl_FragColor.rgb = gl_FragColor.brr;
        // gl_FragColor.b *= pow(circle, 0.5);
        gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, z*0.35).rgb;
        // gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.gbr, 1.0-c.a*c.a);
        
        // gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, 1.0-c.a).rgb;
        // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, -2.0);
        // gl_FragColor = vec4(1.0);
        
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
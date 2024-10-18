let pearl = new ShaderProgram("pearl");

// A version of smoothDots3D that adjusts the dot size according to its Z value
pearl.vertText = `
    // beginGLSL
    ${pi}
    attribute vec3 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
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
        vec4 pos = vec4(coordinates * 1.05, 1.);
        // pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        // pos.xyz *= map(sin(time *1e-1+pos.y*2.), -1., 1., 0.95, 1.0);
        // pos.xyz *= 1.25;
        // pos.xyz *= map(sin(pos.y*5.-time*0.5e-1)*0.5+0.5, 0., 1., 1.0, 0.95);
        // pos = yRotate(-time*0.25e-2) * pos;
        // pos = xRotate(time*0.25e-2) * pos;
        // pos = xRotate(-time*0.5e-2) * pos;
        // pos = translate(0.0, 0.0, 1.5) * pos;
        // pos = rotate()
        // pos = translate(0.0, 0.9, 1.5) * pos;
        
        pos = xRotate(pi * -1.9) * pos;
        posUnit = pos.xyz;
        // pos.x *= ratio;
        gl_Position = vec4(pos.x * ratio, pos.y*-1., 0.0, pos.z);
        gl_PointSize = 24./pos.z;
        t = time;
        
        pos = translate(0.0, 0.0, -0.5) * pos;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
        posUnit2 = pos.xyz;
        if (length(posUnit2.xz) > 0.4) {
            // gl_PointSize = 0.0;
        }
        if ((posUnit.z) > 0.72) {
            // gl_PointSize = 0.0;
        }
    }
    // endGLSL
`;
pearl.fragText = `
    // beginGLSL
    ${pi}
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    ${mapFunction}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
    void main(void) {
        vec2 uv = posUnit.xy/posUnit.z;
        // float ratio = resolution.x / resolution.y;
        // uv -= 0.5;
        uv *= 1.5 * vec2(1., 1.);
        float x = (uv.x*0.8 - uv.y) - t * 5e-2;
        // x = (1.0-length(uv)) - t * 5e-2;
        float osc = map(sin(x),-1.,1.,0.25,1.);
        osc = pow(osc, 7.);
        float osc2 = (mod(x+(pi*0.5), pi*2.) / (pi*2.))*2.-1.;
        vec2 v1 = vec2(-0.4, 0.4);
        vec2 v2 = vec2(0.4, 0.4);
        vec2 v3 = vec2(0.0, -0.4);
        float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
        vec2 pos = gl_PointCoord;
        vec2 pos2 = gl_PointCoord - vec2(-osc2, osc2);
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 12.;
        distSquared = smoothstep(0., 1., distSquared);
        float contour = distSquared;
        contour = smoothstep(0.25, 1., contour);
        // contour = smoothstep(0., 1., contour);
        float distSquared2 = 1.0 - dot(pos2 - 0.5, pos2 - 0.5) * 12.;
        distSquared2 = smoothstep(0., 1., distSquared2);
        // distSquared += distSquared2 * distSquared * 0.0625;
        distSquared *= mix(1.0, distSquared2, 0.5);
        distSquared -= (1.0-distSquared2)*0.25;
        // float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // // l += distSquared * 0.25;
        // distSquared -= 1.2;
        // l += (distSquared - (l * distSquared));
        // float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.25;
        // // halo = smoothstep(0., 1., halo);
        // l = smoothstep(0., 1., l);
        // l = pow(l, 3.);
        // float noise = rand(pos - vec2(cos(t), sin(t))) * 0.02;
        // gl_FragColor = vec4(vec3(1.0, 0.25, 0.25), (l+halo-noise)*0.5*3.);
        // // gl_FragColor.rgb = gl_FragColor.bgr;
        // vec3 light = posUnit - vec3(0.0, 0., 0.);
        // float distSquared2 = 1.0 - dot(light, light) * 1.5;
        // gl_FragColor.rgb *= 1.0 - posUnit.z;
        // distSquared2 = mix(distSquared, pow(max(0.0, distSquared2), 4.0) * 12., 0.5);
        // gl_FragColor.a *= max(0.0,distSquared2) * 1.;
        // gl_FragColor.a *= max(0.,1.0-pow(distance(vec3(0.0,0.0,-1.5), vec3(posUnit.x, posUnit.y, posUnit.z)),5.) * 0.05);
        // gl_FragColor.a *= max(0.0,distSquared2) * 1.;
        // gl_FragColor.a *= max(0., 1.0-pow(length(posUnit2.xz), 2.)*10.);
        // gl_FragColor.a *= 1.0-length(uv)*2.;
        // gl_FragColor.a *= max(0., tri);
        // gl_FragColor.a *= max(0., smoothstep(0.5, 0.51, tri));
        // osc = smoothstep(0.5, 0.51, osc);
        gl_FragColor.a *= osc;
        float hl = pow(distSquared, 15.)*0.25;
        // distSquared *= 1.-length(uv)*0.25;
        distSquared *= osc;
                gl_FragColor = vec4(vec3(1.,hl,hl)*distSquared, contour);
        float backHalo = 1.0 - dot(pos - 0.5, pos - 0.5) * 6.;
        backHalo = pow(backHalo, 3.)*1.;
        // gl_FragColor.r += max(0., 1.0-backHalo)*tri*osc*0.5;
        // gl_FragColor.gb += pow(osc,15.)*0.5;
        gl_FragColor.rgb = gl_FragColor.gbr;
        // gl_FragColor.rgb *= max(0., 1.0-pow(length(posUnit2.xz), 2.)*10.);
        // gl_FragColor.a *= max(0.,1.0-pow(abs(gl_FragCoord.x)/1280.-0.5,3.)*160.);
    }
    // endGLSL
`;
pearl.vertText = pearl.vertText.replace(/[^\x00-\x7F]/g, "");
pearl.fragText = pearl.fragText.replace(/[^\x00-\x7F]/g, "");
pearl.init();



let pearlGlow = new ShaderProgram("pearl-glow");

// A version of smoothDots3D that adjusts the dot size according to its Z value
pearlGlow.vertText = `
    // beginGLSL
    attribute vec3 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
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
        vec4 pos = vec4(coordinates * 1.05, 1.);
        // pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        // pos.xyz *= map(sin(time *1e-1+pos.y*2.), -1., 1., 0.95, 1.0);
        // pos.xyz *= 1.25;
        // pos.xyz *= map(sin(pos.y*5.-time*0.5e-1)*0.5+0.5, 0., 1., 1.0, 0.95);
        // pos = yRotate(-time*0.25e-2) * pos;
        // pos = xRotate(time*0.25e-2) * pos;
        // pos = xRotate(-time*0.5e-2) * pos;
        // pos = translate(0.0, 0.0, 1.5) * pos;
        // pos = rotate()
        // pos = translate(0.0, 0.9, 1.5) * pos;
        
        posUnit = pos.xyz;
        // pos.x *= ratio;
        gl_Position = vec4(pos.x * ratio, pos.y*-1., 0.0, pos.z);
        gl_PointSize = 125.;
        t = time;
        
        pos = translate(0.0, 0.0, -0.5) * pos;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
        posUnit2 = pos.xyz;
        if (length(posUnit2.xz) > 0.4) {
            // gl_PointSize = 0.0;
        }
        if ((posUnit.z) > 0.72) {
            // gl_PointSize = 0.0;
        }
    }
    // endGLSL
`;
pearlGlow.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    ${mapFunction}
float sdTriangle(in vec2 p, in vec2 p0, in vec2 p1, in vec2 p2) {
    vec2 e0 = p1 - p0, e1 = p2 - p1, e2 = p0 - p2;
    vec2 v0 = p  - p0, v1 = p  - p1, v2 = p  - p2;
    vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                     vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                     vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}
    void main(void) {
        // vec2 es
        vec2 uv = posUnit.xy/posUnit.z;
    // float ratio = resolution.x / resolution.y;
    // uv -= 0.5;
        uv *= 1.5 * vec2(1., 1.);
    // uv.x *= ratio;
    // uv = rotateUV(uv, pi*0.5, 0.0);
        vec2 v1 = vec2(-0.4, 0.4);
        vec2 v2 = vec2(0.4, 0.4);
        vec2 v3 = vec2(0.0, -0.4);
        float tri = 1.0 - sdTriangle(uv, v1, v2, v3);
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.;
        distSquared = smoothstep(0., 1., distSquared);
        // float l = 1.0 - length(pos - vec2(0.5)) * 4.;
        // // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // // l += distSquared * 0.25;
        // distSquared -= 1.2;
        // l += (distSquared - (l * distSquared));
        // float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*0.25;
        // // halo = smoothstep(0., 1., halo);
        // l = smoothstep(0., 1., l);
        // l = pow(l, 3.);
        // float noise = rand(pos - vec2(cos(t), sin(t))) * 0.02;
        // gl_FragColor = vec4(vec3(1.0, 0.25, 0.25), (l+halo-noise)*0.5*3.);
        // // gl_FragColor.rgb = gl_FragColor.bgr;
        // vec3 light = posUnit - vec3(0.0, 0., 0.);
        // float distSquared2 = 1.0 - dot(light, light) * 1.5;
        // gl_FragColor.rgb *= 1.0 - posUnit.z;
        // distSquared2 = mix(distSquared, pow(max(0.0, distSquared2), 4.0) * 12., 0.5);
        // gl_FragColor.a *= max(0.0,distSquared2) * 1.;
        // gl_FragColor.a *= max(0.,1.0-pow(distance(vec3(0.0,0.0,-1.5), vec3(posUnit.x, posUnit.y, posUnit.z)),5.) * 0.05);
        // gl_FragColor.a *= max(0.0,distSquared2) * 1.;
        // gl_FragColor.a *= max(0., 1.0-pow(length(posUnit2.xz), 2.)*10.);
        // gl_FragColor.a *= 1.0-length(uv)*2.;
        // gl_FragColor.a *= max(0., tri);
        // gl_FragColor.a *= max(0., smoothstep(0.5, 0.51, tri));
        float osc = map(sin((uv.x-uv.y)*1.-t*5e-2),-1.,1.,0.25,1.);
        // osc = smoothstep(0.5, 0.51, osc);
        gl_FragColor.a *= osc;
        float hl = pow(distSquared, 15.)*0.25;
        distSquared *= 1.-length(uv)*0.5;
        distSquared *= osc;
                gl_FragColor = vec4(vec3(1.,hl,hl), distSquared*0.0625);
        // gl_FragColor.gb += pow(osc,15.)*0.5;
        // gl_FragColor.rgb *= max(0., 1.0-pow(length(posUnit2.xz), 2.)*10.);
        // gl_FragColor.a *= max(0.,1.0-pow(abs(gl_FragCoord.x)/1280.-0.5,3.)*160.);
    }
    // endGLSL
`;
pearlGlow.vertText = pearlGlow.vertText.replace(/[^\x00-\x7F]/g, "");
pearlGlow.fragText = pearlGlow.fragText.replace(/[^\x00-\x7F]/g, "");
pearlGlow.init();
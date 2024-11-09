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
        
        // pos = xRotate(pi * -1.9) * pos;
        pos.y *= -1.;
                pos.z = 1. - pos.z;
        posUnit = pos.xyz;
        // pos = xRotate(pi * -0.1) * pos;
        // pos = translate(0.0, 0.2, 0.2) * pos;
        pos = zRotate(sin(-time*0.5e-2)*0.3) * pos;
        pos = xRotate(pi * -0.2) * pos;
        pos = translate(cos(time*0.5e-2)*0.3, 1.6+sin(time*0.5e-2)*0.3, 3.5) * pos;
        pos.xy *= 3.;
        pos.y -= 1.5;
        // pos.xy *= 0.75;
        gl_Position = vec4(pos.x * ratio, pos.y, 0.0, pos.z);
        gl_PointSize = 119./pos.z;
        t = time*0.5;
        
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
    ${blendingMath}
    void main(void) {
        vec2 uv = posUnit.xy / posUnit.z;
        uv *= 1.5 * vec2(1., 1.);
        float x = (uv.x*0.8 + uv.y) * 0.75 - t * 5e-2;
        // x = (1.0-length(uv)) - t * 5e-2;
        float osc = map(sin(x),-1.,1.,0.25,1.);
        osc = pow(osc, 7.);
        float osc2 = (mod(x+(pi*0.5), pi*2.) / (pi*2.))*2.-1.;
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
        // gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, 0.125).rgb;
        // gl_FragColor.r += max(0., 1.0-backHalo)*tri*osc*0.5;
        // gl_FragColor.gb += pow(osc,15.)*0.5;
        gl_FragColor.rgb = gl_FragColor.gbr;
        // gl_FragColor = vec4(contour);
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
    ${pi}
    attribute vec3 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    varying vec3 posUnit;
    varying float osc;
    ${mapFunction}
    ${matrixTransforms}
    void main(void) {
        float ratio = resolution.y / resolution.x;
        vec4 pos = vec4(coordinates * 1.0, 1.);
        pos.y *= -1.;
        pos.z = 1. - pos.z;
        pos.xy *= 2.;
        posUnit = pos.xyz;
        // pos = xRotate(pi * -0.1) * pos;
        // pos = translate(0.0, 0.2, 0.2) * pos;
        pos = zRotate(sin(-time*0.5e-2)*0.3) * pos;
        pos = xRotate(pi * -0.2) * pos;
        pos = translate(cos(time*0.5e-2)*0.3, 1.6+sin(time*0.5e-2)*0.3, 3.5) * pos;
        pos.xy *= 3.;
        pos.y -= 1.5;
        gl_Position = vec4(pos.x * ratio, pos.y, 0.0, pos.z);
        gl_PointSize = 17. / pos.z;
        t = time * 0.5;
        vec2 uv = posUnit.xy / posUnit.z * 1.5;
        float x = (uv.x * 0.8 + uv.y) * 0.75 - t * 5e-2;
        osc = map(sin(x), -1., 1., 0.25, 1.);
        osc = pow(osc, 15.);
        if (osc < 0.2) {
            gl_PointSize = 0.;
        }
    }
    // endGLSL
`;
pearlGlow.fragText = `
    // beginGLSL
    precision mediump float;
    varying float t;
    varying vec3 posUnit;
    varying float osc;
    ${rand}${mapFunction}${blendingMath}
    void main(void) {
        vec2 pos = gl_PointCoord - 0.5;
        float distSquared = 1.0 - dot(pos, pos) * 4.;
        distSquared = smoothstep(0., 1., distSquared);
        float hl = pow(distSquared, 15.) * 0.25;
        distSquared *= osc;
        gl_FragColor = vec4(vec3(1.,hl,hl), distSquared * 0.25);
        gl_FragColor.a = max(gl_FragColor.a, distSquared * osc * 0.35);
        gl_FragColor.rgb = gl_FragColor.gbr;
        float shimmer = distSquared * pow(osc, 6.) * 1.5 * cos(posUnit.x * 1e2 * tan(posUnit.y * 1e1 + posUnit.x));
        shimmer *= 0.1;
        gl_FragColor.rg += shimmer;
        gl_FragColor.a += shimmer;
        // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 1.5);
        // gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, 4.0-osc*4.).rgb;
        // gl_FragColor = vec4(1.0);
    }
    // endGLSL
`;
pearlGlow.vertText = pearlGlow.vertText.replace(/[^\x00-\x7F]/g, "");
pearlGlow.fragText = pearlGlow.fragText.replace(/[^\x00-\x7F]/g, "");
pearlGlow.init();
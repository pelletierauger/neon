
let smoothWalker3D = new ShaderProgram("smooth-walker-3D");

// A version of smoothDots3D that adjusts the dot size according to its Z value
smoothWalker3D.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
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
        vec4 pos = vec4(coordinates.xyz, 1.);
        // pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        // pos.xyz *= map(sin(time *1e-1+pos.y*2.), -1., 1., 0.95, 1.0);
        // pos.xyz *= 1.25;
        pos.xyz *= map(sin(pos.y*5.-time*0.5e-1)*0.5+0.5, 0., 1., 1.0, 0.95);
        posUnit = pos.xyz;
        pos = yRotate(-time*0.25e-2) * pos;
        pos = xRotate(time*0.25e-2) * pos;
        // pos = xRotate(-time*0.5e-2) * pos;
        pos = translate(0.0, 0.0, 1.5) * pos;
        // pos = rotate()
        // pos = translate(0.0, 0.9, 1.5) * pos;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = coordinates.w/pos.z*5.;
        t = time;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
        posUnit2 = pos.xyz;
    }
    // endGLSL
`;
smoothWalker3D.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        if (posUnit2.z > 2.5) {
            discard;
        }
        float shimmer = sin(posUnit.y*5.-t*0.5e-1)*0.5+0.5;
        shimmer = smoothstep(0., 1., shimmer);
        shimmer = smoothstep(0., 1., shimmer);
        vec2 fc = gl_FragCoord.xy;
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 17.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 3.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        // distSquared -= 1.;
        l += (distSquared - (l * distSquared));
        l = distSquared;
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*4.;
        halo = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.9;
        halo = smoothstep(0., 1., halo);
        // l = smoothstep(0., 1., l);
        l *= map(shimmer,0.,1., 0., 1.5);
        // l = pow(l, 1.);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.25, 0.25), (l+halo-noise)*1.);
        // gl_FragColor.rgb = vec3(0.0);
        // gl_FragColor.a *= 1.0-posUnit2.z*0.4;
        // gl_FragColor.rgb *= shimmer;
    }
    // endGLSL
`;
smoothWalker3D.vertText = smoothWalker3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothWalker3D.fragText = smoothWalker3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothWalker3D.init();


if (false) {

// A version of smoothDots3D that adjusts the dot size according to its Z value
smoothWalker3D.vertText = `
    // beginGLSL
    #define pi 3.1415926535897932384626433832795
    attribute vec4 coordinates;
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
        vec4 pos = vec4(coordinates.xyz, 1.);
        // pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        // pos.xyz *= map(sin(time *1e-1+pos.y*2.), -1., 1., 0.95, 1.0);
        // pos.xyz *= 1.25;
        // pos.xyz *= map(sin(pos.y*5.-time*0.5e-1)*0.5+0.5, 0., 1., 1.0, 0.95);
        posUnit = pos.xyz;
        // pos = yRotate(-time*0.25e-2) * pos;
        // pos = xRotate(time*0.25e-2) * pos;
        // pos = xRotate(-time*0.5e-2) * pos;
        // pos = translate(0.0, 0.0, 1.5) * pos;
        // pos = rotate()
        // pos = translate(0.0, 0.9, 0.) * pos;
        
        // pos = yRotate(pi*0.25) * pos;        
        // pos = xRotate(pi*0.25) * pos;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = coordinates.w/pos.z*5.;
        gl_PointSize = 20.;
        t = time;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
        posUnit2 = pos.xyz;
    }
    // endGLSL
`;
smoothWalker3D.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        if (posUnit2.z > 2.5) {
            // discard;
        }
        float shimmer = sin(posUnit.y*5.-t*0.5e-1)*0.5+0.5;
        shimmer = smoothstep(0., 1., shimmer);
        shimmer = smoothstep(0., 1., shimmer);
        vec2 fc = gl_FragCoord.xy;
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * 17.5;
        float l = 1.0 - length(pos - vec2(0.5)) * 3.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        // distSquared -= 1.;
        l += (distSquared - (l * distSquared));
        l = distSquared;
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*4.;
        halo = 1.0 - dot(pos - 0.5, pos - 0.5) * 4.9;
        halo = smoothstep(0., 1., halo);
        // l = smoothstep(0., 1., l);
        l *= map(shimmer,0.,1., 0., 1.5);
        // l = pow(l, 1.);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.25, 0.25), (l+halo-noise)*1.);
        // gl_FragColor.rgb = vec3(0.0);
        // gl_FragColor.a *= 1.0-posUnit2.z*0.4;
        // gl_FragColor.rgb *= shimmer;
    }
    // endGLSL
`;
smoothWalker3D.vertText = smoothWalker3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothWalker3D.fragText = smoothWalker3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothWalker3D.init();

}



// A version of smoothDots3D that adjusts the dot size according to its Z value
smoothWalker3D.vertText = `
    // beginGLSL
    attribute vec4 coordinates;
    uniform float time;
    uniform vec2 resolution;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
    varying float alpha;
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
        vec4 pos = vec4(coordinates.xyz, 1.);
        alpha = coordinates.z;
        // pos = translate(0.0, 0., 0.5) * yRotate(time*2e-2) * xRotate(time*2e-2) * translate(0.0, 0., -0.5) * pos;
        // pos.xyz *= map(sin(time *1e-1+pos.y*2.), -1., 1., 0.95, 1.0);
        // pos.xyz *= 1.25;
        pos.xyz *= map(sin(pos.y*5.-time*0.5e-1)*0.5+0.5, 0., 1., 1.0, 0.95);
        posUnit = pos.xyz;
        pos = yRotate(-time*0.25e-2) * pos;
        pos = xRotate(time*0.25e-2) * pos;
        // pos = xRotate(-time*0.5e-2) * pos;
        pos = translate(0.0, 0.0, 1.5) * pos;
        // pos = rotate()
        // pos = translate(0.0, 0.9, 1.5) * pos;
        pos.x *= ratio;
        gl_Position = vec4(pos.x, pos.y, 0.0, pos.z);
        gl_PointSize = coordinates.w/pos.z*5.;
        t = time;
        // gl_PointSize += (sin((length(coordinates*20.)*0.2-time*2e-1))*0.5+0.5)*14.;
        posUnit2 = pos.xyz;
    }
    // endGLSL
`;
smoothWalker3D.fragText = `
    // beginGLSL
    precision mediump float;
    // uniform float time;
    varying float t;
    varying vec3 posUnit;
    varying vec3 posUnit2;
    varying float alpha;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        if (posUnit2.z > 2.5 || posUnit2.z < 0.1) {
            discard;
        }
        float shimmer = sin(posUnit.y*5.-t*0.5e-1)*0.5+0.5;
        shimmer = smoothstep(0., 1., shimmer);
        shimmer = smoothstep(0., 1., shimmer);
        vec2 fc = gl_FragCoord.xy;
        vec2 pos = gl_PointCoord;
        float distSquared = 1.0 - dot(pos - 0.5, pos - 0.5) * (30.-posUnit2.z*10.);
        float l = 1.0 - length(pos - vec2(0.5)) * 3.;
        // l += (1.0 - length(pos - vec2(0.5)) * 2.) * 0.125;
        // l += distSquared * 0.25;
        // distSquared -= 1.;
        // l += (distSquared - (l * distSquared));
        l = distSquared;
        float halo = (1.0 - length(pos - vec2(0.5)) * 2.)*1.2;
        // halo = 1.0 - dot((pos - 0.5) * 2.5, (pos - 0.5) * 2.5);
        halo = smoothstep(0., 1., halo);
        // l = smoothstep(0., 1., l);
        l *= map(shimmer,0.,1., 1.5, 1.5);
        // l = pow(l, 1.);
        float noise = rand(pos - vec2(cos(t), sin(t))) * 0.0625;
        l = max(l, halo);
        // l = halo;
        gl_FragColor = vec4(vec3(1.0, pow(l, 2.)*0.25, pow(l, 2.)*0.25), (l-noise)*1.);
        // gl_FragColor.rgb = vec3(0.0);
        // gl_FragColor.a *= 1.0-posUnit2.z*0.4;
        // gl_FragColor.a *= alpha * 2.;
        // gl_FragColor.rgb *= shimmer;
    }
    // endGLSL
`;
smoothWalker3D.vertText = smoothWalker3D.vertText.replace(/[^\x00-\x7F]/g, "");
smoothWalker3D.fragText = smoothWalker3D.fragText.replace(/[^\x00-\x7F]/g, "");
smoothWalker3D.init();

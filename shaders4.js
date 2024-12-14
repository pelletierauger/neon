let textureShader = new ShaderProgram("textu");

// With a centered glow
textureShader.vertText = `
// beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  vec4 position = vec4(a_position, 1.0);
  position.xy = position.xy * 2.0 - 1.0;
  gl_Position = position;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
uniform float time;
uniform float alpha;
uniform float resolution;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}
float luma(vec4 color) {
  return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}
${blendingMath}
${rand}
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(1280., 720.);
    uv -= vec2(0.5, -0.5);
    uv.x *= 16./9.;
    // uv = rotateUV(uv, time * -1e-2, 0.5);
    // uv *= 0.5;
    gl_FragColor = texture2D(u_texture, v_texcoord);
    // gl_FragColor.rgb *= 0.5;
    float g = max(0., 1.0-length(uv*0.5));
    // g = 1./(length(uv*4.)+0.5)*0.9;
    // g = g * 0.5 + pow(g, 1.5);
    g = smoothstep(0., 1., g);
    // g = smoothstep(0., 1., g);
    // g = smoothstep(0., 1., g);
    g -= rand(uv+time*1e-2)*0.025;
    vec3 glow = vec3(g, pow(g, 3.)*0.125*1.5, pow(g, 3.)*0.25*1.5).gbr;
    gl_FragColor.rgb = BlendScreen(gl_FragColor.rgb, glow);
    // gl_FragColor.rgb = glow;
    float l = luma(gl_FragColor.rgb);
    // l = pow(l*2., 15.);
    // l = smoothstep(0., 1., l*1.5);
    // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 2.5);
    // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, l*0.25);;
    gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, 1.-l*2.);
    gl_FragColor.rgb += l * 0.95;
    vec3 col = gl_FragColor.rgb;
    col = 1.0 - exp( -col );
    // col = Desaturate(col, 1.-l*3.).rgb;
    // col = mix(col, vec3(0.,0.,g), 0.125);
    col = smoothstep(0., 1., col);
    gl_FragColor.rgb = col * 1.;
    // gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, -2.5);
    gl_FragColor.rgb = hueShift2(gl_FragColor.rgb, -0.5);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, BlendColorBurn(gl_FragColor.rgb, vec3(0.,1.,1.)), 0.5);
    // gl_FragColor.rgb=vec3(l);
    gl_FragColor.a *= alpha;
    // gl_FragColor.rgb = vec3(uv.x, uv.y, 0.0);
}
// endGLSL
`;
textureShader.init();

if (false) {

textureShader.vertText = `
// beginGLSL
attribute vec3 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
  vec4 position = vec4(a_position, 1.0);
  position.xy = position.xy * 2.0 - 1.0;
  gl_Position = position;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
// endGLSL
`;
textureShader.fragText = `
// beginGLSL
precision mediump float;
uniform float time;
uniform float alpha;
uniform float resolution;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
    gl_FragColor.a *= alpha;
}
// endGLSL
`;
textureShader.init();

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
    varying vec3 posUnit;
    varying float discarded;
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
        posUnit = pos0.xyz;
        pos0 = translate(0.0, 0., 1.5) * xRotate(pi*0.0625) * translate(0.0, 0., -1.5) * pos0;
        pos1 = translate(0.0, 0., 1.5) * xRotate(pi*0.0625) * translate(0.0, 0., -1.5) * pos1;
        // pos0 = translate(0.0, 0., 1.5) * xRotate(pi*0.1) * translate(0.0, 0., -1.5) * pos0;
        // pos1 = translate(0.0, 0., 1.5) * xRotate(pi*0.1) * translate(0.0, 0., -1.5) * pos1;
        // pos0 = translate(0.0, 0.2, 0.0) * pos0;
        // pos1 = translate(0.0, 0.2, 0.0) * pos1;
        // pos0 = zRotate(sin(time*1e-2)*0.5) * pos0;
        // pos1 = zRotate(sin(time*1e-2)*0.5) * pos1;
        // pos1 = translate(0.0, map(sin(time*1e-1),-1.,1.,0.,-0.05), 0.0) * pos1;
        pos0.xy = pos0.xy / pos0.z;
        pos1.xy = pos1.xy / pos1.z;
        float a = atan(pos1.y - pos0.y, pos1.x - pos0.x);
        float pi75 = pi * 0.75;
        float pi25 = pi * 0.25;
        float w = min(1.0, width / pos1.z / 3.);
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
        gl_Position = vec4(pos.x, pos.y + 0., 0.0, 1.);
        wh = vec2(w * sin(pi75), length(pos1.xy - pos0.xy));
        c = color;
        uvs = uv;
        t = time;
        if (pos0.z < 0.0 || pos1.z < 0.0) {
            discarded = 1.0; 
        } else {
            discarded = 0.0;
        }
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
    varying vec3 posUnit;
    varying float discarded;
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
    }
    float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    void main(void) {
        if (discarded == 1.0) {
            discard;
        }
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
        // col = col + (1./(col-0.6));
        col = pow(col, 3.) * 0.75 + pow(col, 43.);
        col = smoothstep(0., 1., col);
        // col = smoothstep(0., 1., col);
        // col = smoothstep(0., 1., col);
        // col = mix(pow(col, 10.)*0.25, col, sin(time*0.1+pos.y*0.5e1)*0.5+0.5);
                // c2l =x(pow(col, 10.)*0.2, col, sin(t*0.1+pos.y*0.5e1)*0.5+0.5);
                // col = mix(pow(col, 10.)*0.2, col, sin(-t*0.1+length(pos * vec2(16./9.,1.))*0.5e1)*0.5+0.5);
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) * 0.2;
        gl_FragColor.b = pow(col, 2.) * 0.2;
        gl_FragColor.b += 0.1;
        // gl_FragColor.rgb *= 1.0-length(posUnit+vec2(0.0, 0.75)) * 1.;
        vec3 light = posUnit - vec3(0.0, 0.1, 0.);
        float distSquared = 0.9 - dot(light, light) * 1.5;
        // gl_FragColor.rgb *= 1.0 - posUnit.z;
        distSquared = mix(distSquared, pow(max(0.0, distSquared), 4.0) * 3., 0.5);
        gl_FragColor.rgb *= distSquared;
        // gl_FragColor.a *= smoothstep(0.2, 0.3, posUnit.z);
        // gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
        gl_FragColor.rgb = gl_FragColor.gbr;
        // gl_FragColor.rgb = Desaturate(gl_FragColor.rgb, (1.0-luma(gl_FragColor.rgb*gl_FragColor.a))*0.25).rgb;
        // gl_FragColor.a = pow(gl_FragColor.a, 0.5);
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
let smoothLine = new ShaderProgram("smooth-line");

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
    void main(void) {
        float ratio = (resolution.y / resolution.x);
        vec2 pos = vec2(0., 0.);
        vec2 pos0 = coordinates.xy;
        vec2 pos1 = coordinates.zw;
        pos0 += vec2(cos(pos0.x*4.+time*0.1), sin(pos1.x*4.+time*0.1))*0.01;
        pos1 += vec2(cos(pos0.x*4.+time*0.1), sin(pos1.x*4.+time*0.1))*0.01;
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
        gl_FragColor = vec4(c.rgb, c.a * (max(col, 0.) - (rando * 0.05)));
        gl_FragColor.g = pow(col, 2.) *  0.2;
        gl_FragColor.b = pow(col, 2.) *  0.2;
        gl_FragColor.a = min(1., gl_FragColor.a + pow(col, 2.) *  0.25);
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
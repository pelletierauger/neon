let holyHills = new ShaderProgram("holy-hills");

holyHills.vertText = `
    // beginGLSL
    attribute vec2 position;
    void main() {
        vec2 pos = position;
        pos.xy = pos.xy * 2.0 - 1.0;
        gl_Position = vec4(pos, 0.0, 1.0);
    }
    // endGLSL
`;
holyHills.fragText = `
    // beginGLSL
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    const float TURBULENCE = 0.009;
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
    const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
    float fbm(vec2 p) {
        float amp = 0.5;
        float h = 0.0;
        for (int i = 0; i < 8; i++) {
            float n = noise(p);
            h += amp * n;
            amp *= 0.5;
            p = m2 * p;
        }
        return  0.5 + 0.5 * h;
    }
    vec3 cloudEffect(vec2 uv) {
        vec3 col = vec3(0.0, 0.0, 0.0);
        // time scale
        float v = 0.0002;
        vec3 smoke = vec3(1.0);
        vec2 scale = uv * 0.5;
        vec2 turbulence = TURBULENCE * vec2(noise(uv));
        scale += turbulence;
        float n1 = fbm(scale);
        col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
        col = clamp(col, vec3(0.0), vec3(1.0));
        return col;
    }
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
        // uv -= 0.5;
        uv *= 0.5;
        uv.y += 0.51;
        vec2 muv = uv;
        // uv.x += time * 1e-3;
        // muv.x += time * 3e-3;
        uv.x += 38687. * 1e-3;
        muv.x += 38687. * 3e-3;
        float rando = rand(uv+time*1e-2) * 0.05;
        float h = sin(uv.x * 10. + 0.1)*0.5+0.5;
        float h2 = sin(uv.x * 8. - 2.5)*0.5+0.5;
        float h3 = sin(uv.x * 8. - 0.3)*0.5+0.5;
        h = noise(vec2(uv.x * 3., 1.0));
        h2 = noise(vec2(uv.x * 3. + 10., 1.0));
        h3 = noise(vec2(uv.x * 3. + 20., 1.0));
        float zz = abs(fract(uv.x*250.+0.5)-0.5)*1.;
        float treeRand = rand(vec2(floor(uv.x*250.+0.), 1.));
        zz = zz * 0.0075 * treeRand;
        float zzo = abs(fract(uv.x*250.+0.5)-0.5)*1.;
        float treeRand2 = rand(vec2(floor(uv.x*250.+0.), 10.));
        float zz2 = zzo * 0.0075 * treeRand2;
        float treeRand3 = rand(vec2(floor(uv.x*250.+0.), 20.));
        float zz3 = zzo * 0.0075 * treeRand3;
        h = smoothstep(0.5, 0.4, uv.y - 0.05 + h * 0.1 - zz);
        h = smoothstep(0.985, 1., h);
        vec3 col = vec3(116., 75., 101.) / 256.;
        vec3 colB = vec3(104., 81., 104.) / 256.;
        vec3 colC = vec3(205., 135., 130.) / 256.;
        col = mix(col, colB, uv.y * 2. - 0.2);
        // col = mix(col, colC, sin(uv.x*5.)*0.5+0.5);
        col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 0.4, 1.));
        float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
        // col *= interlace;
        float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
        // bright = 1.0;
        vec3 col2 = vec3(65., 63., 92.) / 256.;
        
        vec3 col2B = vec3(65., 63., 92.) / 256. * 2.5;
        col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
        vec3 col3 = vec3(29., 43., 76.) / 256.;
        vec3 col3B = vec3(29., 43., 76.) / 256. * 2.5;
        col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
        
        col = mix(col, col2, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz2);
        h = smoothstep(0.985, 1., h);
        col = mix(col, col3, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.1 + h3 * 0.1 - zz3);
        h = smoothstep(0.985, 1., h);
        col = mix(col, vec3(0.0), h);
        // col -= (noise(uv)*0.5+0.5) * 0.25;
        col = vec3(pow(col.r, 2.),pow(col.g, 2.),pow(col.b, 2.));
        col -= cloudEffect(uv * 2. * vec2(0.25, 1.)) * 0.5;
        // col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
        // col -= cloudEffect(muv * 2. * vec2(0.25, 1.)) * 0.5;
        col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.25)) * 0.5;
        // h = (uv.x+uv.y)*0.5;
        // col *= 4.;
        float darkSky = min((-uv.y*2.)+2.5, 1.);
        darkSky *= min((-uv.y*1.)+1.5, 1.);
        darkSky *= min((-uv.y*2.)+2.5, 1.);
        // darkSky = smoothstep(0., 1., darkSky);
        col *= darkSky;
        col *= 2.;
        gl_FragColor = vec4(col - rando, 1.0);
    }
    // endGLSL
`;
holyHills.vertText = holyHills.vertText.replace(/[^\x00-\x7F]/g, "");
holyHills.fragText = holyHills.fragText.replace(/[^\x00-\x7F]/g, "");
holyHills.init();

holyHills.vertText = `
    // beginGLSL
    attribute vec2 position;
    void main() {
        vec2 pos = position;
        pos.xy = pos.xy * 2.0 - 1.0;
        gl_Position = vec4(pos, 0.0, 1.0);
    }
    // endGLSL
`;
holyHills.fragText = `
    // beginGLSL
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    const float TURBULENCE = 0.009;
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
    const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
    float fbm(vec2 p) {
        float amp = 0.5;
        float h = 0.0;
        for (int i = 0; i < 8; i++) {
            float n = noise(p);
            h += amp * n;
            amp *= 0.5;
            p = m2 * p;
        }
        return  0.5 + 0.5 * h;
    }
    vec3 cloudEffect(vec2 uv) {
        vec3 col = vec3(0.0, 0.0, 0.0);
        // time scale
        float v = 0.0002;
        vec3 smoke = vec3(1.0);
        vec2 scale = uv * 0.5;
        vec2 turbulence = TURBULENCE * vec2(noise(uv));
        scale += turbulence;
        float n1 = fbm(scale);
        col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
        col = clamp(col, vec3(0.0), vec3(1.0));
        return col;
    }
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
        uv *= 0.5;
        uv.y += 0.51;
        vec2 muv = uv;
        uv.x += 38687. * 1e-3;
        muv.x += 38687. * 3e-3;
        float rando = rand(uv+time*1e-2) * 0.05;
        vec3 col = vec3(116., 75., 101.) / 256.;
        vec3 colB = vec3(104., 81., 104.) / 256.;
        vec3 colC = vec3(205., 135., 130.) / 256.;
        col = mix(col, colB, uv.y * 2. - 0.2);
        // col = mix(col, colC, sin(uv.x*5.)*0.5+0.5);
        col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 0.4, 1.));
        col = vec3(pow(col.r, 2.),pow(col.g, 2.),pow(col.b, 2.));
        col -= cloudEffect(uv * 2. * vec2(0.25, 1.)) * 0.5;
        col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.25)) * 0.5;
        float darkSky = min((-uv.y*2.)+2.5, 1.);
        darkSky *= min((-uv.y*1.)+1.5, 1.);
        darkSky *= min((-uv.y*2.)+2.5, 1.);
        // darkSky = smoothstep(0., 1., darkSky);
        col *= darkSky;
        col *= 2.;
        gl_FragColor = vec4(col - rando, 1.0);
    }
    // endGLSL
`;
holyHills.vertText = holyHills.vertText.replace(/[^\x00-\x7F]/g, "");
holyHills.fragText = holyHills.fragText.replace(/[^\x00-\x7F]/g, "");
holyHills.init();

let holyHillsBlue = new ShaderProgram("holy-hills-blue");

holyHillsBlue.vertText = `
    // beginGLSL
    attribute vec2 position;
    void main() {
        vec2 pos = position;
        pos.xy = pos.xy * 2.0 - 1.0;
        gl_Position = vec4(pos, 0.0, 1.0);
    }
    // endGLSL
`;
holyHillsBlue.fragText = `
    // beginGLSL
    precision mediump float;
    varying vec2 vTexCoord;
    uniform float time;
    uniform vec2 resolution;
    const float TURBULENCE = 0.009;
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
    const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
    float fbm(vec2 p) {
        float amp = 0.5;
        float h = 0.0;
        for (int i = 0; i < 8; i++) {
            float n = noise(p);
            h += amp * n;
            amp *= 0.5;
            p = m2 * p;
        }
        return  0.5 + 0.5 * h;
    }
    vec3 cloudEffect(vec2 uv) {
        vec3 col = vec3(0.0, 0.0, 0.0);
        // time scale
        float v = 0.0002;
        vec3 smoke = vec3(1.0);
        vec2 scale = uv * 0.5;
        vec2 turbulence = TURBULENCE * vec2(noise(uv));
        scale += turbulence;
        float n1 = fbm(scale);
        col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
        col = clamp(col, vec3(0.0), vec3(1.0));
        return col;
    }
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
        // uv -= 0.5;
        vec2 muv = uv;
        vec2 ov = uv;
        uv.x += 38669. * 1e-3 - 0.037;
        muv.x += 38669. * 3e-3 - 0.037;
        float rando = rand(uv+time*1e-2) * 0.05;
        float h = sin(uv.x * 10. + 0.1)*0.5+0.5;
        float h2 = sin(uv.x * 8. - 2.5)*0.5+0.5;
        float h3 = sin(uv.x * 8. - 0.3)*0.5+0.5;
        h = noise(vec2(uv.x * 3., 1.0));
        h2 = noise(vec2(uv.x * 3. + 10., 1.0));
        h3 = noise(vec2(uv.x * 3. + 20., 1.0));
        float zz = abs(fract(uv.x*250.+0.5)-0.5)*1.;
        float treeRand = rand(vec2(floor(uv.x*250.+0.), 1.));
        zz = zz * 0.0075 * treeRand;
        float zzo = abs(fract(uv.x*250.+0.5)-0.5)*1.;
        float treeRand2 = rand(vec2(floor(uv.x*250.+0.), 10.));
        float zz2 = zzo * 0.0075 * treeRand2;
        float treeRand3 = rand(vec2(floor(uv.x*250.+0.), 20.));
        float zz3 = zzo * 0.0075 * treeRand3;
        h = smoothstep(0.5, 0.4, uv.y - 0.05 + h * 0.1 - zz);
        h = smoothstep(0.985, 1., h);
        float topHill = h;
        vec3 col = vec3(116., 75., 101.) / 256.;
        vec3 colB = vec3(104., 81., 104.) / 256.;
        vec3 colC = vec3(205., 135., 130.) / 256.;
        col = mix(col, colB, uv.y * 2. - 0.2);
        // col = mix(col, colC, sin(uv.x*5.)*0.5+0.5);
        col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 1., 1.)) * 0.9;
        col.b += 0.05 * (sin(-time*0.5e-1 - 1.4 +(length((ov-vec2(0.5, 0.))*vec2(1.,1.)))*10.)*0.5+0.5);
        float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
        // col *= interlace;
        float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
        // bright = 1.0;
        vec3 col2 = vec3(65., 63., 92.) / 256.;
        
        vec3 col2B = vec3(65., 63., 92.) / 256. * 2.5;
        col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
        vec3 col3 = vec3(29., 43., 76.) / 256.;
        vec3 col3B = vec3(29., 43., 76.) / 256. * 2.5;
        col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
        col2 *= 1. * (sin(-time*0.5e-1+0.+(length(ov-vec2(0.5, 0.)))*10.)*0.5+0.5);
        // col2 *= map(sin(abs(atan(ov.y - 0., ov.x - 0.5))*150.), -1., 1., 0.975, 1.0);
        col = mix(col, col2, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz2);
        h = smoothstep(0.985, 1., h);
        col3 *= 1.5 * (sin(-time*0.5e-1-0.5+(length(ov-vec2(0.5, 0.)))*10.)*0.5+0.5);
        // col3 *= map(sin(abs(atan(ov.y - 0., ov.x - 0.5))*100.), -1., 1., 0.975, 1.0);
        col = mix(col, col3, h);
        float midHill = h;
        h = smoothstep(0.5, 0.4, uv.y + 0.1 + h3 * 0.1 - zz3);
        h = smoothstep(0.985, 1., h);
        col = mix(col, vec3(0.0), h);
        // col -= (noise(uv)*0.5+0.5) * 0.25;
        col = vec3(pow(col.r, 2.),pow(col.g, 2.),pow(col.b, 2.));
        col -= cloudEffect(uv * 2. * vec2(0.25, 1.)) * 0.5;
        // col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
        // col -= cloudEffect(muv * 2. * vec2(0.25, 1.)) * 0.5;
        col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
        // h = (uv.x+uv.y)*0.5;
        // col *= 4.;
        float darkSky = min((-uv.y*2.)+2.5, 1.);
        darkSky *= min((-uv.y*1.)+1.5, 1.);
        darkSky *= min((-uv.y*2.)+2.5, 1.);
        // darkSky = smoothstep(0., 1., darkSky);
        col *= darkSky;
        col *= 2.;
        gl_FragColor = vec4(col.bgr - rando, 1.0);
        // gl_FragColor.b += gl_FragColor.r * 0.5 * (sin(time)*0.5+0.5);
        // gl_FragColor.r *= 2. * (sin(time*2e-1+uv.x*10.)*0.5+0.5) * topHill;
        if (topHill > 0.0) {
            // gl_FragColor.g = 0.0;
            // gl_FragColor.b = 0.0;
        }
        // gl_FragColor.g *= 1. * (cos(time+uv.x*10.)*0.5+0.5) * topHill;
    }
    // endGLSL
`;
holyHillsBlue.vertText = holyHillsBlue.vertText.replace(/[^\x00-\x7F]/g, "");
holyHillsBlue.fragText = holyHillsBlue.fragText.replace(/[^\x00-\x7F]/g, "");
holyHillsBlue.init();


if (false) {

holyHills.vertText = `
    // beginGLSL
    attribute vec2 position;
    void main() {
        vec2 pos = position;
        pos.xy = pos.xy * 2.0 - 1.0;
        gl_Position = vec4(pos, 0.0, 1.0);
    }
    // endGLSL
`;
holyHills.fragText = `
    // beginGLSL
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    ${blendingMath}
    const float TURBULENCE = 0.009;
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
    const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
    float fbm(vec2 p) {
        float amp = 0.5;
        float h = 0.0;
        for (int i = 0; i < 8; i++) {
            float n = noise(p);
            h += amp * n;
            amp *= 0.5;
            p = m2 * p;
        }
        return  0.5 + 0.5 * h;
    }
    vec3 cloudEffect(vec2 uv) {
        vec3 col = vec3(0.0, 0.0, 0.0);
        // time scale
        float v = 0.0002;
        vec3 smoke = vec3(1.0);
        vec2 scale = uv * 0.5;
        vec2 turbulence = TURBULENCE * vec2(noise(uv));
        scale += turbulence;
        float n1 = fbm(scale);
        col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
        col = clamp(col, vec3(0.0), vec3(1.0));
        return col;
    }
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
        // uv -= 0.5;
        vec2 muv = uv;
        // uv.x += time * 1e-3;
        // muv.x += time * 3e-3;
        uv.x += 64087. * 1e-3;
        muv.x += 66187. * 3e-3;
        float rando = rand(uv+time*1e-2) * 0.05;
        float h = sin(uv.x * 10. + 0.1)*0.5+0.5;
        float h2 = sin(uv.x * 8. - 2.5)*0.5+0.5;
        float h3 = sin(uv.x * 8. - 0.3)*0.5+0.5;
        h = noise(vec2(uv.x * 3., 1.0));
        h2 = noise(vec2(uv.x * 3. + 10., 1.0));
        h3 = noise(vec2(uv.x * 3. + 20., 1.0));
        float zz = abs(fract(uv.x*250.+0.5)-0.5)*1.;
        float treeRand = rand(vec2(floor(uv.x*250.+0.), 1.));
        zz = zz * 0.0075 * treeRand;
        float zzo = abs(fract(uv.x*250.+0.5)-0.5)*1.;
        float treeRand2 = rand(vec2(floor(uv.x*250.+0.), 10.));
        float zz2 = zzo * 0.0075 * treeRand2;
        float treeRand3 = rand(vec2(floor(uv.x*250.+0.), 20.));
        float zz3 = zzo * 0.0075 * treeRand3;
        h = smoothstep(0.5, 0.4, uv.y - 0.05 + h * 0.1 - zz);
        h = smoothstep(0.985, 1., h);
        vec3 col = vec3(116., 75., 101.) / 256.;
        vec3 colB = vec3(104., 81., 104.) / 256.;
        vec3 colC = vec3(205., 135., 130.) / 256.;
        col = mix(col, colB, uv.y * 2. - 0.2);
        // col = mix(col, colC, sin(uv.x*5.)*0.5+0.5);
        col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 0.4, 1.));
        float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
        // col *= interlace;
        float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
        // bright = 1.0;
        vec3 col2 = vec3(65., 63., 92.) / 256.;
        
        vec3 col2B = vec3(65., 63., 92.) / 256. * 2.5;
        col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
        vec3 col3 = vec3(29., 43., 76.) / 256.;
        vec3 col3B = vec3(29., 43., 76.) / 256. * 2.5;
        col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
        
        col = mix(col, col2, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz2);
        h = smoothstep(0.985, 1., h);
        col = mix(col, col3, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.1 + h3 * 0.1 - zz3);
        h = smoothstep(0.985, 1., h);
        col = mix(col, vec3(0.0), h);
        // col -= (noise(uv)*0.5+0.5) * 0.25;
        col = vec3(pow(col.r, 2.),pow(col.g, 2.),pow(col.b, 2.));
        col -= cloudEffect(uv * 2. * vec2(0.25, 1.)) * 0.5;
        // col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
        // col -= cloudEffect(muv * 2. * vec2(0.25, 1.)) * 0.5;
        col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.25)) * 0.5;
        // h = (uv.x+uv.y)*0.5;
        // col *= 4.;
        float darkSky = min((-uv.y*2.)+2.5, 1.);
        darkSky *= min((-uv.y*1.)+1.5, 1.);
        darkSky *= min((-uv.y*2.)+2.5, 1.);
        // darkSky = smoothstep(0., 1., darkSky);
        col *= darkSky;
        col *= 2.;
        gl_FragColor = vec4(col - rando, 1.0);
        // gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 4.6);
    }
    // endGLSL
`;
holyHills.vertText = holyHills.vertText.replace(/[^\x00-\x7F]/g, "");
holyHills.fragText = holyHills.fragText.replace(/[^\x00-\x7F]/g, "");
holyHills.init();

// Blue night with a triangular mask
holyHills.vertText = `
    // beginGLSL
    attribute vec2 position;
    void main() {
        vec2 pos = position;
        pos.xy = pos.xy * 2.0 - 1.0;
        gl_Position = vec4(pos, 0.0, 1.0);
    }
    // endGLSL
`;
holyHills.fragText = `
    // beginGLSL
    precision mediump float;
    uniform float time;
    uniform vec2 resolution;
    ${blendingMath}
    const float TURBULENCE = 0.009;
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
    const mat2 m2 = mat2(1.6,  1.2, -1.2,  1.6);
    float fbm(vec2 p) {
        float amp = 0.5;
        float h = 0.0;
        for (int i = 0; i < 8; i++) {
            float n = noise(p);
            h += amp * n;
            amp *= 0.5;
            p = m2 * p;
        }
        return  0.5 + 0.5 * h;
    }
    vec3 cloudEffect(vec2 uv) {
        vec3 col = vec3(0.0, 0.0, 0.0);
        // time scale
        float v = 0.0002;
        vec3 smoke = vec3(1.0);
        vec2 scale = uv * 0.5;
        vec2 turbulence = TURBULENCE * vec2(noise(uv));
        scale += turbulence;
        float n1 = fbm(scale);
        col = mix(col, smoke, smoothstep(0.35, 0.9, n1));
        col = clamp(col, vec3(0.0), vec3(1.0));
        return col;
    }
    float smoothTriangle(vec2 p, vec2 p0, vec2 p1, vec2 p2, float smoothness) {
        vec3 e0, e1, e2;
        e0.xy = normalize(p1 - p0).yx * vec2(+1.0, -1.0);
        e1.xy = normalize(p2 - p1).yx * vec2(+1.0, -1.0);
        e2.xy = normalize(p0 - p2).yx * vec2(+1.0, -1.0);
        e0.z = dot(e0.xy, p0) - smoothness;
        e1.z = dot(e1.xy, p1) - smoothness;
        e2.z = dot(e2.xy, p2) - smoothness;
        float a = max(0.0, dot(e0.xy, p) - e0.z);
        float b = max(0.0, dot(e1.xy, p) - e1.z);
        float c = max(0.0, dot(e2.xy, p) - e2.z);
        return smoothstep(smoothness * 2.0, 1e-7, length(vec3(a, b, c)));
    }
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution + vec2(0., -0.);
        vec2 ov = uv;
        // ov.y = ov.y * -1. + 1.;
        vec2 p0 = vec2(0.2, 0.05);
        vec2 p1 = vec2(0.5, 0.95);
        vec2 p2 = vec2(0.8, 0.05);
        float vig = smoothTriangle(ov, p0, p2, p1, 0.003);
        vig = smoothstep(0., 1., vig);
        if (vig < 0.1) {
            discard;
        }
        // uv -= 0.5;
        vec2 muv = uv;
        // uv.x += time * 1e-3;
        // muv.x += time * 3e-3;
        uv.x += 38687. * 1e-3;
        uv.y += 0.2;
        muv.x += 66187. * 3e-3;
        float rando = rand(uv+time*1e-2) * 0.05;
        float h = sin(uv.x * 10. + 0.1)*0.5+0.5;
        float h2 = sin(uv.x * 8. - 2.5)*0.5+0.5;
        float h3 = sin(uv.x * 8. - 0.3)*0.5+0.5;
        h = noise(vec2(uv.x * 3., 1.0));
        h2 = noise(vec2(uv.x * 3. + 10., 1.0));
        h3 = noise(vec2(uv.x * 3. + 20., 1.0));
        float zz = abs(fract(uv.x*250.+0.5)-0.5)*1.;
        float treeRand = rand(vec2(floor(uv.x*250.+0.), 1.));
        zz = zz * 0.0075 * treeRand;
        float zzo = abs(fract(uv.x*250.+0.5)-0.5)*1.;
        float treeRand2 = rand(vec2(floor(uv.x*250.+0.), 10.));
        float zz2 = zzo * 0.0075 * treeRand2;
        float treeRand3 = rand(vec2(floor(uv.x*250.+0.), 20.));
        float zz3 = zzo * 0.0075 * treeRand3;
        h = smoothstep(0.5, 0.4, uv.y - 0.05 + h * 0.1 - zz);
        h = smoothstep(0.985, 1., h);
        float topHill = h;
        vec3 col = vec3(116., 75., 101.) / 256.;
        vec3 colB = vec3(104., 81., 104.) / 256.;
        vec3 colC = vec3(205., 135., 130.) / 256.;
        col = mix(col, colB, uv.y * 2. - 0.2);
        // col = mix(col, colC, sin(uv.x*5.)*0.5+0.5);
        col = mix(col, colC, map(sin(uv.x*5.), -1., 1., 0.4, 1.));
        float interlace = 1.0 - (sin(uv.y * 1. + time * 0.25) * 0.5 + 0.5) * 1.;
        // col *= interlace;
        float bright = mix(1., 1.25, sin(uv.x*5.)*0.5+0.5);
        // bright = 1.0;
        vec3 col2 = vec3(65., 63., 92.) / 256.;
        
        vec3 col2B = vec3(65., 63., 92.) / 256. * 2.;
        col2 = mix(col2, col2B, smoothstep(0.5, 0.1, uv.y));
        vec3 col3 = vec3(29., 43., 76.) / 256.;
        vec3 col3B = vec3(29., 43., 76.) / 256. * 2.;
        col3 = mix(col3, col3B, smoothstep(0.6, 0.0, uv.y*1.2));
        
        col = mix(col, col2, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.05 + h2 * 0.1 - zz2);
        h = smoothstep(0.985, 1., h);
        // col = mix(col, col3, h);
        h = smoothstep(0.5, 0.4, uv.y + 0.13 + h3 * 0.1 - zz3);
        h = smoothstep(0.985, 1., h);
        // col = mix(col, vec3(0.0), h);
        // col -= (noise(uv)*0.5+0.5) * 0.25;
        col = vec3(pow(col.r, 2.),pow(col.g, 2.),pow(col.b, 2.));
        col -= cloudEffect(uv * 2. * vec2(0.25, 1.)) * 0.5;
        // col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.35)) * 0.5;
        // col -= cloudEffect(muv * 2. * vec2(0.25, 1.)) * 0.5;
        col -= min(cloudEffect(muv * 2. * vec2(0.25, 1.)), vec3(0.25)) * 0.5;
        // h = (uv.x+uv.y)*0.5;
        // col *= 4.;
        float darkSky = min((-uv.y*2.)+2.5, 1.);
        darkSky *= min((-uv.y*1.)+1.5, 1.);
        darkSky *= min((-uv.y*2.)+2.5, 1.);
        // darkSky = smoothstep(0., 1., darkSky);
        // col *= darkSky;
        col *= 2.;
        gl_FragColor = vec4(col - rando, 1.0);
        gl_FragColor.rgb = hueShift(gl_FragColor.rgb, 4.);
       gl_FragColor.rgb *= vig;
        if (topHill > 0.5) {
            gl_FragColor.rgb = hueShift(gl_FragColor.rgb, -4.);
        }
    }
    // endGLSL
`;
holyHills.vertText = holyHills.vertText.replace(/[^\x00-\x7F]/g, "");
holyHills.fragText = holyHills.fragText.replace(/[^\x00-\x7F]/g, "");
holyHills.init();

}

// Blue night with a triangular mask
holyHills.vertText = `
    // beginGLSL
    attribute vec2 position;
    void main() {
        vec2 pos = position;
        pos.xy = pos.xy * 2.0 - 1.0;
        gl_Position = vec4(pos, 0.0, 1.0);
    }
    // endGLSL
`;
holyHills.fragText = `
// beginGLSL
precision mediump float;
#define pi 3.1415926535897932384626433832795
varying vec2 vTexCoord;
uniform float time;
uniform vec2 resolution;
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(co.x)));
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
float smoothTriangle(vec2 p, vec2 p0, vec2 p1, vec2 p2, float smoothness) {
    vec3 e0, e1, e2;
    e0.xy = normalize(p1 - p0).yx * vec2(+1.0, -1.0);
    e1.xy = normalize(p2 - p1).yx * vec2(+1.0, -1.0);
    e2.xy = normalize(p0 - p2).yx * vec2(+1.0, -1.0);
    e0.z = dot(e0.xy, p0) - smoothness;
    e1.z = dot(e1.xy, p1) - smoothness;
    e2.z = dot(e2.xy, p2) - smoothness;
    float a = max(0.0, dot(e0.xy, p) - e0.z);
    float b = max(0.0, dot(e1.xy, p) - e1.z);
    float c = max(0.0, dot(e2.xy, p) - e2.z);
    return smoothstep(smoothness * 2.0, 1e-7, length(vec3(a, b, c)));
}
vec2 rotateUV(vec2 uv, float rotation, float mid) {
    return vec2(
      cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
      cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy - vec2(0.5);
    float ratio = resolution.x / resolution.y;
    uv.x *= ratio;
    uv *= 0.9;
    uv.y -= 0.02;
    vec2 ov = uv;
    float torsionX = (cos(uv.x * 10. + cos(uv.y * 10.+time*1e-1)) * 0.5+0.5)*0.35;
    float torsionY = (sin(uv.x * 10. + cos(uv.y * 10.+time*1e-1)) * 0.5+0.5)*0.35;
    vec2 p = uv;
    uv -= vec2(0.05, 0.05);
    // uv = uv + time * 2e-3;
    float f = 0.0;
    // // left: value noise  
    vec2 muv = uv * 25.0;
    muv *= vec2(1.0 - torsionX * 0.1, 1.0 - torsionY * 0.1);
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    f  = 0.5000 * noise(muv);
    muv = m * muv;
    f += 0.2500 * noise(muv);
    muv = m * muv;
    f += 0.1250 * noise(muv);
    muv = m * muv;
    f += 0.0625 * noise(muv);
    f = 0.5 + 0.5 * f;
    // f *= smoothstep(0.0, 0.005, abs(p.x - 0.5 / ratio));  
    float flX = sin(time*1e-1)*0.01;
    float flY = cos(time*1e-1)*0.01;
    vec2 v0 = vec2(0.0 + 0.1 + flX, -0.25 + flY);
    vec2 v1 = vec2(0.5 + 0.1 - flX, 0.35 + flY);
    vec2 v2 = vec2(0.1 + 0.1 + flX, 0.25 + flY);
    float a = smoothTriangle(uv, v0, v1, v2, 0.003);
    v0 = vec2(-0.5+flX, -0.35-flY), v1 = vec2(0.5-flX, -0.5+flY), v2 = vec2(0.1+flX, 0.25+flY);
    float b = smoothTriangle(uv, v0, v1, v2, 0.006);
    v0 = vec2(-0.75-flX, 0.35-flY), v1 = vec2(0.25+flX, -0.35+flY), v2 = vec2(-0.05-flX, 0.24-flY);
    float c = smoothTriangle(uv, v0, v1, v2, 0.004);
    v0 = vec2(0.12-flX, -0.35-flY), v1 = vec2(0.6+flX, 0.15+flY), v2 = vec2(0.27-flX, -0.1-flY);
    float d = smoothTriangle(rotateUV(uv, pi * 0.05, 0.0) + vec2(-0.1, -0.0), v0, v1, v2, 0.004);
    float e = smoothTriangle(rotateUV(uv, pi *0.17, 0.0) * vec2(-1.,1.) + vec2(0.11, 0.04), v0, v1, v2, 0.004);
    // b = smoothstep(0., 1., b);
    // b = smoothstep(0., 1., b);
    // b = smoothstep(0., 1., b);
    // a = max(a, b * 0.35);
    a = mix(a, c * 1., c);
    a = mix(a, d * 1., d);
    a = mix(a, e * 1., e);
    a = mix(a, b * 0.45, b*0.75);
    f += pow(f, 3.)*2.;
    // a = max(a, b * 0.35 + a * 0.65);
    // a = max(a, c);
    ov = rotateUV(ov, pi * -0.4, 0.);
    ov.y -= 0.25;
    ov.y *= 0.25;
    float zz = abs(fract(ov.x*5.)-0.5);
    float line = abs(ov.y*10.+zz)*-3.+1.;
    line = smoothstep(0., 1., line);
    // a = max(a, line * 0.5);
    
    a *= 1.0-(f*0.25);
    a *= 1.0 - torsionX;
    // a = (abs(a - 0.5) * -1. + 0.5) * 2.;
    vec3 col = vec3(1.0, 0.0, 0.0);
    // col = vec3(0.0, 0.95, 0.6);
    col *= a;
    float rando = rand(uv + sin(time)) * 0.025;
    gl_FragColor = vec4(col, 1.0 - rando);
}
// endGLSL
`;
holyHills.vertText = holyHills.vertText.replace(/[^\x00-\x7F]/g, "");
holyHills.fragText = holyHills.fragText.replace(/[^\x00-\x7F]/g, "");
holyHills.init();

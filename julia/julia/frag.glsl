precision mediump float;

uniform vec2 c;

varying vec2 vUV;

void main() {

    float error = 100.0;
    vec2 z = vUV;
//    vec2 c = vec2(0.0, 0.7);

    int n;

    for (int i = 0; i < 100; i++) {
        n = i;
        z = vec2(z.x * z.x - z.y * z.y + c.x, 2. * z.x * z.y + c.y);
        if (length(z) > error) {
            break;
        }
    }

    float value = 1. - float(n) / 100.;
    gl_FragColor = vec4(vec3(pow(value, 2.)), 1.);
}

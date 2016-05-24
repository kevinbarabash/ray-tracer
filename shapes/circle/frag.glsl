precision mediump float;

void main() {
    vec2 point = gl_PointCoord;
    vec2 center = vec2(0.5, 0.5);
    float a = 1. - length(point - center) / 0.5;

    gl_FragColor = vec4(0., 0., 1., smoothstep(0.0, 0.1, a));
}

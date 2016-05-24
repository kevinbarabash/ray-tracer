precision mediump float;

varying vec2 uv;
varying float vRadius;

void main() {
    float a = 1.0 - smoothstep(1.0 - 2. / vRadius, 1.0, length(uv) / vRadius);
    gl_FragColor = vec4(0., 0., 1., clamp(0., 1., a));
}

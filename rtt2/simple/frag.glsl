precision highp  float;

uniform vec3 uColor;
uniform float uRadius;

mat3 rgb2xyz = mat3(
    0.4124, 0.3576, 0.1805,
    0.2126, 0.7152, 0.0722,
    0.0193, 0.1192, 0.9505
);

void main() {
    vec2 point = gl_PointCoord;
    vec2 center = vec2(0.5, 0.5);

    point = 2. * (point - center);

    float a = 1. - length(point);
    float pxSize = 1. / uRadius;

    a = smoothstep(0.0, 1.0, a);

    gl_FragColor = vec4(rgb2xyz * uColor, a);
}

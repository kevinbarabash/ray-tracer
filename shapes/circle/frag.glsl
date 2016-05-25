precision mediump float;

varying float vRadius;
varying vec3 vColor;

#define M_PI 3.141592653589793
#define M_TAU 6.283185307179586

void main() {
    vec2 point = gl_PointCoord;
    vec2 center = vec2(0.5, 0.5);

    point = 2. * (point - center);

    float a = 1. - length(point);
    float pxSize = 1. / vRadius;

    float angle = atan(point.x, point.y);
    angle = (angle + M_PI) / M_TAU;

    // circle
//    a = smoothstep(0.0, 1. / vRadius, a);

    // annulus
    float ring_width = 20.;
    a = smoothstep(0.0, pxSize, a) - smoothstep(ring_width * pxSize, ring_width * pxSize + pxSize, a);

    // stripes
    float r = sin(5. * M_TAU * angle) / 2. + .5;
    r = smoothstep(0.5, 0.5 + 2. / length(vRadius * point), r);

    r = 0.;

    gl_FragColor = vec4(vColor, a);
}

precision mediump float;

attribute float radius;
attribute vec2 pos;
attribute vec3 color;

uniform mat4 projMatrix;

varying float vRadius;
varying vec3 vColor;

void main() {
    gl_Position = projMatrix * vec4(pos, 0., 1.);

    // TODO: calculate the real radius based on stroke width
    gl_PointSize = 2. * radius;
    vRadius = radius;
    vColor = color;
}

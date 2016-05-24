precision mediump float;

attribute float radius;
attribute vec2 center;
attribute vec2 corner;

uniform mat4 projMatrix;

varying vec2 uv;
varying float vRadius;

void main() {
    gl_Position = projMatrix * vec4(center + radius * corner, 0., 1.);
    uv = radius * corner;
    vRadius = radius;
}

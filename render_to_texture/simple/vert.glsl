precision highp float;

attribute vec2 pos;
attribute vec3 color;

uniform mat4 projMatrix;

varying vec3 vColor;

void main() {
    gl_Position = projMatrix * vec4(pos, 0., 1.);
    vColor = color;
}

precision highp float;

uniform mat4 projMatrix;

attribute vec2 pos;

varying vec2 vPos;

void main() {
    gl_Position = projMatrix * vec4(pos, 0., 1.);
    vPos = pos;
}

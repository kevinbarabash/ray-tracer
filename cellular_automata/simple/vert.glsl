precision highp float;

attribute vec2 uv;
attribute vec2 pos;

uniform mat4 projMatrix;

varying vec2 vUV;

void main() {
    gl_Position = projMatrix * vec4(pos, 0., 1.);
    vUV = uv;
}

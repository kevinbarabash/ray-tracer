precision mediump float;

uniform mat4 projMatrix;

attribute vec2 uv;
attribute vec2 pos;

varying vec2 vUV;

void main() {
    gl_Position = projMatrix * vec4(pos, 0., 1.);

    vUV = uv;
}

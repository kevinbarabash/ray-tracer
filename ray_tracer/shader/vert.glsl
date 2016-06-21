precision mediump float;

uniform mat4 projMatrix;

attribute vec2 position;

varying vec2 vPosition;

void main() {
    gl_Position = projMatrix * vec4(position, 0., 1.);
    vPosition = position;
}

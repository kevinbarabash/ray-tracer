precision mediump float;

uniform mat4 projMatrix;

attribute vec2 texCoords2;
attribute vec2 position;

varying vec2 vTexCoords;

void main() {
    gl_Position = projMatrix * vec4(position, 0., 1.);

    vTexCoords = texCoords2;
}

attribute vec2 position; //the position of the point
attribute vec3 color;
attribute vec3 bary;

uniform mat4 Pmatrix;
uniform mat4 Mmatrix;

varying vec4 vColor;
varying vec3 vBary;

void main() {
    gl_Position = Pmatrix * Mmatrix * vec4(position, 0., 1.);

    // square each color component before linear interpolating
    vColor = vec4(color * color, 1.0);

    vBary = bary;
}

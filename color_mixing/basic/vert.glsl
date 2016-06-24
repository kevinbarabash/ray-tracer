attribute vec2 position;
attribute vec3 color;

uniform mat4 Pmatrix;
uniform mat4 Mmatrix;

varying vec4 vColor;

void main() {
    gl_Position = Pmatrix * Mmatrix * vec4(position, 0., 1.);

    // square each color component before linear interpolating
    vColor = vec4(color * color, 1.0);
}

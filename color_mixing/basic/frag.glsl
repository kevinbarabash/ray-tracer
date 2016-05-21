precision mediump float;
varying vec4 vColor;
varying vec3 vBary;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

void main() {
    // square root color after linear interpolation
    gl_FragColor = sqrt(vColor);
}

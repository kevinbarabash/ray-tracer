precision mediump float;
varying vec4 vColor;

void main() {
    // square root color after linear interpolation
    gl_FragColor = sqrt(vColor);
}

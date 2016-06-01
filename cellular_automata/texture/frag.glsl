precision mediump float;

uniform sampler2D uSampler;

varying vec2 vUV;

void main() {
    gl_FragColor = texture2D(uSampler, vec2(vUV.s, vUV.t));
}

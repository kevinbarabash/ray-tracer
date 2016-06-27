precision highp float;

uniform sampler2D uSampler;

varying vec2 vPos;

void main() {
    // uv position has to be between 0 and 1
    gl_FragColor = texture2D(uSampler, vec2(vPos.x, vPos.y));
}

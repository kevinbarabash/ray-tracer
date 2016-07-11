precision mediump float;

uniform sampler2D uSampler;

varying vec2 vUV;

mat3 xyz2rgb = mat3(
    3.2406, -1.5372, -0.4986,
    -0.9689, 1.8758, 0.0415,
    0.0557, -0.2040, 1.0570
);

void main() {
    vec4 color = texture2D(uSampler, vec2(vUV.s, vUV.t));
    gl_FragColor = vec4(xyz2rgb * color.rgb, color.a);
}

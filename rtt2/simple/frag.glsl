precision highp  float;

varying vec2 vPos;
varying vec2 vUV;

uniform sampler2D uSampler;
uniform vec2 uMousePos;
uniform vec3 uColor;
uniform float uRadius;

vec3 toLinear(vec3 sRGBColor) {
    return clamp(mix(
        pow((sRGBColor + vec3(0.055)) / 1.055, vec3(2.4)),
        sRGBColor / 12.92,
        step(sRGBColor, vec3(0.04045))
    ), 0., 1.);
}

vec3 toSRGB(vec3 linearColor) {
    return clamp(mix(
        1.055 * pow(linearColor, vec3(1. / 2.4)) - vec3(0.055),
        12.92 * linearColor,
        step(linearColor, vec3(0.0031308))
    ), 0., 1.);
}

void main() {
    float a, d;

    d = distance(uMousePos, vPos);
    a = smoothstep(1., 0., d / uRadius);

    gl_FragColor = vec4(uColor, 0.25 * a);
}

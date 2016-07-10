precision highp  float;

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
    vec2 point = gl_PointCoord;
    vec2 center = vec2(0.5, 0.5);

    point = 2. * (point - center);

    float a = 1. - length(point);
    float pxSize = 1. / uRadius;

    a = smoothstep(0.0, pxSize, a);

    gl_FragColor = vec4(uColor, a);
}

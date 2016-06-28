precision highp  float;

varying vec3 vColor;
varying vec2 vPos;

uniform sampler2D uSampler;

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
    float radius = 70.;

    float a, d;
    vec2 center;

    vec2 uv = vPos / 100.;
    vec3 brushColor = vec3(0., 0., 1.);
    vec4 color4 = texture2D(uSampler, vec2(uv.s, uv.t));
    vec3 color = vec3(color4.r, color4.g, color4.b);

    float x = 50.;
    float y = 50.;

    for (int i = 0; i < 100; i++) {
        center = vec2(x, y);

        d = distance(center, vPos);
        a = smoothstep(1., 0., d / radius);

        vec3 linearBrushColor = toLinear(brushColor);
        vec3 linearColor = toLinear(color);

        color = toSRGB(mix(linearColor, linearBrushColor, a));

        x += 20.;
        y += pow(float(i) / 5., 2.);
    }


    x = 50.;
    y = 450. - 50.;

    brushColor = vec3(0., 1., 0.);

    for (int i = 0; i < 100; i++) {
        center = vec2(x, y);

        d = distance(center, vPos);
        a = smoothstep(1., 0., d / radius);

        vec3 linearBrushColor = toLinear(brushColor);
        vec3 linearColor = toLinear(color);

        color = toSRGB(mix(linearColor, linearBrushColor, a * 0.25));

        x += 20.;
        y -= pow(float(i) / 5., 2.);
    }

    gl_FragColor = vec4(color, 1.);
}

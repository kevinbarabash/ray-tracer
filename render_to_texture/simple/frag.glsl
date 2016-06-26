precision highp  float;

varying vec3 vColor;
varying vec2 vPos;

uniform sampler2D uSampler;

#define E 2.718281828459
#define PI 3.14159

float rand(vec2 co)
{
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt = dot(co.xy ,vec2(a,b));
    float sn = mod(dt,3.14);
    return fract(sin(sn) * c);
}

void main() {
    float radius = 50.;

    float a, d;
    vec2 center;

    vec2 uv = vPos / 100.;
    vec3 brushColor = vec3(0., 0., 1.);
    vec3 color = vec3(1., 1., 1.);

    float x = 50.;
    float y = 50.;

    vec3 exp = vec3(E);

    for (int i = 0; i < 100; i++) {
        center = vec2(x, y);

        d = distance(center, vPos);
        a = smoothstep(0., 1., d / radius);

        color = pow(a * pow(color, exp) + (1. - a) * pow(brushColor, exp), 1. / exp);

        x += 5.;
        y += pow(float(i) / 10., 2.);
    }

    brushColor = vec3(0., 1., 0.);

    x = 50.;
    y = 50.;
    for (int i = 0; i < 100; i++) {
        center = vec2(x, 300. - y);

        d = distance(center, vPos);
        a = smoothstep(0., 1., d / radius);

        color = pow(a * pow(color, exp) + (1. - a) * pow(brushColor, exp), 1. / exp);

        x += 5.;
        y += pow(float(i) / 10., 2.);
    }

    gl_FragColor = vec4(color, 1.);
}

precision highp  float;

varying vec3 vColor;
varying vec2 vPos;

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
    float b = rand(vPos);
    gl_FragColor = vec4(vColor.r, vColor.g, b, 1.);
}

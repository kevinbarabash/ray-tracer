precision highp  float;

uniform sampler2D uSampler;
varying vec2 vUV;

void main() {

    float t = 1. / 10.;
    float df = 1. / 10.;

    if (vUV.t >= t && vUV.t <= t + .1) {
        vec4 left = texture2D(uSampler, vec2(vUV.s - df, vUV.t - df));
        vec4 center = texture2D(uSampler, vec2(vUV.s, vUV.t - df));
        vec4 right = texture2D(uSampler, vec2(vUV.s + df, vUV.t - df));

        if (left.r == 0. && center.r == 1. && right.r == 0.) {
            gl_FragColor = vec4(1., 0., 0., 1.);
        } else if (left.r == 1. && center.r == 0. && right.r == 0.) {
            gl_FragColor = vec4(1., 0., 0., 1.);
        } else if (left.r == 0. && center.r == 0. && right.r == 1.) {
            gl_FragColor = vec4(1., 0., 0., 1.);
        } else {
            gl_FragColor = vec4(0., 0., 0., 1.);
        }
    } else {
        gl_FragColor = texture2D(uSampler, vec2(vUV.s, vUV.t));
    }
}

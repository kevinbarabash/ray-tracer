precision mediump float;

uniform float t;
uniform vec2 mouse;

varying vec2 vTexCoords;

struct Ball {
    float x;
    float y;
    float r;
};

void main() {
    Ball balls[4];
    balls[0] = Ball(100. + 65. * cos(0.04 * t), 100. + 65. * sin(0.03 * t), 50.);
    balls[1] = Ball(250. + 80. * cos(0.02 * t), 250. + 80. * sin(-0.05 * t), 70.);
    balls[2] = Ball(300. + 75. * sin(0.03 * t), 450. + 70. * sin(0.04 * t), 60.);
    balls[3] = Ball(mouse.x, mouse.y, 40.);

    float value = 0.;
    float p = 2.0;

    for (int i = 0; i < 4; i++) {
        Ball ball = balls[i];
        float dx = ball.x - vTexCoords.x;
        float dy = ball.y - vTexCoords.y;
        value += pow(abs(ball.r), p) / (pow(abs(dx), p) + pow(abs(dy), p));
    }

//    value = clamp(0., 1., value);

//    gl_FragColor = vec4(smoothstep(0.95, 1.0, value), 0., clamp(0., 1., sqrt(value) - 1.), 1.0);
    gl_FragColor = vec4(0., 0., smoothstep(0.1, 2., value), 1.0);
}

precision mediump float;

varying vec2 vTexCoords;

struct Ball {
    float x;
    float y;
    float r;
};

void main() {
    Ball balls[4];
    balls[0] = Ball(100., 100., 100.);
    balls[1] = Ball(250., 250., 70.);
    balls[2] = Ball(300., 450., 50.);
    balls[3] = Ball(380., 420., 50.);

    float value = 0.;
    float p = 2.0;

    for (int i = 0; i < 4; i++) {
        Ball ball = balls[i];
        float dx = ball.x - vTexCoords.x;
        float dy = ball.y - vTexCoords.y;
        value += pow(abs(ball.r), p) / (pow(abs(dx), p) + pow(abs(dy), p));
    }

    value = clamp(0., 1., value);

    gl_FragColor = vec4(0.0, smoothstep(0.95, 1.0, value * value), 0., 1.0);
}

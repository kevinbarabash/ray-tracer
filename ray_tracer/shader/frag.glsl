precision mediump float;

varying vec2 vPosition;

struct Sphere {
    vec3 center;
    float radius;
    vec3 color;
};

void solveQuad(in float a, in float b, in float c, out int num_solutions, out float[2] solutions) {
    float dis = b * b - 4. * a * c;
    if (dis < 0.) {
        // no solutions
        num_solutions = 0;
    } else if (dis == 0.) {
        // one solution
        num_solutions = 1;
        solutions[0] = -0.5 * b / a;
    } else {
        // two solutions
        num_solutions = 2;
        solutions[0] = -0.5 * (b + sqrt(dis)) / a;
        solutions[1] = -0.5 * (b - sqrt(dis)) / a;
    }
}

void raySphereIntersection(in vec3 O, in vec3 D, in Sphere sphere, out int num_solutions, out float[2] solutions) {
    float r = sphere.radius;
    vec3 C = sphere.center;

    vec3 L = O - C;

    float a = dot(D, D);
    float b = 2. * dot(D, L);
    float c = dot(L, L) - r * r;

    solveQuad(a, b, c, num_solutions, solutions);
}

void main() {
    Sphere sphere1 = Sphere(vec3(0., 0., 0.), 256., vec3(1., 0., 0.));

    float z = 512.;
    vec3 D = vec3(0., 0., -1.);
    vec3 O = vec3(vPosition, z);

    int num_solutions;
    float solutions[2];

    raySphereIntersection(O, D, sphere1, num_solutions, solutions);

    if (num_solutions != 0) {
        gl_FragColor = vec4(1., 0., 1., 1.);
    } else {
        gl_FragColor = vec4(0., 0., 0., 1.);
    }
}

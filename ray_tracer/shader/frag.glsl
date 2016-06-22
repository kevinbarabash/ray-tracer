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
    vec3 sun = normalize(vec3(1., 1., 1.));

    Sphere spheres[2];

    spheres[0] = Sphere(vec3(256., 256., 0.), 128., vec3(0., 1., 1.));
    spheres[1] = Sphere(vec3(400., 400., 0.), 64., vec3(1., 0., 0.));

    // antialising offsets
    vec2 offsets[4];
    offsets[0] = vec2(0.25, 0.25);
    offsets[1] = vec2(0.75, 0.25);
    offsets[2] = vec2(0.75, 0.75);
    offsets[3] = vec2(0.25, 0.75);

    vec3 avg_color = vec3(0., 0., 0.);

    for (int k = 0; k < 4; k++) {
        vec3 color = vec3(0.25, 0.25, 0.25);
        float z_max = -1000.;

        for (int i = 0; i < 2; i++) {
            Sphere sphere = spheres[i];

            float camera_z = 512.;
            vec3 D = vec3(0., 0., -1.);
            vec3 O = vec3(vPosition + offsets[k], camera_z);

            int num_solutions;
            float solutions[2];

            raySphereIntersection(O, D, sphere, num_solutions, solutions);

            for (int j = 0; j < 2; j++) {
                if (j >= num_solutions) {
                    continue;
                }
                float t = solutions[j];
                vec3 hit = O + t * D;

                // z+ is coming out of the screen
                if (hit.z > z_max) {
                    z_max = hit.z;

                    vec3 N = normalize(hit - sphere.center);
                    float shade = dot(sun, N);
                    color = shade * sphere.color;
                }
            }
        }

        avg_color += color;
    }

    gl_FragColor = vec4(0.25 * avg_color, 1.);
}

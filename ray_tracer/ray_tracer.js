const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const copy = (src, srcOffset, dst, dstOffset, length) => {
    for (let i = 0; i < length; i++) {
        dst[dstOffset + i] = src[srcOffset + i];
    }
};

const runFragShader = (shader) => {
    const imageData = ctx.getImageData(0, 0, 512, 512);
    const data = imageData.data;

    for (let y = 0; y < 512; y++) {
        for (let x = 0; x < 512; x++) {
            const color = shader(x, y);
            color[0] = 255 * color[0] | 0;
            color[1] = 255 * color[1] | 0;
            color[2] = 255 * color[2] | 0;
            color[3] = 255 * color[3] | 0;
            const offset = 4 * (512 * y + x);
            copy(color, 0, data, offset, 4);
        }
    }

    ctx.putImageData(imageData, 0, 0);
};

const spheres = [
    {
        center: [400, 100, 0],
        radius: 64,
        color: [1, 0, 0],
    },
    {
        center: [256, 256, 128],
        radius: 128,
        color: [0, 1, 1],
    }
];

const dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
const add = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
const sub = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
const scale = (k, v) => [k * v[0], k * v[1], k * v[2]];

const solveQuad = (a, b, c) => {
    const dis = b * b - 4 * a * c;
    if (dis < 0) {
        return [];
    } else if (dis === 0) {
        return [-0.5 * b / a];
    } else {
        const result = [
            -0.5 * (b + Math.sqrt(dis)) / a,
            -0.5 * (b - Math.sqrt(dis)) / a
        ];
        result.sort();
        return result;
    }
};

const normalize = (v) => {
    const len = Math.sqrt(dot(v, v));
    return [v[0] / len, v[1] / len, v[2] / len];
};

const raySphereIntersection = (O, D, sphere) => {
    const r = sphere.radius;
    const C = sphere.center;

    const L = sub(O, C);

    const a = dot(D, D);
    const b = 2 * dot(D, L);
    const c = dot(L, L) - r * r;

    return solveQuad(a, b, c);
};

const rayShader = (x, y) => {
    let max = -Infinity;
    let closestHit = null;
    let hitSphere = null;

    const z = 512;          // ray_z
    const D = [0, 0, -1];   // direction of the ray
    const O = [x, y, z];    // origin of the ray

    const sun = normalize([1, -1, -1]);

    spheres.forEach(sphere => {
        const result = raySphereIntersection(O, D, sphere);

        result.forEach(t => {
            const hit = add(O, scale(t, D));  // O + Dt
            if (t > max)  {
                max = t;
                hitSphere = sphere;
                closestHit = hit;
            }
        });
    });

    const otherSpheres = spheres.filter(sphere => sphere !== hitSphere);

    if (closestHit) {

        const inShadow = otherSpheres.some(sphere => {
            const D = [1, -1, -1];
            const result = raySphereIntersection(closestHit, D, sphere);
            return result.filter(t => t > 0).length > 0;
        });

        if (inShadow) {
            return [0, 0, 0, 1];
        } else {
            const N = normalize(sub(closestHit, hitSphere.center));
            const shade = dot(sun, N);
            const color = hitSphere.color;
            return [...scale(shade, color), 1];
        }
    } else {
        return [0.25, 0.25, 0.25, 1];
    }
};

const start = Date.now();
runFragShader(rayShader);
const elapsed = Date.now() - start;
console.log(`elapsed = ${elapsed}`);

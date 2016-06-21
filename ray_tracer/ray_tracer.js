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
            const offset = 4 * (512 * y + x);
            copy(color, 0, data, offset, 4);
        }
    }

    ctx.putImageData(imageData, 0, 0);
};

const randomInt = (max) => max * Math.random() | 0;

const spheres = [
    {
        center: [400, 100, 0],
        radius: 64,
        color: [255, 0, 0],
    },
    {
        center: [256, 256, 0],
        radius: 128,
        color: [0, 255, 255],
    }
];

const dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
const sub = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];

const solveQuad = (a, b, c) => {
    const dis = b * b - 4 * a * c;
    if (dis < 0) {
        return [];
    } else if (dis === 0) {
        return [-0.5 * b / a];
    } else {
        const result = [
            -0.5 * (b + Math.sqrt(dis)) / a,
            0.5 * (b + Math.sqrt(dis)) / a
        ];
        result.sort();
        return result;
    }
};

const normalize = (v) => {
    const len = Math.sqrt(dot(v, v));
    return [v[0] / len, v[1] / len, v[2] / len];
};

runFragShader((x, y) => {
    let color = [0, 0, 0];
    let max = -Infinity;
    let hit = null;
    let center = null;

    const z = 512;          // ray_z
    const D = [0, 0, -1];   // direction of the ray
    const O = [x, y, z];    // origin of the ray

    spheres.forEach(sphere => {
        const r = sphere.radius;
        const C = sphere.center;

        const L = sub(O, C);

        const a = 1;
        const b = 2 * dot(D, L);
        const c = dot(L, L) - r * r;

        const result = solveQuad(a, b, c);

        result.forEach(t => {
            if (t > max && t < z)  {
                max = t;
                color = sphere.color;
                center = C;
                hit = [x, y, z - t];  // O + Dt
            }
        })
    });

    if (hit) {
        const N = normalize(sub(hit, center));
        const shade = -dot([-1/Math.sqrt(3), 1/Math.sqrt(3), -1/Math.sqrt(3)], N);
        return [shade * color[0] | 0, shade * color[1] | 0, shade * color[2] | 0, 255];
    } else {
        return [64, 64, 64, 255];
    }

});

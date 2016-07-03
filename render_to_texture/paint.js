const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
canvas.style.border = 'solid 1px gray';

document.body.appendChild(canvas);

CanvasRenderingContext2D.prototype.fillCircle = function(x, y, radius) {
    this.beginPath();
    this.arc(x, y, radius, 0, 2 * Math.PI, false);
    this.fill();
};

const ctx = canvas.getContext('2d');

const downs = Kefir.fromEvents(document, 'mousedown');
const moves = Kefir.fromEvents(document, 'mousemove');
const ups = Kefir.fromEvents(document, 'mouseup');

let lastMousePoint = null;
let lastMouseMidpoint = null;
let lastPoint = null;

const randomInt = (max) => max * Math.random() | 0;

const randomColor = (a = 1.0) => {
    const r = randomInt(255);
    const g = randomInt(255);
    const b = randomInt(255);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const distance = (p1, p2) => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    // TODO: remove square root and check distance squared instead
    return Math.sqrt(dx * dx + dy * dy);
};

// Adapted from http://www.malczak.linuxpl.com/blog/quadratic-bezier-curve-length/
function blen(p0, p1, p2) {
    const a = [];
    const b = [];

    a[0] = p0[0] - 2*p1[0] + p2[0];
    a[1] = p0[1] - 2*p1[1] + p2[1];
    b[0] = 2*p1[0] - 2*p0[0];
    b[1] = 2*p1[1] - 2*p0[1];
    const A = 4*(a[0]*a[0] + a[1]*a[1]);
    const B = 4*(a[0]*b[0] + a[1]*b[1]);
    const C = b[0]*b[0] + b[1]*b[1];

    const Sabc = 2*Math.sqrt(A+B+C);
    const A_2 = Math.sqrt(A);
    const A_32 = 2*A*A_2;
    const C_2 = 2*Math.sqrt(C);
    const BA = B/A_2;

    return (
            A_32 * Sabc +
            A_2 * B * (Sabc - C_2) +
            (4 * C * A - B * B) * Math.log( (2 * A_2 + BA + Sabc) / (BA + C_2) )
        ) / (4*A_32);
}

const radius = 10;

ctx.lineWidth = 2 * radius;
ctx.lineCap = 'round';

downs.onValue((e) => {
    ctx.fillStyle = randomColor();
    ctx.strokeStyle = ctx.fillStyle;
    lastMousePoint = [e.pageX, e.pageY];
    lastPoint = [e.pageX, e.pageY];
    ctx.fillCircle(...lastMousePoint, radius);
});
ups.onValue((event) => {
    const currentPoint = [event.pageX, event.pageY];

    lastPoint = line(lastMousePoint, currentPoint);

    lastMousePoint = null;
    lastMouseMidpoint = null;
});

// TODO: filter out points that are too close
const drags = downs.flatMap((event) => moves.takeUntilBy(ups));

drags.onValue((e) => {
    const currentPoint = [e.pageX, e.pageY];
    // const d = distance(lastPoint, currentPoint);
    // if (d >= spacing) {
    //     lastPoint = line(lastPoint, currentPoint);
    // }

    const midPoint = [(lastMousePoint[0] + currentPoint[0])/2, (lastMousePoint[1] + currentPoint[1])/2];

    ctx.beginPath();
    if (!lastMouseMidpoint) {
        lastPoint = line(lastMousePoint, midPoint);
    } else {
        lastPoint = curve(lastMouseMidpoint, lastMousePoint, midPoint, lastPoint);
    }

    lastMouseMidpoint = midPoint;
    lastMousePoint = currentPoint;
});

ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';

let spacing = 2 * radius;

const line = (start, end) => {
    const d = distance(end, start);

    const cos = (end[0] - start[0]) / d;
    const sin = (end[1] - start[1]) / d;

    let p = [...start];
    let t = 0;

    while (t + spacing < d) {
        p[0] += spacing * cos;
        p[1] += spacing * sin;
        t += spacing;
        ctx.fillCircle(...p, radius);
    }

    return p;
};

lastPoint = [50, 400];

for (let i = 0; i <= 2 * Math.PI; i += 0.1) {
    const x = 50 + 60 * i;
    const y = 400 + 60 * Math.sin(i);

    const currentPoint = [x, y];
    const d = distance(lastPoint, currentPoint);
    if (d >= spacing) {
        lastPoint = line(lastPoint, currentPoint);
    }
}


const curve = (p1, cp, p2, lastPoint = p1) => {
    let len = blen(p1, cp, p2);
    let dt = spacing / len;

    spacing = 2 * radius;

    for (let t = 0; t <= 1.0; t += dt) {
        const s = 1 - t;
        const x = s * s * p1[0] + 2 * s * t * cp[0] + t * t * p2[0];
        const y = s * s * p1[1] + 2 * s * t * cp[1] + t * t * p2[1];

        const currentPoint = [x, y];
        const d = distance(lastPoint, currentPoint);
        if (d >= spacing) {
            lastPoint = line(lastPoint, currentPoint);
        }
    }

    return lastPoint;
};

let p1 = [50, 300];
let p2 = [256, 300];
let cp = [(50 + 256) / 2, 100];

ctx.fillStyle = 'green';
ctx.fillCircle(...p1, radius);

lastPoint = curve(p1, cp, p2);

p1 = [256, 300];
p2 = [512 - 50, 300];
cp = [(256 + 512 - 50) / 2, 500];

lastPoint = curve(p1, cp, p2, lastPoint);

ctx.fillCircle(...p2, radius);

console.log(distance(lastPoint, p2));
console.log(`spacing = ${spacing}`);
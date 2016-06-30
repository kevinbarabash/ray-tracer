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

let lastPoint = null;
let lastMidpoint = null;

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

const radius = 10;

ctx.lineWidth = 2 * radius;
ctx.lineCap = 'round';

downs.onValue((e) => {
    ctx.fillStyle = randomColor();
    ctx.strokeStyle = ctx.fillStyle;
    lastPoint = [e.pageX, e.pageY];
    ctx.fillCircle(...lastPoint, radius);
});
ups.onValue((event) => {
    const currentPoint = [event.pageX, event.pageY];

    ctx.beginPath();
    ctx.moveTo(...lastPoint);
    ctx.lineTo(...currentPoint);

    lastPoint = null;
    lastMidpoint = null;
});

// TODO: filter out points that are too close
const drags = downs.flatMap((event) => moves.takeUntilBy(ups));

drags.onValue((e) => {
    const currentPoint = [e.pageX, e.pageY];
    // const d = distance(lastPoint, currentPoint);
    // if (d >= spacing) {
    //     lastPoint = line(lastPoint, currentPoint);
    // }

    const midPoint = [(lastPoint[0] + currentPoint[0])/2, (lastPoint[1] + currentPoint[1])/2];

    ctx.beginPath();
    if (!lastMidpoint) {
        ctx.moveTo(...lastPoint);
        ctx.lineTo(...midPoint);
    } else {
        ctx.moveTo(...lastMidpoint);
        ctx.quadraticCurveTo(...lastPoint, ...midPoint);
    }
    ctx.stroke();

    lastMidpoint = midPoint;
    lastPoint = currentPoint;
});

ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';

const spacing = 0.25 * radius;

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

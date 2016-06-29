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

downs.onValue((event) => lastPoint = { x: event.pageX, y: event.pageY });
ups.onValue((event) => lastPoint = null);
const drags = downs.flatMap((event) => moves.takeUntilBy(ups));

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

downs.onValue((e) => {
    ctx.fillStyle = randomColor();
    lastPoint = [e.pageX, e.pageY];
});
drags.onValue((e) => {
    const currentPoint = [e.pageX, e.pageY];
    const d = distance(lastPoint, currentPoint);
    if (d >= spacing) {
        lastPoint = line(lastPoint, currentPoint);
    }
});

ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';


const radius = 10;
const spacing = 2 * radius;

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

line([100, 100], [400, 300]);

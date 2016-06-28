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
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    // TODO: remove square root and check distance squared instead
    return Math.sqrt(dx * dx + dy * dy);
};

downs.onValue((e) => ctx.fillStyle = randomColor());
drags.onValue((e) => {
    const p = { x: event.pageX, y: event.pageY };
    const d = distance(lastPoint, p);
    console.log(`d = ${d}`);
    ctx.fillCircle(e.pageX, e.pageY, 20);
});

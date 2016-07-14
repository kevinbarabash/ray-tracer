const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.querySelector('canvas');
canvas.width = width;
canvas.height = height;
const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
const ext = gl.getExtension('EXT_color_buffer_float');

const simple = createProgram('simple');

gl.enable(gl.BLEND);
gl.disable(gl.DEPTH_TEST);
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

simple.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([200, 200]), gl.STATIC_DRAW);
simple.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0]), gl.STATIC_DRAW);

// create an empty texture
var tex = createTexture(gl.TEXTURE_2D, gl.RGBA, width, height, { minFilter: gl.NEAREST, magFilter: gl.NEAREST });

// create a fbo and attac the texture to it
var fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);


gl.clearColor(0., 0., 0., 1.);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, width, height);


simple.useProgram();

let projMatrix;
// TODO: instead of radius use line width/thickness
let radius = 100;

projMatrix = ortho([], 0, width, 0, height, 1, -1);    // near z is positive
gl.viewport(0, 0, width, height);

gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);
gl.uniform3fv(simple.uniforms.uColor, [1., 0., 1.]);
gl.uniform1f(simple.uniforms.uRadius, radius);

simple.buffers.pos.bind();
simple.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

simple.buffers.elements.bind();
gl.drawElements(gl.POINTS, 1, gl.UNSIGNED_SHORT, 0);

const distance = (start, end) => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    return Math.sqrt(dx * dx + dy * dy);
};

let spacing = 0.25 * radius;

const drawPoints = (points) => {
    simple.buffers.pos.update(new Float32Array(points));
    simple.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    const len = points.length / 2;
    simple.buffers.elements.update(new Uint16Array([...range(len)]));
    gl.drawElements(gl.POINTS, len, gl.UNSIGNED_SHORT, 0);
};

const line = (start, end) => {
    const d = distance(end, start);

    const cos = (end[0] - start[0]) / d;
    const sin = (end[1] - start[1]) / d;

    let p = [...start];
    let t = 0;

    const points = [];

    while (t + spacing < d) {
        p[0] += spacing * cos;
        p[1] += spacing * sin;
        t += spacing;
        points.push(...p);
    }

    drawPoints(points);

    return p;
};

// Adapted from http://www.malczak.linuxpl.com/blog/quadratic-bezier-curve-length/
function bezier_len(p0, p1, p2) {
    const a = [];
    const b = [];

    a[0] = p0[0] - 2 * p1[0] + p2[0];
    a[1] = p0[1] - 2 * p1[1] + p2[1];
    b[0] = 2 * p1[0] - 2 * p0[0];
    b[1] = 2 * p1[1] - 2 * p0[1];

    const A = 4 * (a[0] * a[0] + a[1] * a[1]);
    const B = 4 * (a[0] * b[0] + a[1] * b[1]);
    const C = b[0] * b[0] + b[1] * b[1];

    const Sabc = 2 * Math.sqrt(A + B + C);
    const A_2 = Math.sqrt(A);
    const A_32 = 2 * A * A_2;
    const C_2 = 2 * Math.sqrt(C);
    const BA = B / A_2;

    return (
            A_32 * Sabc +
            A_2 * B * (Sabc - C_2) +
            (4 * C * A - B * B) * Math.log( (2 * A_2 + BA + Sabc) / (BA + C_2) )
        ) / (4*A_32);
}

const curve = (p1, cp, p2, lastPoint = p1) => {
    const len = bezier_len(p1, cp, p2);
    const dt = spacing / len;

    for (let t = 0; t <= 1.0; t += dt) {
        const s = 1 - t;
        const x = s * s * p1[0] + 2 * s * t * cp[0] + t * t * p2[0];
        const y = s * s * p1[1] + 2 * s * t * cp[1] + t * t * p2[1];

        const currentPoint = [x, y];
        const d = distance(lastPoint, currentPoint);
        if (d > spacing) {
            lastPoint = line(lastPoint, currentPoint);
        }
    }

    return lastPoint;
};


const range = function* (len) {
    let i = 0;
    while (i < len) {
        yield i++;
    }
};

curve([100, 50], [400, 300], [800, 100]);

const rtt = createProgram('texture');
rtt.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, width, 0, width, height, 0, height]), gl.STATIC_DRAW);
rtt.buffers.uv = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
rtt.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


gl.bindFramebuffer(gl.FRAMEBUFFER, null);

rtt.useProgram();

gl.blendFunc(gl.ONE, gl.ZERO);

projMatrix = ortho([], 0, width, 0, height, 1, -1);    // near z is positive
gl.viewport(0, 0, width, height);
gl.uniformMatrix4fv(rtt.uniforms.projMatrix, false, projMatrix);

gl.activeTexture(gl.TEXTURE1);
tex.bind();
gl.uniform1i(rtt.uniforms.uSampler, 1);

rtt.buffers.pos.bind();
rtt.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

rtt.buffers.uv.bind();
rtt.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

rtt.buffers.elements.bind();
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);



let color = [Math.random(), Math.random(), Math.random()];

let lastMousePoint = null;
let lastMouseMidpoint = null;
let lastPoint = null;

const downs = Kefir.fromEvents(document, 'mousedown');
const moves = Kefir.fromEvents(document, 'mousemove');
const ups = Kefir.fromEvents(document, 'mouseup');

const updateCanvas = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    rtt.useProgram();

    gl.blendFunc(gl.ONE, gl.ZERO);

    // projMatrix = ortho([], x - radius, x + radius, y - radius, y + radius, 1, -1);    // near z is positive
    // gl.viewport(x - radius, y - radius, 2 * radius, 2 * radius);

    gl.uniformMatrix4fv(rtt.uniforms.projMatrix, false, projMatrix);

    gl.activeTexture(gl.TEXTURE1);
    tex.bind();
    gl.uniform1i(rtt.uniforms.uSampler, 1);

    rtt.buffers.pos.bind();
    rtt.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    rtt.buffers.uv.bind();
    rtt.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

    rtt.buffers.elements.bind();
    gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);
};

downs.onValue((e) => {
    color = [Math.random(), Math.random(), Math.random()];
    lastMousePoint = [e.pageX, height - e.pageY];
    lastPoint = [e.pageX, height - e.pageY];

    simple.useProgram();

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.DST_ALPHA);

    // TODO: don't redraw the whole screen each time
    projMatrix = ortho([], 0, width, 0, height, 1, -1);    // near z is positive
    gl.viewport(0, 0, width, height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);

    gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);
    gl.uniform3fv(simple.uniforms.uColor, color);

    const currentPoint = [e.pageX, height - e.pageY];

    drawPoints(currentPoint);

    updateCanvas();
});

ups.onValue((e) => {
    const currentPoint = [e.pageX, height - e.pageY];
    lastPoint = line(lastMousePoint, currentPoint);
    lastMousePoint = null;
    lastMouseMidpoint = null;
});

// TODO: filter out points that are too close
const drags = downs.flatMap((event) => moves.takeUntilBy(ups));

drags.onValue((e) => {
    simple.useProgram();

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.SRC_ALPHA, gl.DST_ALPHA);

    // TODO: don't redraw the whole screen each time
    projMatrix = ortho([], 0, width, 0, height, 1, -1);    // near z is positive
    gl.viewport(0, 0, width, height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);

    gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);
    gl.uniform3fv(simple.uniforms.uColor, color);

    const currentPoint = [e.pageX, height - e.pageY];
    const midPoint = [(lastMousePoint[0] + currentPoint[0])/2, (lastMousePoint[1] + currentPoint[1])/2];

    if (!lastMouseMidpoint) {
        lastPoint = line(lastMousePoint, midPoint);
    } else {
        lastPoint = curve(lastMouseMidpoint, lastMousePoint, midPoint, lastPoint);
    }

    lastMouseMidpoint = midPoint;
    lastMousePoint = currentPoint;

    updateCanvas();
});

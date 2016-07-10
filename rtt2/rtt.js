/*

    copy bg -> fg
    draw brush strokes on fg
    draw fg -> screen
    swap fg <-> bg

 */

const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.querySelector('canvas');
canvas.width = width;
canvas.height = height;
const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });

const simple = createProgram('simple');

gl.enable(gl.BLEND);
gl.disable(gl.DEPTH_TEST);
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

simple.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([200, 200]), gl.STATIC_DRAW);
simple.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0]), gl.STATIC_DRAW);

// create an empty texture
var tex = createTexture(gl.TEXTURE_2D, gl.RGBA, width, height, { minFilter: gl.LINEAR, magFilter: gl.NEAREST });

// create a fbo and attac the texture to it
var fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);


gl.clearColor(0., 0., 0., 1.);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, width, height);


simple.useProgram();

let projMatrix;
let radius = 10;
let x = 100;
let y = 100;

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

let spacing = 5;

const drawPoints = (points) => {
    simple.buffers.pos.update(new Float32Array(points));
    simple.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    const len = points.length / 2;
    simple.buffers.elements.update(new Uint16Array([...range(len)]));
    gl.drawElements(gl.POINTS, len, gl.UNSIGNED_SHORT, 0);
}

const line = (start, end) => {
    const d = distance(end, start);

    const cos = (end[0] - start[0]) / d;
    const sin = (end[1] - start[1]) / d;

    let p = [...start];
    let t = 0;

    const points = [];
    points.push(...start);

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

const curve = (p1, cp, p2, lastPoint = p1) => {
    let len = blen(p1, cp, p2);
    let dt = spacing / len;

    // spacing = 2 * radius;

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


const range = function* (len) {
    let i = 0;
    while (i < len) {
        yield i++;
    }
};

// const p = line([100, 50], [800, 600]);
const p = curve([100, 50], [400, 300], [800, 100]);

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
let down = false;
let lastX, lastY;

document.addEventListener('mousedown', (e) => {
    down = true;
    color = [Math.random(), Math.random(), Math.random()];

    x = e.pageX;
    y = height - e.pageY;

    simple.useProgram();

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    projMatrix = ortho([], 0, width, 0, height, 1, -1);    // near z is positive
    gl.viewport(0, 0, width, height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);

    gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);
    gl.uniform3fv(simple.uniforms.uColor, color);

    simple.buffers.pos.bind();
    simple.buffers.pos.update(new Float32Array([x, y]));
    simple.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    simple.buffers.elements.bind();
    gl.drawElements(gl.POINTS, 1, gl.UNSIGNED_SHORT, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);


    // update canvas
    rtt.useProgram();

    gl.blendFunc(gl.ONE, gl.ZERO);


    projMatrix = ortho([], x - radius, x + radius, y - radius, y + radius, 1, -1);    // near z is positive
    gl.viewport(x - radius, y - radius, 2 * radius, 2 * radius);

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

    lastX = x;
    lastY = y;
});

document.addEventListener('mousemove', (e) => {
    if (!down) {
        return;
    }

    x = e.pageX;
    y = height - e.pageY;

    simple.useProgram();

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // Take the union of bounding box of the previous thing we drew and thing
    // we're about to draw.  This is necessary b/c we're copying and drawing all
    // in one step.
    const left = Math.min(x - radius, lastX - radius);
    const right = Math.max(x + radius, lastX + radius);
    const bottom = Math.min(y - radius, lastY - radius);
    const top = Math.max(y + radius, lastY + radius);

    projMatrix = ortho([], left, right, bottom, top, 1, -1);    // near z is positive
    gl.viewport(left, bottom, right - left, top - bottom);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);

    gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);
    gl.uniform3fv(simple.uniforms.uColor, color);

    line([lastX, lastY], [x, y]);
    // simple.buffers.pos.bind();
    // simple.buffers.pos.update(new Float32Array([x, y]));
    // simple.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    // simple.buffers.elements.bind();
    // gl.drawElements(gl.POINTS, 1, gl.UNSIGNED_SHORT, 0);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);


    // update canvas
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


    lastX = x;
    lastY = y;
});

document.addEventListener('mouseup', (e) => {
    if (!down) {
        return;
    }
    down = false;

    // x = e.pageX;
    // y = height - e.pageY;
    // if (x === lastX && y === lastY) {
    //     return;
    // }

    // simple.useProgram();

    // // Take the union of bounding box of the previous thing we drew and thing
    // // we're about to draw.  This is necessary b/c we're copying and drawing all
    // // in one step.
    // const left = Math.min(x - radius, lastX - radius);
    // const right = Math.max(x + radius, lastX + radius);
    // const bottom = Math.min(y - radius, lastY - radius);
    // const top = Math.max(y + radius, lastY + radius);

    // projMatrix = ortho([], left, right, bottom, top, 1, -1);    // near z is positive
    // gl.viewport(left, bottom, right - left, top - bottom);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    // gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);

    // gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);
    // gl.uniform2fv(simple.uniforms.uMousePos, [x, y]);
    // gl.uniform3fv(simple.uniforms.uColor, color);

    // simple.buffers.pos.bind();
    // simple.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    // simple.buffers.uv.bind();
    // simple.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

    // simple.buffers.elements.bind();
    // gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);



    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);


    // // update canvas
    // rtt.useProgram();

    // projMatrix = ortho([], x - radius, x + radius, y - radius, y + radius, 1, -1);    // near z is positive
    // gl.viewport(x - radius, y - radius, 2 * radius, 2 * radius);

    // gl.uniformMatrix4fv(rtt.uniforms.projMatrix, false, projMatrix);

    // gl.activeTexture(gl.TEXTURE1);
    // tex.bind();
    // gl.uniform1i(rtt.uniforms.uSampler, 1);

    // rtt.buffers.pos.bind();
    // rtt.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    // rtt.buffers.uv.bind();
    // rtt.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

    // rtt.buffers.elements.bind();
    // gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

    // lastX = x;
    // lastY = y;
});

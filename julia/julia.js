document.body.style.margin = 0;

const canvas = document.createElement('canvas');
console.log(window.innerWidth);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

const gl = canvas.getContext('experimental-webgl');

const program = createProgram('julia');

const w = window.innerWidth;
const h = window.innerHeight;

var mouse = [0, 0];
var left, right, bottom, _top;
var dw, dh;

const size = 3;

if (canvas.width > canvas.height) {
    dh = 3 / canvas.height;
    dw = dh;

    left = -size / 2 * canvas.width / canvas.height;
    right = size / 2 * canvas.width / canvas.height;
    bottom = -size / 2;
    _top = size / 2;
} else {
    dw = 3 / canvas.width;
    dh = dw;

    left = -size / 2;
    right = size / 2;
    bottom = -size / 2 * canvas.height / canvas.width;
    _top = size / 2 * canvas.height / canvas.width;
}

const bounds = new Float32Array([left, bottom, right, bottom, right, _top, left, _top]);

program.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, w, 0, w, h, 0, h]), gl.STATIC_DRAW);
program.buffers.uv = createBuffer(gl.ARRAY_BUFFER, bounds, gl.STATIC_DRAW);
program.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


gl.clearColor(0.5, 0.5, 0.5, 1);
gl.viewport(0, 0, w, h);

var dragging = false;

const draw = function() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    program.useProgram();

    const projMatrix = ortho([], 0, w, 0, h, -1, 1);
    gl.uniformMatrix4fv(program.uniforms.projMatrix, false, projMatrix);

    // set up vertex attributes before drawing
    program.buffers.pos.bind();
    program.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    program.buffers.uv.bind();

    program.buffers.uv.update(bounds);
    program.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

    program.buffers.elements.bind();
    gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    if (dragging) {
        requestAnimationFrame(draw);
    }
};

requestAnimationFrame(draw);

var lastMouse;

document.addEventListener('mousedown', function(e) {
    lastMouse = [e.pageX, h - e.pageY];
    dragging = true;
    requestAnimationFrame(draw);
});

document.addEventListener('mousemove', function(e) {
    if (dragging) {
        mouse = [e.pageX, h - e.pageY];
        const dx = mouse[0] - lastMouse[0];
        const dy = mouse[1] - lastMouse[1];
        bounds[0] -= dx * dw;
        bounds[2] -= dx * dw;
        bounds[4] -= dx * dw;
        bounds[6] -= dx * dw;
        bounds[1] -= dy * dh;
        bounds[3] -= dy * dh;
        bounds[5] -= dy * dh;
        bounds[7] -= dy * dh;
        lastMouse = mouse;
    }
});

document.addEventListener('mouseup', function(e) {
    if (dragging) {
        dragging = false;
        mouse = [e.pageX, h - e.pageY];
        const dx = mouse[0] - lastMouse[0];
        const dy = mouse[1] - lastMouse[1];
        bounds[0] -= dx * dw;
        bounds[2] -= dx * dw;
        bounds[4] -= dx * dw;
        bounds[6] -= dx * dw;
        bounds[1] -= dy * dh;
        bounds[3] -= dy * dh;
        bounds[5] -= dy * dh;
        bounds[7] -= dy * dh;
        lastMouse = mouse;
    }
});

document.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    lastMouse = [touch.pageX, h - touch.pageY];
    dragging = true;
    requestAnimationFrame(draw);
});

document.addEventListener('touchmove', function(e) {
    if (dragging) {
        const touch = e.changedTouches[0];
        mouse = [touch.pageX, h - touch.pageY];
        const dx = mouse[0] - lastMouse[0];
        const dy = mouse[1] - lastMouse[1];
        bounds[0] -= dx * dw;
        bounds[2] -= dx * dw;
        bounds[4] -= dx * dw;
        bounds[6] -= dx * dw;
        bounds[1] -= dy * dh;
        bounds[3] -= dy * dh;
        bounds[5] -= dy * dh;
        bounds[7] -= dy * dh;
        lastMouse = mouse;
    }
});

document.addEventListener('touchend', function(e) {
    if (dragging) {
        dragging = false;
        const touch = e.changedTouches[0];
        mouse = [touch.pageX, h - touch.pageY];
        const dx = mouse[0] - lastMouse[0];
        const dy = mouse[1] - lastMouse[1];
        bounds[0] -= dx * dw;
        bounds[2] -= dx * dw;
        bounds[4] -= dx * dw;
        bounds[6] -= dx * dw;
        bounds[1] -= dy * dh;
        bounds[3] -= dy * dh;
        bounds[5] -= dy * dh;
        bounds[7] -= dy * dh;
        lastMouse = mouse;
    }
});

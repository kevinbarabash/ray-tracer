document.body.style.margin = 0;

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

const gl = canvas.getContext('experimental-webgl');

const program = createProgram('julia');

const w = window.innerWidth;
const h = window.innerHeight;

let mouse = [0, 0];
let left, right, bottom, _top;
let dw, dh;

const size = 3;

if (canvas.width > canvas.height) {
    dh = 3 / canvas.height;
    dw = dh;

    left = -size / 2 * canvas.width / canvas.height;
    right = size / 2 * canvas.width / canvas.height;
    bottom = -size / 2;
    _top = size / 2;
} else {
    // TODO implement this
}

const bounds = new Float32Array([left, bottom, right, bottom, right, _top, left, _top]);

program.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, w, 0, w, h, 0, h]), gl.STATIC_DRAW);
program.buffers.uv = createBuffer(gl.ARRAY_BUFFER, bounds, gl.STATIC_DRAW);
program.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


gl.clearColor(0.5, 0.5, 0.5, 1);
gl.viewport(0, 0, w, h);

// let t = 0;

const draw = () => {
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

    requestAnimationFrame(draw);
};

requestAnimationFrame(draw);

let drag = false;
let lastMouse;

document.addEventListener('mousedown', (e) => {
    lastMouse = [e.pageX, h - e.pageY];
    drag = true;
});

document.addEventListener('mousemove', (e) => {
    if (drag) {
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

document.addEventListener('mouseup', (e) => {
    if (drag) {
        drag = false;
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

document.body.style.margin = 0;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('experimental-webgl');


const program = createProgram('julia');

const w = 768;
const h = 768;

let mouse = [0, 0];

const left = -1.5;
const right = 1.5;
const bottom = -1.5;
const _top = 1.5;

program.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, w, 0, w, h, 0, h]), gl.STATIC_DRAW);
program.buffers.uv = createBuffer(gl.ARRAY_BUFFER, new Float32Array([left, bottom, right, bottom, right, _top, left, _top]), gl.STATIC_DRAW);
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
    program.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

    program.buffers.elements.bind();
    gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    // requestAnimationFrame(draw);
};

draw();

// requestAnimationFrame(draw);

let drag = false;

document.addEventListener('mousedown', (e) => {
    mouse = [e.pageX, h - e.pageY];
    drag = true;
});

document.addEventListener('mousemove', (e) => {
    if (drag) {
        mouse = [e.pageX, h - e.pageY];
    }
});

document.addEventListener('mouseup', (e) => {
    if (drag) {
        drag = false;
        mouse = [e.pageX, h - e.pageY];
    }
});

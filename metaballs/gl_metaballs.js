document.body.style.margin = 0;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('experimental-webgl');


const program = createProgram('metaballs');

const w = 512;
const h = 512;

let mouse = [0, 0];

program.buffers.position = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, w, 0, w, h, 0, h]), gl.STATIC_DRAW);
program.buffers.texCoords2 = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, w, 0, w, h, 0, h]), gl.STATIC_DRAW);
program.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


gl.clearColor(0.5, 0.5, 0.5, 1);
gl.viewport(0, 0, w, h);

let t = 0;

const draw = () => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    program.useProgram();

    const projMatrix = ortho([], 0, w, 0, h, -1, 1);
    gl.uniformMatrix4fv(program.uniforms.projMatrix, false, projMatrix);
    gl.uniform1f(program.uniforms.t, t++);
    gl.uniform2fv(program.uniforms.mouse, mouse);

    // set up vertex attributes before drawing
    program.buffers.position.bind();
    program.attributes.position.pointer(2, gl.FLOAT, false, 0, 0);

    program.buffers.texCoords2.bind();
    program.attributes.texCoords2.pointer(2, gl.FLOAT, false, 0, 0);

    program.buffers.elements.bind();
    gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    requestAnimationFrame(draw);
};

requestAnimationFrame(draw);

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

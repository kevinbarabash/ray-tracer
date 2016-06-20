const canvas = document.querySelector('canvas');
canvas.style.border = 'solid 1px gray';

const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

gl.viewport(0, 0, 512, 512);
gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.blendEquation( gl.FUNC_ADD );
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);
gl.disable(gl.DEPTH_TEST);

const program = createProgram('line');

program.useProgram();

// // geometry ?
// const buffers = {};
//
// // material ?
// const attributes = {};
// const uniforms = {};
//
// attributes.pos = gl.getAttribLocation(program, 'pos');
// attributes.color = gl.getAttribLocation(program, 'color');
//
// gl.enableVertexAttribArray(attributes.pos);
// gl.enableVertexAttribArray(attributes.color);

const quadForLine = (p1, p2) => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const len = Math.sqrt(dx * dx + dy * dy);

    const line_width = 2 + 50 * Math.random();
    const line_width_2 = line_width / 2;

    const cos = dx / len;
    const sin = dy / len;

    const a = [p1[0] - sin * line_width_2, p1[1] + cos * line_width_2];
    const b = [p1[0] + sin * line_width_2, p1[1] - cos * line_width_2];

    const c = [p2[0] - sin * line_width_2, p2[1] + cos * line_width_2];
    const d = [p2[0] + sin * line_width_2, p2[1] - cos * line_width_2];

    return [...a, ...b, ...c, ...d];
};

const p1 = [512 * Math.random(), 512 * Math.random()];  // start
const p2 = [512 * Math.random(), 512 * Math.random()];  // finish
const color = [Math.random(), Math.random(), Math.random()];

// uniforms.projMatrix = gl.getUniformLocation(program, 'projMatrix');

const projMatrix = ortho([], 0, 512, 0, 512, -1, 1);

gl.uniformMatrix4fv(program.uniforms.projMatrix, false, projMatrix);


program.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array(quadForLine(p1, p2)), gl.STATIC_DRAW);
program.buffers.color = createBuffer(gl.ARRAY_BUFFER, new Float32Array([...color, ...color, ...color, ...color]), gl.STATIC_DRAW);
program.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);

program.buffers.pos.bind();
program.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

program.buffers.color.bind();
program.attributes.color.pointer(3, gl.FLOAT, false, 0, 0);

program.buffers.elements.bind();
gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();

const draw = () => {
    const p1 = [512 * Math.random(), 512 * Math.random()];  // start
    const p2 = [512 * Math.random(), 512 * Math.random()];  // finish
    const color = [Math.random(), Math.random(), Math.random()];

    program.buffers.pos.update(new Float32Array(quadForLine(p1, p2)), gl.STATIC_DRAW);
    program.buffers.color.update(new Float32Array([...color, ...color, ...color, ...color]), gl.STATIC_DRAW);

    program.buffers.elements.bind();
    gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(draw);
};

draw();
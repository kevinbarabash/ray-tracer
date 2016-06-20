document.body.style.margin = 0;

const canvas = window.canvas;
const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });


gl.viewport(0, 0, 512, 512);
gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.blendEquation( gl.FUNC_ADD );
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);
gl.disable(gl.DEPTH_TEST);

const program = createProgram('circle');


// const buffers = {};
// const attributes = {};
// const uniforms = {};
//
// attributes.pos = gl.getAttribLocation(program, 'pos');
// attributes.radius = gl.getAttribLocation(program, 'radius');
// attributes.color = gl.getAttribLocation(program, 'color');
//
// gl.enableVertexAttribArray(attributes.pos);
// gl.enableVertexAttribArray(attributes.radius);
// gl.enableVertexAttribArray(attributes.color);


program.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([150, 200, 300, 350]), gl.STATIC_DRAW);
program.buffers.radius = createBuffer(gl.ARRAY_BUFFER, new Float32Array([20 + 100 * Math.random(), 20 + 100 * Math.random()]), gl.STATIC_DRAW);
program.buffers.color = createBuffer(gl.ARRAY_BUFFER, new Float32Array([Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]), gl.STATIC_DRAW);
program.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1]), gl.STATIC_DRAW);

const projMatrix = ortho([], 0, 512, 0, 512, -1, 1);


program.useProgram();

gl.uniformMatrix4fv(program.uniforms.projMatrix, false, projMatrix);

program.buffers.pos.bind();
program.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

program.buffers.radius.bind();
program.attributes.radius.pointer(1, gl.FLOAT, false, 0, 0);

program.buffers.color.bind();
program.attributes.color.pointer(3, gl.FLOAT, false, 0, 0);

program.buffers.elements.bind();
gl.drawElements(gl.POINTS, 2, gl.UNSIGNED_SHORT, 0);

gl.flush();


const draw = () => {
    program.buffers.pos.update(new Float32Array([512 * Math.random, 512 * Math.random, 512 * Math.random(), 512 * Math.random()]));
    program.buffers.color.update(new Float32Array([Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]));
    program.buffers.radius.update(new Float32Array([20 + 100 * Math.random(), 20 + 100 * Math.random()]));

    program.buffers.elements.bind();
    gl.drawElements(gl.POINTS, 2, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    requestAnimationFrame(draw);
};

draw();

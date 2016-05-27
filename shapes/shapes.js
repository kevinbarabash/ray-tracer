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


const buffers = {};
const attributes = {};
const uniforms = {};

attributes.pos = gl.getAttribLocation(program, 'pos');
attributes.radius = gl.getAttribLocation(program, 'radius');
attributes.color = gl.getAttribLocation(program, 'color');

gl.enableVertexAttribArray(attributes.pos);
gl.enableVertexAttribArray(attributes.radius);
gl.enableVertexAttribArray(attributes.color);


buffers.pos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([150, 200, 300, 350]), gl.STATIC_DRAW);

buffers.radius = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.radius);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([20 + 100 * Math.random(), 20 + 100 * Math.random()]), gl.STATIC_DRAW);

buffers.color = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]), gl.STATIC_DRAW);

buffers.elements = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.elements);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1]), gl.STATIC_DRAW);


uniforms.projMatrix = gl.getUniformLocation(program, 'projMatrix');

const projMatrix = ortho([], 0, 512, 0, 512, -1, 1);


gl.useProgram(program);

gl.uniformMatrix4fv(uniforms.projMatrix, false, projMatrix);

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
gl.vertexAttribPointer(attributes.pos, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.radius);
gl.vertexAttribPointer(attributes.radius, 1, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
gl.vertexAttribPointer(attributes.color, 3, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.elements);
gl.drawElements(gl.POINTS, 2, gl.UNSIGNED_SHORT, 0);

gl.flush();


const draw = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([512 * Math.random, 512 * Math.random, 512 * Math.random(), 512 * Math.random()]), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.radius);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([20 + 100 * Math.random(), 20 + 100 * Math.random()]), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.elements);
    gl.drawElements(gl.POINTS, 2, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    requestAnimationFrame(draw);
};

draw();

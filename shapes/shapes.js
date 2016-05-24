document.body.style.margin = 0;

const canvas = window.canvas;
const gl = canvas.getContext('experimental-webgl');


gl.viewport(0, 0, 512, 512);
gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.blendEquation( gl.FUNC_ADD );
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);
gl.disable(gl.DEPTH_TEST);

const program = createProgram('circle');

console.log(gl.getError());


const buffers = {};
const attributes = {};
const uniforms = {};


attributes.pos = gl.getAttribLocation(program, 'pos');

gl.enableVertexAttribArray(attributes.pos);


buffers.pos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([200, 300, 300, 350]), gl.STATIC_DRAW);

buffers.faces = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1]), gl.STATIC_DRAW);


uniforms.projMatrix = gl.getUniformLocation(program, 'projMatrix');

const projMatrix = ortho([], 0, 512, 0, 512, -1, 1);


gl.useProgram(program);

gl.uniformMatrix4fv(uniforms.projMatrix, false, projMatrix);

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
gl.vertexAttribPointer(attributes.pos, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
gl.drawElements(gl.POINTS, 2, gl.UNSIGNED_SHORT, 0);

gl.flush();



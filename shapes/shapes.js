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


attributes.corner = gl.getAttribLocation(program, 'corner');
attributes.radius = gl.getAttribLocation(program, 'radius');
attributes.center = gl.getAttribLocation(program, 'center');

gl.enableVertexAttribArray(attributes.corner);
gl.enableVertexAttribArray(attributes.radius);
gl.enableVertexAttribArray(attributes.center);



buffers.corner = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.corner);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);

buffers.radius = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.radius);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([20, 20, 20, 20, 50, 50, 50, 50]), gl.STATIC_DRAW);

buffers.center = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.center);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([200, 300, 200, 300, 200, 300, 200, 300, 300, 350, 300, 350, 300, 350, 300, 350]), gl.STATIC_DRAW);

buffers.faces = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7]), gl.STATIC_DRAW);


uniforms.projMatrix = gl.getUniformLocation(program, 'projMatrix');

const projMatrix = ortho([], 0, 512, 0, 512, -1, 1);


gl.useProgram(program);

gl.uniformMatrix4fv(uniforms.projMatrix, false, projMatrix);

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.radius);
gl.vertexAttribPointer(attributes.radius, 1, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.center);
gl.vertexAttribPointer(attributes.center, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.corner);
gl.vertexAttribPointer(attributes.corner, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 4 * 2);

gl.flush();



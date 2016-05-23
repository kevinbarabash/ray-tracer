const canvas = document.querySelector('canvas');
const gl = canvas.getContext('experimental-webgl');


const program = createProgram('metaballs');


const attributes = {};
attributes.textureCoords = gl.getAttribLocation(program, 'texCoords2');
attributes.position = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(attributes.textureCoords);
gl.enableVertexAttribArray(attributes.position);

const uniforms = {};
uniforms.projMatrix = gl.getUniformLocation(program, 'projMatrix');
console.log(uniforms);


const buffers = {};

const w = 512;
const h = 512;

// buffers for attributes
buffers.position = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, w, 0, w, h, 0, h]), gl.STATIC_DRAW);

buffers.textureCoords = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoords);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, w, 0, w, h, 0, h]), gl.STATIC_DRAW);


// buffer for triangles
buffers.faces = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


gl.clearColor(0.5, 0.5, 0.5, 1);
gl.viewport(0, 0, w, h);
gl.clear(gl.COLOR_BUFFER_BIT);


gl.useProgram(program);

const projMatrix = ortho([], 0, w, 0, h, -1, 1);
gl.uniformMatrix4fv(uniforms.projMatrix, false, projMatrix);

// set up vertex attributes before drawing
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
gl.vertexAttribPointer(attributes.position, 2, gl.FLOAT, false, 2 * 4, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoords);
gl.vertexAttribPointer(attributes.textureCoords, 2, gl.FLOAT, false, 2 * 4, 0);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();


console.log('buffers');
console.log(buffers);

console.log('attributes');
console.log(attributes);


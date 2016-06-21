const w = 512;
const h = 512;

const canvas = document.createElement('canvas');
canvas.width = w;
canvas.height = h;
document.body.appendChild(canvas);
const gl = canvas.getContext('webgl');

const program = createProgram('shader');

console.log(program);

program.buffers.position = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, w, 0, w, h, 0, h]), gl.STATIC_DRAW);
program.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


gl.clearColor(0.5, 0.5, 0.5, 1.);
gl.viewport(0, 0, w, h);


gl.clear(gl.COLOR_BUFFER_BIT);
program.useProgram();

const start = performance.now();

const projMatrix = ortho([], 0, w, 0, h, -1, 1);
gl.uniformMatrix4fv(program.uniforms.projMatrix, false, projMatrix);

program.buffers.position.bind();
program.attributes.position.pointer(2, gl.FLOAT, false, 0, 0);

program.buffers.elements.bind();
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();

const elapsed = performance.now() - start;
console.log(`elapsed = ${elapsed}`);

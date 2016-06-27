const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
document.body.appendChild(canvas);
const gl = canvas.getContext('webgl');

const ext = gl.getExtension("OES_texture_float");
console.log(ext);

const pixels = new Float32Array(4 * 64 * 64);

for (let i = 0; i < 4 * 64 * 64; i++) {
    pixels[i] = Math.random();
}

const level = 0;
const border = 0;
const target = gl.TEXTURE_2D;
const format = gl.RGBA;
const internalFormat = format;
const type = gl.FLOAT;
const width = 64;
const height = 64;

const texture = gl.createTexture();
gl.bindTexture(target, texture);
// target,level,internalformat,width,height,border,format,type,pixels
gl.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// unbind
gl.bindTexture(target, null);


const program = createProgram('shader');


program.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
program.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


gl.viewport(0, 0, 256, 256);

gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);


program.useProgram();

const projMatrix = ortho([], 0, 1, 0, 1, -1, 1);
gl.uniformMatrix4fv(program.uniforms.projMatrix, false, projMatrix);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.uniform1i(program.uniforms.uSampler, 0);

program.buffers.pos.bind();
program.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

program.buffers.elements.bind();
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();


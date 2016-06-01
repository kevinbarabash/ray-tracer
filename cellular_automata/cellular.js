const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const simple = createProgram('simple');
simple.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 10, 0, 10, 10, 0, 10]), gl.STATIC_DRAW);
simple.buffers.uv = createBuffer(gl.ARRAY_BUFFER, new Float32Array([
    0., 0.,
    1., 0.,
    1., 1.,
    0., 1.,
]), gl.STATIC_DRAW);
simple.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


const rtt = createProgram('texture');
rtt.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 300, 0, 300, 300, 0, 300]), gl.STATIC_DRAW);
rtt.buffers.uv = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
rtt.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);

const pixels = new Uint8Array(10 * 10 * 4);

for (var i = 0; i < 100; i++) {
    pixels[4 * i] = 0;
    pixels[4 * i + 1] = 0;
    pixels[4 * i + 2] = 0;
    pixels[4 * i + 3] = 255;
}

pixels[5 * 4] = 255;
pixels[5 * 4 + 1] = 0;
pixels[5 * 4 + 2] = 0;

// create an empty texture
var front = createTexture(
    gl.TEXTURE_2D, gl.RGBA, 10, 10,
    {
        pixels: pixels,
        minFilter: gl.LINEAR,
        magFilter: gl.NEAREST
    });

var back = createTexture(
    gl.TEXTURE_2D, gl.RGBA, 10, 10,
    {
        minFilter: gl.LINEAR,
        magFilter: gl.NEAREST
    });

// create a fbo and attach the texture to it
var fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, back.texture, 0);


gl.clearColor(1., 1., 1., 1.);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, 640, 480);

const projMatrix = ortho([], 0, 640, 0, 480, 1, -1);    // near z is positive


simple.useProgram();

gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);

gl.activeTexture(gl.TEXTURE1);
front.bind();
gl.uniform1i(simple.uniforms.uSampler, 1);

simple.buffers.pos.bind();
simple.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

simple.buffers.uv.bind();
simple.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

simple.buffers.elements.bind();
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();



gl.bindFramebuffer(gl.FRAMEBUFFER, null);

rtt.useProgram();

gl.uniformMatrix4fv(rtt.uniforms.projMatrix, false, projMatrix);

gl.activeTexture(gl.TEXTURE1);
back.bind();
gl.uniform1i(rtt.uniforms.uSampler, 1);

rtt.buffers.pos.bind();
rtt.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

rtt.buffers.uv.bind();
rtt.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

rtt.buffers.elements.bind();
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();


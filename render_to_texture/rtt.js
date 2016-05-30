const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

const simple = {
    uniforms: {},
    attributes: {},
    buffers: {},
};

simple.program = createProgram('simple');
simple.uniforms.projMatrix = gl.getUniformLocation(simple.program, 'projMatrix');
simple.attributes.pos = gl.getAttribLocation(simple.program, 'pos');
simple.attributes.color = gl.getAttribLocation(simple.program, 'color');
simple.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 10, 0, 10, 10, 0, 10]), gl.STATIC_DRAW);
simple.buffers.color = createBuffer(gl.ARRAY_BUFFER, new Float32Array([
    0., 0., 0.,
    1., 0., 0.,
    1., 1., 0.,
    0., 1., 0.,
]), gl.STATIC_DRAW);
simple.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


const rtt = {
    uniforms: {},
    attributes: {},
    buffers: {},
};

rtt.program = createProgram('texture');
rtt.uniforms.projMatrix = gl.getUniformLocation(rtt.program, 'projMatrix');
rtt.uniforms.uSampler = gl.getUniformLocation(rtt.program, 'uSampler');
rtt.attributes.pos = gl.getAttribLocation(rtt.program, 'pos');
rtt.attributes.uv = gl.getAttribLocation(rtt.program, 'uv');
rtt.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 300, 0, 300, 300, 0, 300]), gl.STATIC_DRAW);
rtt.buffers.uv = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
rtt.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


// create an empty texture
var tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 10, 10, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.bindTexture(gl.TEXTURE_2D, null);

// create a fbo and attac the texture to it
var fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);


gl.clearColor(1., 1., 1., 1.);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, 640, 480);


gl.useProgram(simple.program);
gl.enableVertexAttribArray(simple.attributes.pos);
gl.enableVertexAttribArray(simple.attributes.color);

const projMatrix = ortho([], 0, 640, 0, 480, 1, -1);    // near z is positive
gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);

gl.bindBuffer(gl.ARRAY_BUFFER, simple.buffers.pos);
gl.vertexAttribPointer(simple.attributes.pos, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, simple.buffers.color);
gl.vertexAttribPointer(simple.attributes.color, 3, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, simple.buffers.elements);
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();



gl.bindFramebuffer(gl.FRAMEBUFFER, null);

gl.useProgram(rtt.program);
gl.enableVertexAttribArray(rtt.attributes.pos);
gl.enableVertexAttribArray(rtt.attributes.uv);

gl.uniformMatrix4fv(rtt.uniforms.projMatrix, false, projMatrix);

gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.uniform1i(rtt.uniforms.uSampler, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, rtt.buffers.pos);
gl.vertexAttribPointer(rtt.attributes.pos, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, rtt.buffers.uv);
gl.vertexAttribPointer(rtt.attributes.uv, 2, gl.FLOAT, false, 0, 0);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rtt.buffers.elements);
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();


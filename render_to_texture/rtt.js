const width = 640;
const height = 480;

const canvas = document.querySelector('canvas');
canvas.width = width;
canvas.height = height;
const gl = canvas.getContext('webgl');

const simple = createProgram('simple');

simple.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, width, 0, width, height, 0, height]), gl.STATIC_DRAW);
simple.buffers.uv = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
simple.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);

var tex2 = createTexture(gl.TEXTURE_2D, gl.RGBA, width, height, { minFilter: gl.LINEAR, magFilter: gl.NEAREST });

// create an empty texture
var tex = createTexture(gl.TEXTURE_2D, gl.RGBA, width, height, { minFilter: gl.LINEAR, magFilter: gl.NEAREST });

// create a fbo and attac the texture to it
var fb = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);


gl.clearColor(1., 1., 1., 1.);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.viewport(0, 0, width, height);


simple.useProgram();

const projMatrix = ortho([], 0, width, 0, height, 1, -1);    // near z is positive

gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);
gl.activeTexture(gl.TEXTURE0);
tex2.bind();

gl.uniform1i(simple.uniforms.uSampler, 0);
gl.uniform2fv(simple.uniforms.uMousePos, [100, 100]);
gl.uniform3fv(simple.uniforms.uColor, [0., 0., 1.]);

simple.buffers.pos.bind();
simple.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

simple.buffers.uv.bind();
simple.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

simple.buffers.elements.bind();
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();


const rtt = createProgram('texture');
rtt.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, width, 0, width, height, 0, height]), gl.STATIC_DRAW);
rtt.buffers.uv = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
rtt.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


gl.bindFramebuffer(gl.FRAMEBUFFER, null);

rtt.useProgram();

gl.uniformMatrix4fv(rtt.uniforms.projMatrix, false, projMatrix);

gl.activeTexture(gl.TEXTURE1);
tex.bind();
gl.uniform1i(rtt.uniforms.uSampler, 1);

rtt.buffers.pos.bind();
rtt.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

rtt.buffers.uv.bind();
rtt.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

rtt.buffers.elements.bind();
gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

gl.flush();

let color = [Math.random(), Math.random(), Math.random()];

let down = false;
document.addEventListener('mousedown', () => {
    down = true;
    color = [Math.random(), Math.random(), Math.random()];
});

document.addEventListener('mousemove', (e) => {
    if (!down) {
        return;
    }
    let temp = tex;
    tex = tex2;
    tex2 = temp;

    simple.useProgram();

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex.texture, 0);

    gl.uniformMatrix4fv(simple.uniforms.projMatrix, false, projMatrix);
    gl.activeTexture(gl.TEXTURE0);
    tex2.bind();
    gl.uniform1i(simple.uniforms.uSampler, 0);
    gl.uniform2fv(simple.uniforms.uMousePos, [e.pageX, height - e.pageY]);
    gl.uniform3fv(simple.uniforms.uColor, color);

    simple.buffers.pos.bind();
    simple.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    simple.buffers.uv.bind();
    simple.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

    simple.buffers.elements.bind();
    gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);


    // update canvas
    rtt.useProgram();

    gl.uniformMatrix4fv(rtt.uniforms.projMatrix, false, projMatrix);

    gl.activeTexture(gl.TEXTURE1);
    tex.bind();
    gl.uniform1i(rtt.uniforms.uSampler, 1);

    rtt.buffers.pos.bind();
    rtt.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    rtt.buffers.uv.bind();
    rtt.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

    rtt.buffers.elements.bind();
    gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

    gl.flush();
});

document.addEventListener('mouseup', () => {
    if (down) {
        down = false;
    }
});

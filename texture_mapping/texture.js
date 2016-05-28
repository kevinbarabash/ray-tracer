const canvas = document.querySelector('canvas');

// TODO: make it so gl doesn't have to be a global
const gl = canvas.getContext('webgl');

let mouse = [0, 0];

const draw = (image) => {
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);

    const program = createProgram('texture');

    const attributes = {};
    const uniforms = {};
    const buffers = {};

    attributes.pos = gl.getAttribLocation(program, 'pos');
    attributes.uv = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(attributes.pos);
    gl.enableVertexAttribArray(attributes.uv);

    uniforms.projMatrix = gl.getUniformLocation(program, 'projMatrix');
    uniforms.mvMatrix = gl.getUniformLocation(program, 'mvMatrix');
    uniforms.uSampler = gl.getUniformLocation(program, "uSampler");

    const imgWidth = 500;
    const imgHeight = 333;

    buffers.pos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, imgWidth, 0, imgWidth, imgHeight, 0, imgHeight]), gl.STATIC_DRAW);

    buffers.uv = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), gl.STATIC_DRAW);

    buffers.elements = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.elements);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


    gl.viewport(0, 0, 512, 512);
    gl.clearColor(1., 1., 1., 1.);
    gl.clear(gl.COLOR_BUFFER_BIT);


    gl.useProgram(program);

    // TODO: add a model view matrix and rotate the image
    const projMatrix = ortho([], 0, 512, 0, 512, -1, 1);
    const identity = create();
    const mvMatrix = translate(identity, identity, [...mouse, 0]);

    // uniforms
    gl.uniformMatrix4fv(uniforms.projMatrix, false, projMatrix);
    gl.uniformMatrix4fv(uniforms.mvMatrix, false, mvMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uniforms.uSampler, 0);

    // vertex attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pos);
    gl.vertexAttribPointer(attributes.pos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uv);
    gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.elements);
    gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    const update = () => {
        const identity = create();
        const [x, y] = mouse;
        const mvMatrix = translate(identity, identity, [x - 250, y - 166, 0]);

        gl.uniformMatrix4fv(uniforms.mvMatrix, false, mvMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.elements);
        gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

        gl.flush();

        requestAnimationFrame(update);
    }

    update();
};

const image = new Image();
image.addEventListener('load', () => {
    console.log('image loaded');
    draw(image);
});
image.src = 'domo_kun.jpg';

let down = false;
document.addEventListener('mousedown', (e) => {
    mouse = [e.clientX, 512 - e.clientY];
    down = true;
});

document.addEventListener('mousemove', (e) => {
    if (down) {
        mouse = [e.clientX, 512 - e.clientY];
    }
});

document.addEventListener('mouseup', (e) => {
    if (down) {
        mouse = [e.clientX, 512 - e.clientY];
        down = false;
    }
});

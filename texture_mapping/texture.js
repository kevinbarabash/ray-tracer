const canvas = document.querySelector('canvas');

// TODO: make it so gl doesn't have to be a global
const gl = canvas.getContext('webgl');

let mouse = [0, 0];

const draw = (image) => {
    const texture = textureFromImage(gl.TEXTURE_2D, gl.RGBA, gl.UNSIGNED_BYTE, image);
    const program = createProgram('texture');

    const imgWidth = 500;
    const imgHeight = 333;

    program.buffers.pos = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 0, imgWidth, 0, imgWidth, imgHeight, 0, imgHeight]), gl.STATIC_DRAW);
    program.buffers.uv = createBuffer(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), gl.STATIC_DRAW);
    program.buffers.elements = createBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


    gl.viewport(0, 0, 512, 512);
    gl.clearColor(1., 1., 1., 1.);
    gl.clear(gl.COLOR_BUFFER_BIT);


    // gl.useProgram(program);
    program.useProgram();

    // TODO: add a model view matrix and rotate the image
    const projMatrix = ortho([], 0, 512, 0, 512, -1, 1);
    const mvMatrix = create();
    translate(mvMatrix, mvMatrix, [...mouse, 0]);

    // uniforms
    gl.uniformMatrix4fv(program.uniforms.projMatrix, false, projMatrix);
    gl.uniformMatrix4fv(program.uniforms.mvMatrix, false, mvMatrix);

    gl.activeTexture(gl.TEXTURE0);
    texture.bind();
    gl.uniform1i(program.uniforms.uSampler, 0);

    // vertex attributes
    program.buffers.pos.bind();
    program.attributes.pos.pointer(2, gl.FLOAT, false, 0, 0);

    program.buffers.uv.bind();
    program.attributes.uv.pointer(2, gl.FLOAT, false, 0, 0);

    program.buffers.elements.bind();
    gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    const pos = [0, 0, 0];

    const update = () => {
        const [x, y] = mouse;
        identity(mvMatrix);
        pos[0] = x - 250;
        pos[1] = y - 166;
        translate(mvMatrix, mvMatrix, pos);

        gl.uniformMatrix4fv(program.uniforms.mvMatrix, false, mvMatrix);

        program.buffers.elements.bind();
        gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_SHORT, 0);

        gl.flush();

        requestAnimationFrame(update);
    };

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
    mouse[0] = e.clientX;
    mouse[1] = 512 - e.clientY;
    down = true;
});

document.addEventListener('mousemove', (e) => {
    if (down) {
        mouse[0] = e.clientX;
        mouse[1] = 512 - e.clientY;
    }
});

document.addEventListener('mouseup', (e) => {
    if (down) {
        mouse[0] = e.clientX;
        mouse[1] = 512 - e.clientY;
        down = false;
    }
});

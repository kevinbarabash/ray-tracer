const canvas = document.createElement('canvas');
if (window.innerWidth < 512 || window.innerHeight < 512) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
} else {
    canvas.width = 512;
    canvas.height = 512;
}
document.body.appendChild(canvas);

const gl = canvas.getContext('experimental-webgl');

const program = createProgram('basic');

program.buffers.position = createBuffer(
    gl.ARRAY_BUFFER,
    new Float32Array([
        0, 0,
        100, 0,
        50, 100,
    ]),
    gl.STATIC_DRAW);

program.buffers.color = createBuffer(
    gl.ARRAY_BUFFER,
    new Float32Array(triangle_color = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ]),
    gl.STATIC_DRAW);

program.buffers.elements = createBuffer(
    gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2]), gl.STATIC_DRAW);


// UNIFORMS
var PROJMATRIX = ortho([], 0, 100, 0, 100, -1, 1);
var MOVEMATRIX = create();

gl.clearColor(0.0, 0.0, 0.0, 0.0);

gl.viewport(0.0, 0.0, canvas.width, canvas.height);

// TODO: using the same trick that the STEPS TCP/IP static uses
// create a parser to parse a data layout table, e.g.
//
// |---------------------------------------------------------|
// | position       | color         | bary                   |
// |---------------------------------------------------------|
// | x, y, z, _     | r, g, b, a    | u, v, w, _             |
// |---------------------------------------------------------|
//

var draw = function() {

    program.useProgram();

    // clear the canvas... without this you can accumulate drawing ops
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniformMatrix4fv(program.uniforms.Pmatrix, false, PROJMATRIX);
    gl.uniformMatrix4fv(program.uniforms.Mmatrix, false, MOVEMATRIX);

    const size = 2; // number of components per attribute, 2D vectors
    const strideInBytes = 2 * 4;    // two floats * 4 bytes per float
    program.buffers.position.bind();
    program.attributes.position.pointer(size, gl.FLOAT, false, strideInBytes, 0);

    program.buffers.color.bind();
    program.attributes.color.pointer(3, gl.FLOAT, false, 3 * 4, 0);

    program.buffers.elements.bind();
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

    gl.flush();
};

draw();

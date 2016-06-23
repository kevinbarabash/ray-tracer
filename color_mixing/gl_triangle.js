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

console.log(gl);


const load = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    return xhr.responseText;
};

const createShader = (code, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(`error compiling shader: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
};

const createProgram = (path) => {
    const vertCode = load(`${path}/vert.glsl`);
    const fragCode = load(`${path}/frag.glsl`);

    const vertShader = createShader(vertCode, gl.VERTEX_SHADER);
    const fragShader = createShader(fragCode, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);

    gl.linkProgram(program);

    return program;
};

const program = createProgram('basic');

// TODO: automatically grab all of this info from the shaders
var _position = gl.getAttribLocation(program, "position");
var _color = gl.getAttribLocation(program, "color");
var _bary = gl.getAttribLocation(program, "bary");

var _Pmatrix = gl.getUniformLocation(program, "Pmatrix");
var _Mmatrix = gl.getUniformLocation(program, "Mmatrix");
var _color1 = gl.getUniformLocation(program, "color1");
var _color2 = gl.getUniformLocation(program, "color2");
var _color3 = gl.getUniformLocation(program, "color3");

gl.enableVertexAttribArray(_position);
gl.enableVertexAttribArray(_color);
gl.enableVertexAttribArray(_bary);

// VERTICES
var triangle_vertex = [
    0, 0,
    100, 0,
    50, 100,
];

var triangle_bary = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];

var val = 1.0;
var triangle_color = [
    val, 0, 0,
    0, val, 0,
    0, 0, val,
];

var vertices = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_vertex), gl.STATIC_DRAW);

var bary = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bary);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_bary), gl.STATIC_DRAW);

var colors = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colors);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_color), gl.STATIC_DRAW);

var square_vertices = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, square_vertices);
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        -10, -10,
        10, -10,
        10, 10,
        -10, 10,
    ]),
    gl.STATIC_DRAW);


// FACES
var triangle_faces = [0, 1, 2, 3, 4, 5];
var faces = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faces);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangle_faces), gl.STATIC_DRAW);


var square_faces = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, square_faces);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 3]), gl.STATIC_DRAW);


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

    gl.useProgram(program);

    // clear the canvas... without this you can accumulate drawing ops
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
    gl.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);

    const val = 1.0;
    gl.uniform3fv(_color1, [val, 0.0, 0.0]);
    gl.uniform3fv(_color2, [0.0, val, 0.0]);
    gl.uniform3fv(_color3, [0.0, 0.0, val]);

    // gl.uniform3fv(_color, [1.0, 0.5, 0.0]);

    // draw triangles
    gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
    const size = 2; // number of components per attribute, 2D vectors
    const strideInBytes = 2 * 4;    // two floats * 4 bytes per float
    gl.vertexAttribPointer(_position, size, gl.FLOAT, false, strideInBytes, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, bary);
    // stride of 0 means that data is tightly packed
    gl.vertexAttribPointer(_bary, 3, gl.FLOAT, false, 3 * 4, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colors);
    gl.vertexAttribPointer(_color, 3, gl.FLOAT, false, 3 * 4, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faces);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

    gl.flush();
};

draw();

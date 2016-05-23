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

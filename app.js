/* global mat4 glMatrix */

// The Vertex Shader is a program in OpenGL Shading Language (GLSL)
// It basically is a function that runs on every vertex
const vertexShaderCode = `
precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

void main()
{
  fragColor = vertColor;
  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
`;

// The Fragment Shader is a program in GLSL. It is responsible
// for the color, basically. (Need to learn more)
const fragmentShaderCode = `
precision mediump float;

varying vec3 fragColor;

void main()
{
  gl_FragColor = vec4(fragColor, 1.0);
}
`;

// Function that is called in on load.
function initDemo() {
  const canvas = document.getElementById('c');

  // Resize canvas HTML element to window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let gl = canvas.getContext('webgl');

  if (!gl) {
    // Some browsers have only experimental support.
    console.log('WebGL not supported. Using Experimental WebGL.');
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    alert('Your browser does not support WebGL!');
    return;
  }

  // Adjust viewport to window size
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  // Clear window in purple
  gl.clearColor(0.5, 0.5, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Enable depth testing and face culling
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);


  // Create shaders
  // Prior to drawing, we need to compile the shaders.
  // This is due to OpenGL ES being a programmable shading interface

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.shaderSource(fragmentShader, fragmentShaderCode);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log('Error compiling vertexShader');
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log('Error compiling fragmentShader');
  }

  // Attach shaders to a GL program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  // Additional checking if everything went fine
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error linking program', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error('Error validating program', gl.getProgramInfoLog(program));
    return;
  }

  // Create buffer
  const pyramidVertices = [
    //     X,       Y,           Z,         R,   G,   B
    //
    // First face (base) - red
    /* */0.5, /**/0.0, /*   */-0.5, /*  */1.0, 0.0, 0.0,
    /* */0.5, /**/0.0, /*    */0.5, /*  */1.0, 0.0, 0.0,
    /**/-0.5, /**/0.0, /*    */0.5, /*  */1.0, 0.0, 0.0,
    /**/-0.5, /**/0.0, /*   */-0.5, /*  */1.0, 0.0, 0.0,
    //
    // Second face - green
    /* */0.5, /*    */0.0, /**/0.5, /*  */0.0, 1.0, 0.0,
    /* */0.0, /**/0.70711, /**/0.0, /*  */0.0, 1.0, 0.0,
    /**/-0.5, /*    */0.0, /**/0.5, /*  */0.0, 1.0, 0.0,
    //
    // Third face - blue
    /**/0.5, /*    */0.0, /**/-0.5, /*  */0.0, 0.0, 1.0,
    /**/0.0, /**/0.70711, /* */0.0, /*  */0.0, 0.0, 1.0,
    /**/0.5, /*    */0.0, /* */0.5, /*  */0.0, 0.0, 1.0,
    //
    // Forth face - yellow
    /**/-0.5, /*    */0.0, /**/-0.5, /* */1.0, 1.0, 0.0,
    /* */0.0, /**/0.70711, /* */0.0, /* */1.0, 1.0, 0.0,
    /* */0.5, /*    */0.0, /**/-0.5, /* */1.0, 1.0, 0.0,
    //
    // Fifth face - purple
    /**/-0.5, /*    */0.0, /* */0.5, /* */0.0, 1.0, 1.0,
    /* */0.0, /**/0.70711, /* */0.0, /* */0.0, 1.0, 1.0,
    /**/-0.5, /*    */0.0, /**/-0.5, /* */0.0, 1.0, 1.0,
  ];

  const pyramidIndices = [
    // First face - base
    0, 1, 2,
    0, 2, 3,
    // Second face
    4, 5, 6,
    // Third face
    7, 8, 9,
    // Fourth face
    10, 11, 12,
    // Fifth face
    13, 14, 15,
  ];

  // Upload vertices from RAM to graphics memory
  const pyramidVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidVertices), gl.STATIC_DRAW);

  const pyramidIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);

  // Vertices positions
  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttribLocation, // index
    3, // size
    gl.FLOAT, // type
    gl.FALSE, // normalized
    6 * Float32Array.BYTES_PER_ELEMENT, // stride
    0, // offset
  );

  // Color in the vertices
  const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    colorAttribLocation, // index
    3, // size
    gl.FLOAT, // type
    gl.FALSE, // normalized
    6 * Float32Array.BYTES_PER_ELEMENT, // stride
    3 * Float32Array.BYTES_PER_ELEMENT, // offset
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  // Bind program to WebGL
  gl.useProgram(program);

  // Initialize matrices
  const matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  const matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  const matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  const worldMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const projMatrix = new Float32Array(16);

  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [-1, 0, -3], [0, 0, 0], [0, 1, 0]);
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  // Rendering loop
  const identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);
  let angle = 0;
  function loop() {
    angle = ((performance.now() / 1000) / 6) * 2 * Math.PI;
    mat4.rotate(worldMatrix, identityMatrix, angle, [1, 0, 0]);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    // Clear canvas
    gl.clearColor(0.5, 0.5, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw again
    gl.drawElements(gl.TRIANGLES, pyramidIndices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

// The Vertex Shader is a program in OpenGL Shading Language (GLSL)
// It basically is a function that runs on every vertex
const vertexShaderCode = `
precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;

varying vec3 fragColor;

void main()
{
  fragColor = vertColor;
  gl_Position = vec4(vertPosition, 0.0, 1.0);
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
    // Some browser have only experimental support.
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
  const rectVertices = [
    // X, Y, R, G, B
    -0.5, -0.5, 1.0, 0.0, 0.0,
    0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, 0.5, 0.0, 0.0, 1.0,
    -0.5, 0.5, 0.0, 0.0, 0.0,
  ];

  // Upload verticex from RAM to graphics memory
  const rectVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectVertices), gl.STATIC_DRAW);

  // Vertices positions
  const positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttribLocation, // index
    2, // size
    gl.FLOAT, // type
    gl.FALSE, // normalized
    5 * Float32Array.BYTES_PER_ELEMENT, // stride
    0, // offset
  );

  // Color in the vertices
  const colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    colorAttribLocation, // index
    3, // size
    gl.FLOAT, // type
    gl.FALSE, // normalized
    5 * Float32Array.BYTES_PER_ELEMENT, // stride
    2 * Float32Array.BYTES_PER_ELEMENT, // offset
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  // Now is when the pixels are actually drawn
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

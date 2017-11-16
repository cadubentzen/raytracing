/* global mat4 glMatrix vertexShaderCode fragmentShaderCode */

// Function that is called on load.
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
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Clear window in purple
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
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
    return;
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log('Error compiling fragmentShader');
    return;
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


  // Create corners in a buffer
  // As this application relies on the fragment fragment buffer,
  // we only need to tell OpenGL to draw the whole area and the
  // pixels are processed individually (and in parallel) in the
  // fragment shader
  const corners = [
    //     X,        Y,
    /* */1.0, /* */1.0,
    /**/-1.0, /* */1.0,
    /**/-1.0, /**/-1.0,
    /* */1.0, /**/-1.0,
  ];

  // Upload vertices from RAM to graphics memory
  const cornersVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cornersVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(corners), gl.STATIC_DRAW);

  // Vertices
  const vertexPositionAttribLocation = gl.getAttribLocation(program, 'vertexPosition');
  gl.vertexAttribPointer(
    vertexPositionAttribLocation, // index
    2, // size
    gl.FLOAT, // type
    gl.FALSE, // normalized
    0, // stride
    0, // offset
  );

  gl.enableVertexAttribArray(vertexPositionAttribLocation);

  // Bind program to WebGL
  gl.useProgram(program);

  const ratioLocation = gl.getUniformLocation(program, 'ratio');
  const ratio = canvas.width / canvas.height;
  gl.uniform1f(ratioLocation, ratio);

  // Set properties
  const cameraPositionLocation = gl.getUniformLocation(program, 'cameraPosition');
  const sphereCenterLocation = gl.getUniformLocation(program, 'sphereCenter');
  const lightPositionLocation = gl.getUniformLocation(program, 'lightPosition');
  const radiusLocation = gl.getUniformLocation(program, 'radius');

  gl.uniform3f(cameraPositionLocation, 0.0, 0.0, 5.0);
  gl.uniform3f(sphereCenterLocation, 0.0, 0.0, 0.0);
  gl.uniform3f(lightPositionLocation, 1.0, 1.0, 1.0);
  gl.uniform1f(radiusLocation, 0.5);

  // Draw the screen
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

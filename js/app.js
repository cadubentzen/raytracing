/* global mat4 vec3 glMatrix vertexShaderCode fragmentShaderCode */

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
    console.log(
      'Error compiling vertexShader',
      gl.getShaderInfoLog(vertexShader),
    );
    return;
  }

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.log(
      'Error compiling fragmentShader',
      gl.getShaderInfoLog(fragmentShader),
    );
    return;
  }

  // Attach shaders to a GL program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  // Additional checking if everything went fine
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      'Error linking program',
      gl.getProgramInfoLog(program),
    );
    return;
  }

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error(
      'Error validating program',
      gl.getProgramInfoLog(program),
    );
    return;
  }


  // Create screen corners in a buffer
  // As this application relies on the fragment fragment buffer,
  // we only need to tell OpenGL to draw the whole area and the
  // pixels are processed individually (and in parallel) in the
  // fragment shader
  const screenCorners = [
    //     X,        Y,
    /* */1.0, /* */1.0,
    /**/-1.0, /* */1.0,
    /**/-1.0, /**/-1.0,
    /* */1.0, /**/-1.0,
  ];

  const screenCornersVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, screenCornersVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenCorners), gl.STATIC_DRAW);

  // Vertices
  const vertexPositionAttribLocation =
    gl.getAttribLocation(program, 'vertexPosition');

  gl.vertexAttribPointer(
    vertexPositionAttribLocation, // index
    2, // size
    gl.FLOAT, // type
    gl.FALSE, // normalized
    0, // stride
    0, // offset
  );

  gl.enableVertexAttribArray(vertexPositionAttribLocation);

  const nearVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nearVertexBufferObject);

  // Near vertices on attribute
  const nearPositionAttribLocation = gl.getAttribLocation(program, 'plotPosition');
  gl.vertexAttribPointer(
    nearPositionAttribLocation, // index
    3, // size
    gl.FLOAT, // type
    gl.FALSE, // normalized
    0, // stride
    0, // offset
  );

  gl.enableVertexAttribArray(nearPositionAttribLocation);

  // Bind program to WebGL
  gl.useProgram(program);

  // Set properties
  const cameraPositionLocation = gl.getUniformLocation(program, 'cameraPosition');
  const sphereCenterLocation = gl.getUniformLocation(program, 'sphereCenter');
  const lightPositionLocation = gl.getUniformLocation(program, 'lightPosition');
  const floorRadiusLocation = gl.getUniformLocation(program, 'floorRadius');
  const floorHeightLocation = gl.getUniformLocation(program, 'floorHeight');

  gl.uniform3f(sphereCenterLocation, 1.0, 0.0, 0.0);
  gl.uniform3f(lightPositionLocation, 5.0, 5.0, 5.0);
  gl.uniform1f(floorRadiusLocation, 50.0);
  gl.uniform1f(floorHeightLocation, -1.0);

  const up = vec3.fromValues(0.0, 1.0, 0.0);
  const cameraTo = vec3.fromValues(0.0, 0.0, 0.0);
  const cameraInitialPosition = vec3.fromValues(5.0, 0.0, 5.0);
  const cameraPosition = new Float32Array(3);

  const cameraDirection = new Float32Array(3);
  const cameraUp = new Float32Array(3);
  const cameraLeft = new Float32Array(3);

  const nearCenter = new Float32Array(3);
  const nearTopLeft = new Float32Array(3);
  const nearBottomLeft = new Float32Array(3);
  const nearTopRight = new Float32Array(3);
  const nearBottomRight = new Float32Array(3);

  const ratio = canvas.width / canvas.height;

  function renderLoop() {
    const angle = 2 * Math.PI * ((performance.now() / 1000.0) / 6.0);
    // Calc new camera position
    vec3.rotateY(cameraPosition, cameraInitialPosition, cameraTo, angle);

    gl.uniform3f(
      cameraPositionLocation,
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2],
    );

    // Calc new camera direction
    vec3.subtract(cameraDirection, cameraTo, cameraPosition);
    vec3.normalize(cameraDirection, cameraDirection);

    // Calc camera left vector
    vec3.cross(cameraLeft, up, cameraDirection);
    vec3.normalize(cameraLeft, cameraLeft);
    // Calc camera up vector
    vec3.cross(cameraUp, cameraDirection, cameraLeft);
    vec3.normalize(cameraUp, cameraUp);

    // Calc near plane center
    vec3.add(nearCenter, cameraPosition, cameraDirection);

    // Scale camera left to keep ratio
    vec3.scale(cameraLeft, cameraLeft, ratio);

    // Calc near corners
    // TopLeft
    vec3.add(nearTopLeft, nearCenter, cameraUp);
    vec3.add(nearTopLeft, nearTopLeft, cameraLeft);
    // BottomLeft
    vec3.subtract(nearBottomLeft, nearCenter, cameraUp);
    vec3.add(nearBottomLeft, nearBottomLeft, cameraLeft);
    // TopRight
    vec3.add(nearTopRight, nearCenter, cameraUp);
    vec3.subtract(nearTopRight, nearTopRight, cameraLeft);
    // BottomRight
    vec3.subtract(nearBottomRight, nearCenter, cameraUp);
    vec3.subtract(nearBottomRight, nearBottomRight, cameraLeft);

    const corners = new Float32Array(12);
    corners.set(nearTopRight, 0);
    corners.set(nearTopLeft, 3);
    corners.set(nearBottomLeft, 6);
    corners.set(nearBottomRight, 9);

    gl.bufferData(gl.ARRAY_BUFFER, corners, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    requestAnimationFrame(renderLoop);
  }

  requestAnimationFrame(renderLoop);
}

function initDemo() {
  const canvas = document.getElementById('c');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const gl = canvas.getContext('webgl');

  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  gl.clearColor(0.5, 0.5, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

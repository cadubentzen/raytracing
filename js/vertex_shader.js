// The Vertex Shader is a program in OpenGL Shading Language (GLSL)
// It basically is a function that runs on every vertex
//
// This is a template string (notice `)
const vertexShaderCode = `

precision mediump float;

attribute vec2 vertexPosition;
uniform float ratio;

varying vec3 vPosition;

void main()
{
  gl_Position = vec4(vertexPosition, 1.0, 1.0);
  if (ratio > 1.0) {
    vPosition = vec3(ratio*vertexPosition[0], vertexPosition[1], 1.0);
  } else {
    vPosition = vec3(vertexPosition[0], vertexPosition[1]/ratio, 1.0);
  }
}

`;

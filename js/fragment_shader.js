// The Fragment Shader is a program in GLSL. It is responsible
// for the color, basically. (Need to learn more)
//
// This is a template string (notice `)
const fragmentShaderCode = `

precision mediump float;

varying vec3 fragColor;

void main()
{
  gl_FragColor = vec4(fragColor, 1.0);
}

`;

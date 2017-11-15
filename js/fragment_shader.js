// The Fragment Shader is a program in GLSL. It is responsible
// for the color, basically. (Need to learn more)
//
// This is a template string (notice `)
const fragmentShaderCode = `

precision mediump float;

varying vec2 vPosition;

uniform float radius;

void main()
{
    // float radius = 0.5;
    float dist = distance(vPosition, vec2(0.0, 0.0)); 
    if (dist <= radius) {
        gl_FragColor = vec4(dist/radius, 0.0, 0.8, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}

`;

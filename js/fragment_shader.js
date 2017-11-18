// The Fragment Shader is a program in GLSL. It is responsible
// for the color, basically. (Need to learn more)
//
// This is a template string (notice `)
const fragmentShaderCode = `

precision mediump float;

varying vec3 nearPosition;

uniform vec3 cameraPosition;

uniform vec3 sphereCenter;
uniform float radius;

uniform vec3 lightPosition;

bool intersectSphere(vec3 rayDirection, out float dist)
{
   vec3 rayToSphere = sphereCenter - cameraPosition;
   float b = dot(rayDirection, -rayToSphere); 
   float d =  (b * b) - dot(rayToSphere, rayToSphere) + (radius * radius);

   if (d > 0.0) {
       dist = -b - sqrt(d);
       if (dist < 0.0) {
            dist = -b + sqrt(d);
            if (dist < 0.0)
                return false;
       }
       return true;
   } else {
       return false;
   }
}

void main()
{
    vec3 rayDirection = normalize(nearPosition - cameraPosition);

    float dist;
    if (intersectSphere(rayDirection, dist)) {
        vec3 intersectionPoint = cameraPosition + rayDirection*dist; 
        vec3 N = normalize(intersectionPoint - sphereCenter);
        vec3 L = normalize(lightPosition - intersectionPoint);
        vec3 R = reflect(-rayDirection, N);
        vec3 ambientColor = vec3(1.0, 0.0, 0.0);
        vec3 sourceColor = vec3(1.0, 1.0, 0.0);
        float ka = 0.7, kd = 0.9, ks = 0.6;
        float n = 5.0;
        vec3 color = ka * ambientColor 
                     + (kd * dot(L, N) 
                        + ks * pow(dot(-rayDirection, R), n)) * sourceColor;
        gl_FragColor = vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}

`;

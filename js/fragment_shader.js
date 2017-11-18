// The Fragment Shader is a program in GLSL. It is responsible
// for the color, basically. (Need to learn more)
//
// This is a template string (notice `)
const fragmentShaderCode = `

precision mediump float;

varying vec3 nearPosition;

uniform vec3 cameraPosition;

uniform vec3 sphereCenter;

uniform float floorHeight;
uniform float floorRadius;

uniform vec3 lightPosition;

bool intersectSphere(vec3 rayDirection, out vec3 V, out vec3 N, out vec3 L) {
  vec3 rayToSphere = sphereCenter - cameraPosition;
  float b = dot(rayDirection, -rayToSphere);
  float d = (b * b) - dot(rayToSphere, rayToSphere) + 1.0;

  if (d < 0.0) return false;

  float dist;
  dist = -b - sqrt(d);
  if (dist < 0.0) return false;

  vec3 intersectionPoint = cameraPosition + rayDirection * dist;
  V = -rayDirection;
  N = normalize(intersectionPoint - sphereCenter);
  L = normalize(lightPosition - intersectionPoint);

  return true;
}

bool intersectFloor(vec3 rayDirection, out vec3 V, out vec3 N, out vec3 L) {
  float dist = (floorHeight - cameraPosition.y) / rayDirection.y;
  if (dist < 0.0) return false;

  float x = cameraPosition.x + rayDirection.x * dist;
  float z = cameraPosition.z + rayDirection.z * dist;
  if (x*x + z*z > floorRadius*floorRadius) return false;

  vec3 intersectionPoint = vec3(x, floorHeight, z);
  V = -rayDirection;
  N = vec3(0.0, 1.0, 0.0);
  L = normalize(lightPosition - intersectionPoint);

  return true;
}

// bool intersectCube() {}

vec4 colorAt(vec3 Ia, vec3 Ii, vec3 V, vec3 N, vec3 L, 
             float ka, float kd, float ks, float n) {
  vec3 R = reflect(L, N);
  vec3 color = ka * Ia +
               (kd * dot(L, N) + ks * pow(dot(V, R), n)) * Ii;
  return vec4(color, 1.0);
}


void main()
{
  vec3 rayDirection = normalize(nearPosition - cameraPosition);

  vec3 V, N, L;

  if (intersectSphere(rayDirection, V, N, L)) {
    vec3 Ia = vec3(1.0, 0.0, 0.0);
    vec3 Ii = vec3(1.0, 1.0, 0.0);
    float ka = 0.7, kd = 0.9, ks = 0.6;
    float n = 5.0;
    gl_FragColor = colorAt(Ia, Ii, V, N, L, ka, kd, ks, n);
  } else if (intersectFloor(rayDirection, V, N, L)) {
    vec3 Ia = vec3(0.5, 0.5, 0.5);
    vec3 Ii = vec3(1.0, 1.0, 1.0);
    float ka = 0.8, kd = 0.3, ks = 0.4;
    float n = 5.0;
    gl_FragColor = colorAt(Ia, Ii, V, N, L, ka, kd, ks, n);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}

`;

// The Fragment Shader is a program in GLSL. It is responsible
// for the color, basically. (Need to learn more)
//
// This is a template string (notice `)
const fragmentShaderCode = `

precision mediump float;

varying vec3 nearPosition;

uniform vec3 cameraPosition;

uniform vec3 sphereCenter;

uniform vec3 cubeCornerCenter;

uniform float floorHeight;
uniform float floorRadius;

vec3 lightPosition;
  
vec3 Ii;
float ka, kd, ks;
float n;

bool intersectSphere(vec3 origin, vec3 rayDirection, out vec3 intersection,
                     out vec3 V, out vec3 N, out vec3 L) {
  vec3 rayToSphere = sphereCenter - origin;
  float b = dot(rayDirection, -rayToSphere);
  float d = (b * b) - dot(rayToSphere, rayToSphere) + 1.0;

  if (d < 0.0) return false;

  float dist;
  dist = -b - sqrt(d);
  if (dist < 0.0) return false;

  intersection = origin + rayDirection * dist;
  V = -rayDirection;
  N = normalize(intersection - sphereCenter);
  L = normalize(lightPosition - intersection);

  return true;
}

bool intersectFloor(vec3 origin, vec3 rayDirection, out vec3 intersection,
                    out vec3 V, out vec3 N, out vec3 L) {
  float dist = (floorHeight - origin.y) / rayDirection.y;
  if (dist < 0.0) return false;

  float x = origin.x + rayDirection.x * dist;
  float z = origin.z + rayDirection.z * dist;
  if (x*x + z*z > floorRadius*floorRadius) return false;

  intersection = vec3(x, floorHeight, z);
  V = -rayDirection;
  N = vec3(0.0, 1.0, 0.0);
  L = normalize(lightPosition - intersection);

  return true;
}

// bool intersectTriangle(vec3 rayDirection, vec3 A, vec3 B, vec3 C,
//                        out vec3 V, out vec3 N, out vec3 L) {
// 
// }

bool intersectCube(vec3 origin, vec3 rayDirection, out vec3 intersection,
                   out vec3 V, out vec3 N, out vec3 L) {
  return false;
}

vec3 colorAt(vec3 color, vec3 V, vec3 N, vec3 L, vec3 R) {
  vec3 rColor = 
    ka * color + (kd * dot(L, N) + ks * pow(dot(V, R), n)) * Ii;

  return rColor;
}

bool intersectSomething(vec3 origin, vec3 rayDirection, out vec3 intersection,
                        out vec3 N, out vec3 color, out vec3 reflectedColor) {
  vec3 V, L, R;
  if (intersectSphere(origin, rayDirection, intersection, V, N, L)) {
    reflectedColor = vec3(1.0, 0.0, 0.0);
  } else if (intersectCube(origin, rayDirection, intersection, V, N, L)) {
    reflectedColor = vec3(1.0, 0.0, 1.0);
  } else if (intersectFloor(origin, rayDirection, intersection, V, N, L)) {
    reflectedColor = vec3(0.0, 0.0, 0.0);
  } else {
    return false;
  } 

  R = reflect(L, N);
  color = colorAt(reflectedColor, V, N, L, R);
  return true;
}

void main() {
  lightPosition = vec3(50.0, 50.0, 50.0);
  vec3 rayDirection = normalize(nearPosition - cameraPosition);

  vec3 intersection1, intersection2;

  ka = 0.5; 
  kd = 0.4;
  ks = 0.6;
  n = 15.0;

  Ii = vec3(1.0);
  
  vec3 color, tempColor, colorMax, reflectedColor;
  vec3 N;

  if (intersectSomething(cameraPosition, rayDirection, intersection1, N, color, reflectedColor)) {
    colorMax = (reflectedColor + vec3(0.7))/1.7;
    rayDirection = reflect(rayDirection, N);
    if (intersectSomething(intersection1, rayDirection, intersection2, N, tempColor, reflectedColor)) {
      color += tempColor * colorMax;
    }
    gl_FragColor = vec4(color, 1.0); 
  } else {
    gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
  }
}

`;

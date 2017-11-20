// The Fragment Shader is a program in GLSL. It is responsible
// for the color, basically. (Need to learn more)
//
// This is a template string (notice `)
const fragmentShaderCode = `

precision mediump float;

varying vec3 nearPosition;

uniform vec3 cameraPosition;

uniform vec3 sphereCenter;

uniform vec3 cubeCenter;
vec3 A, B, C, D, E, F, G, H;


uniform float floorHeight;
uniform float floorRadius;

float cs;

vec3 lightPosition;
  
vec3 Ii;
float ka, kd, ks;
float n;

bool intersectSphere(vec3 origin, vec3 rayDirection, out vec3 intersection,
                     out float dist,
                     out vec3 V, out vec3 N, out vec3 L) {
  vec3 rayToSphere = sphereCenter - origin;
  float b = dot(rayDirection, -rayToSphere);
  float d = (b * b) - dot(rayToSphere, rayToSphere) + 1.0;

  if (d < 0.0) return false;

  dist = -b - sqrt(d);
  if (dist < 0.0) return false;

  intersection = origin + rayDirection * dist;
  V = -rayDirection;
  N = normalize(intersection - sphereCenter);
  L = normalize(lightPosition - intersection);

  return true;
}

bool intersectFloor(vec3 origin, vec3 rayDirection, out vec3 intersection,
                    out float dist,
                    out vec3 V, out vec3 N, out vec3 L) {
  dist = (floorHeight - origin.y) / rayDirection.y;
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

bool intersectTriangle(vec3 origin, vec3 rayDirection, out vec3 intersection,
                       out float dist,
                       vec3 A, vec3 B, vec3 C,
                       out vec3 V, out vec3 N, out vec3 L) {
    
    // adapted from Moller-Trumbore intersection algorithm pseudocode on wikipedia
    vec3 AB, AC; // Edge1, Edge2
    vec3 P, Q, T;
    float det, inv_det, u, v;
    float t;
    
    // vectors for edges sharing V1
    AB = B - A;
    AC = C - A;

    // begin calculating determinant - also used to calculate u param
    P = cross(rayDirection, AC);

    // if determinant is near zero, ray lies in plane of triangle
    det = dot(AB, P);
    // culling
    if (det < 0.0) return false;
    inv_det = 1.0 / det;

    // calculate distance from A to ray origin
    T = origin - A;

    // calculate u parameter and test bound
    u = dot(T, P) * inv_det;
    // the intersection lies outside of the triangle
    if (u < 0.0 || u > 1.0) return false;

    // prepare to test v parameter
    Q = cross(T, AB);

    // calculate v param and test bound
    v = dot(rayDirection, Q) * inv_det;

    // the intersection is outside the triangle?
    if (v < 0.0 || (u + v) > 1.0) return false;

    t = dot(AC, Q) * inv_det;

    if (t < 0.0) return false;

    dist = t;
    intersection = origin + t * rayDirection;
    V = -rayDirection;
    N = normalize(cross(AB, AC));
    L = normalize(lightPosition - intersection);

    return true;
}

bool intersectCube(vec3 origin, vec3 rayDirection, out vec3 intersection,
                   out float dist,
                   out vec3 V, out vec3 N, out vec3 L) {

  if (intersectTriangle(origin, rayDirection, intersection, dist, A, C, B, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, A, D, C, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, A, F, E, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, A, B, F, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, A, E, H, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, A, H, D, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, G, E, F, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, G, H, E, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, G, F, B, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, G, B, C, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, G, C, D, V, N, L))
    return true;
  else if (intersectTriangle(origin, rayDirection, intersection, dist, G, D, H, V, N, L))
    return true;

  return false;
}

vec3 colorAt(vec3 color, vec3 V, vec3 N, vec3 L, vec3 R) {
  vec3 rColor = 
    ka * color + (kd * dot(L, N) + ks * pow(dot(V, R), n)) * Ii;

  return rColor;
}

bool intersectSomething(vec3 origin, vec3 rayDirection, out vec3 intersection,
                        out vec3 N, out vec3 color, out vec3 reflectedColor) {
  float dist1, dist2;
  vec3 V, L, R;
  vec3 V2, N2, L2;
  vec3 intersection2;
  if (intersectSphere(origin, rayDirection, intersection, dist1, V, N, L)) {
    if (intersectCube(origin, rayDirection, intersection2, dist2, V2, N2, L2)) {
      if (dist2 < dist1) {
        intersection = intersection2;
        V = V2;
        N = N2;
        L = L2;
        reflectedColor = vec3(0.0, 1.0, 0.0);
      } else {
        reflectedColor = vec3(1.0, 0.0, 0.0);
      }
    } else {
      reflectedColor = vec3(1.0, 0.0, 0.0);
    }
  } else if (intersectCube(origin, rayDirection, intersection, dist1, V, N, L)) {
    reflectedColor = vec3(0.0, 1.0, 0.0);
  } else if (intersectFloor(origin, rayDirection, intersection, dist1, V, N, L)) {
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

  cs = 2.0;

  ka = 0.5; 
  kd = 0.4;
  ks = 0.6;
  n = 15.0;

  A = vec3(cubeCenter.x - cs/2.0, cubeCenter.y - cs/2.0,cubeCenter.z - cs/2.0);
  B = vec3(A.x, A.y, A.z + cs);
  C = vec3(A.x + cs, A.y, A.z + cs);
  D = vec3(A.x + cs, A.y, A.z);
  E = vec3(A.x, A.y + cs, A.z);
  F = vec3(A.x, A.y + cs, A.z + cs);
  G = vec3(A.x + cs, A.y + cs, A.z + cs);
  H = vec3(A.x + cs, A.y + cs, A.z);

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

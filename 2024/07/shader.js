// noprotect

// https://github.com/ZRNOF/Shox
import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.0.0/src/Shox.js"

export const frag = `#version 300 es
  precision mediump float;

  uniform sampler2D tex0;
  uniform vec2 texelSize;
  uniform vec2 canvasSize;
  uniform vec2 mouse;
  uniform float time;

  vec3 smin(vec3 a, vec3 b, float t) {
    vec3 c = clamp(.5+(a-b)/t, 0., 1.);
    return (1.-c)*(a-.5*t*c)+c*b;
  }

  vec3 smax(vec3 a, vec3 b, float t) {
    vec3 c = clamp(.5+(a-b)/-t, 0., 1.);
    return (1.-c)*(a-.5*-t*c)+c*b;
  }

  float circle(vec2 uv, vec2 pos, float r) {
    return length(uv-pos)-r;
  }

  vec2 rotate(vec2 uv, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat2 rot = mat2(c, -s, s, c);
    return rot*uv;
  }

  in vec2 vTexCoord;
  out vec4 fragColor;
  void main() {
    vec2 uv = 2.*vTexCoord-1.;
    if (canvasSize.x > canvasSize.y) uv.x *= canvasSize.x/canvasSize.y;
    else uv.y *= canvasSize.y/canvasSize.x;

    vec2 cruv = rotate(uv, +time*5.);

    vec2 iuv = floor(fract(uv*2.));

    vec2 ruv = fract(uv*2.)-.5;
    ruv = rotate(uv, +time*5.);

    float cM = circle(ruv, vec2(0.), 0.);
    float c1 = circle(ruv, vec2(+.5+.5*sin(time), 0.), .2);
    float c2 = circle(ruv, vec2(-.5+.5*sin(time), 0.), .2);
    cM = smoothstep(.5, .0, cM);
    c1 = smoothstep(.0, .5, c1);
    c2 = smoothstep(.0, .5, c2);

    vec3 col = vec3(-1.);
    col = smax(col, vec3(cM), .5);
    col = smin(col, vec3(c1), .5);
    col = smin(col, vec3(c2), .5);
    col = smoothstep(.05, .06, col);

    float r = .5+.5*sin(time+cruv.x);
    float g = cruv.y*cruv.x*.001;
    float b = .5+.5*cos(time+cruv.y);
    col += vec3(r, g, b);
    col = 1.-col;

    fragColor = vec4(col, 1.);
  }
`

export const broken = `#version 300 es
  precision mediump float;

  uniform sampler2D tex0;
  uniform vec2 texelSize;
  uniform vec2 canvasSize;
  uniform vec2 grid;
  uniform float weight;

  ${Shox.hash}
  ${Shox.displace}

  in vec2 vTexCoord;
  out vec4 fragColor;
  void main() {
    vec2 uv = vTexCoord;
    vec2 iuv = floor(uv*grid);
    vec2 duv = displace(uv, hash22(iuv), .5, weight);
    fragColor = texture(tex0, duv);
  }
`

export const vert = `#version 300 es

  in vec4 aPosition;
  in vec2 aTexCoord;

  out vec2 vTexCoord;

  void main() {
    vTexCoord = aTexCoord;
    gl_Position = aPosition;
  }
`

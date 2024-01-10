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

  ${Shox.hash}
  ${Shox.voronoi}
  ${Shox.pixelate}
  ${Shox.noiseMath}
  ${Shox.snoise3D}
  ${Shox.snoise3DImage}

  vec3 dust(vec2 uv, vec3 oriChannel, vec3 dustChannel, float wei) {
    oriChannel += dustChannel*wei;
    return oriChannel-wei/2.;
  }

  in vec2 vTexCoord;
  out vec4 fragColor;
  void main() {
    vec2 uv = (2.*gl_FragCoord.xy-canvasSize)/min(canvasSize.x, canvasSize.y);

    vec2 pos = vec2(.5, .5);
    vec2 grid = floor(vec2(16., 1.));
    vec4 voro = voronoi((uv+pos)*grid, vec2(time), 1.);

    vec2 puv = (floor((uv+pos)*grid)+voro.xy)/grid;
    puv = pixelate(puv, vec2(0.), grid);

    vec4 noise = snoise3DImage(puv, 1., 1., .5, 1., vec3(0., 0., time*.25));
    noise += .5*snoise3DImage(puv, 2., 4., .5, 1., vec3(0., 0., time*.25));
    noise /= 1.5;

    vec3 col = noise.rrr+vec3(0., .35, .5);
    col -= voro.w;
    col *= col;
    col *= voro.w;
    col /= voro.z;
    col = clamp(vec3(0.), vec3(1.), col);

    float hash = hash12(uv*3141.1234+1000.8090);
    fragColor = vec4(dust(uv, col, vec3(hash), .25), 1.);
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

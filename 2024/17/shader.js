// noprotect

import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.0.0/src/Shox.js"
import { sdf2D } from "./sdf2D.js"

export const frag = `#version 300 es
  precision mediump float;

  uniform sampler2D tex0;
  uniform vec2 canvasSize;
  uniform float time;

  ${Shox.iqPalette}
  ${Shox.hash}
  ${sdf2D}

  vec3 dust(vec2 uv, vec3 oriChannel, vec3 dustChannel, float wei) {
    oriChannel += dustChannel*wei;
    return oriChannel-wei/2.;
  }

  // ref: https://www.youtube.com/watch?v=VmrIDyYiJBA
  float Hexagon(vec2 uv) {
    uv = abs(uv);
    return max(uv.x, dot(uv, normalize(vec2(1., sqrt(3.)))));
  }

  // ref: https://www.youtube.com/watch?v=VmrIDyYiJBA
  vec4 HexCoord(vec2 uv) {
    vec2 r = vec2(1., sqrt(3.));
    vec2 h = r*.5;
    vec2 a = mod(uv, r)-h;
    vec2 b = mod(uv-h, r)-h;
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    return vec4(gv, uv-gv);
  }

  float ring(vec2 uv, vec2 pos, float size) {
    return abs(sdCircle(uv-pos, size));
  }

  float hexRing(vec2 uv, vec2 pos, float size) {
    return abs(Hexagon(uv-pos)-size);
  }

  float starRing(vec2 uv, vec2 pos, float size) {
    return abs(sdHexagram(uv-pos, size));
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
    vec2 uv = vTexCoord;
    uv -= .5;
    uv *= 2.;
    if (canvasSize.x>canvasSize.y) uv.x *= canvasSize.x/canvasSize.y;
    else uv.y *= canvasSize.y/canvasSize.x;

    uv *= 2.;
    vec2 huv = HexCoord(uv).xy;

    float ts = .5+.5*sin(time*.6);
    float tc = .5+.5*cos(time*.5)*.4+.1;

    float s = .5/sqrt(3.);
    float c = 1.;
    c = min(c, ring(huv, vec2(  .5,     s ), ts*.5+.2));
    c = min(c, ring(huv, vec2( -.5,     s ), ts*.5+.2));
    c = min(c, ring(huv, vec2(  .5,    -s ), ts*.5+.2));
    c = min(c, ring(huv, vec2( -.5,    -s ), ts*.5+.2));
    c = min(c, ring(huv, vec2(  0.,  2.*s ), ts*.5+.2));
    c = min(c, ring(huv, vec2(  0., -2.*s ), ts*.5+.2));
    c = min(c, hexRing(huv, vec2(  .5,     s ), tc));
    c = min(c, hexRing(huv, vec2( -.5,     s ), tc));
    c = min(c, hexRing(huv, vec2(  .5,    -s ), tc));
    c = min(c, hexRing(huv, vec2( -.5,    -s ), tc));
    c = min(c, hexRing(huv, vec2(  0.,  2.*s ), tc));
    c = min(c, hexRing(huv, vec2(  0., -2.*s ), tc));
    c = min(c, starRing(rotate(huv, sin(time)), vec2(0.), ts*.2));
    c = clamp(.0125/abs(c)*(dot(uv, uv)+.5), 0., 1.);

    vec3 col = palette(c, vec3(.7), vec3(1.), vec3(1.), vec3(.0, .1, .2));
    col *= col;
    col = dust(uv, col, vec3(hash12(uv*314159.26)), .25);

    fragColor = vec4(col, 1.);
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

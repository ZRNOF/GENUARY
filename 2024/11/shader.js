// noprotect

// https://github.com/ZRNOF/Shox
import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.0.0/src/Shox.js"

export const frag = `#version 300 es
  precision mediump float;

  uniform sampler2D tex0;
  uniform vec2 texelSize;
  uniform vec2 canvasSize;
  uniform vec3 color;

  ${Shox.flip}
  ${Shox.noiseMath}
  ${Shox.snoise3D}
  ${Shox.snoise3DImage}

  float Rectangle(vec2 uv, vec2 pos, vec2 size) {
    uv -= pos;
    vec2 d = abs(uv)-size/2.;
    return smoothstep(.0001, .0, max(d.x, d.y));
  }

  vec4 OVER(vec4 base, vec4 blend) {
    return (1. - blend.a) * base + blend.a * blend;
  }

  in vec2 vTexCoord;
  out vec4 fragColor;
  void main() {
    vec2 uv = vTexCoord;
    vec2 ouv = uv;
    uv = (uv-.5)*1.2+.5;

    vec4 ori = texture(tex0, uv);
    ori.a *= mix(0., 1., ori.r);
    ori.rgb *= color;

    vec2 ruv = flipX(flipY(uv - .02));
    vec4 flp = texture(tex0, ruv);
    flp.rgb = 1.-flp.rgb*.07;

    float rect = Rectangle(ouv, vec2(.5), vec2(.84));
    vec4 RECT = vec4(.9, .9, .85, 1.) * rect;

    float bg = Rectangle(ouv, vec2(.5), vec2(1.));
    vec4 BG = vec4(vec3(.95), 1.) * bg;

    float noise = 1.;
    noise *= 1.-.02*snoise3DImage(ouv*vec2(.05, 1.), 200., 1.5, .5, vec3(0.)).r;
    noise *= 1.-.02*snoise3DImage(ouv*vec2(1., .05), 200., 1.5, .5, vec3(0.)).r;
    noise *= 1.-.02*snoise3DImage(ouv*vec2(1.,  1.),  10., 1.5, .5, vec3(0.)).r;

    vec4 color = OVER(OVER(BG, RECT), ori);
    color *= flp;
    color.rgb *= noise;

    fragColor = color;
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

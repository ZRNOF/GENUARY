// noprotect

// https://github.com/ZRNOF/Shox
import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.0.0/src/Shox.js"

export const frag = `#version 300 es
  precision highp float;

  uniform sampler2D tex0;
  uniform vec2 texelSize;
  uniform vec2 canvasSize;
  uniform float posX[15];
  uniform float posY[15];
  uniform float posZ[15];

  ${Shox.zcPalette(2)}

  in vec2 vTexCoord;
  out vec4 fragColor;
  void main() {
    vec2 uv = (vTexCoord - .5) * 2.;
    if (canvasSize.x>canvasSize.y)
      uv.x *= canvasSize.x/canvasSize.y;
    else
      uv.y *= canvasSize.y/canvasSize.x;

    float tot = 0.;
    for (int i = 0; i < 15; i++) {
      tot += .05/length(
        vec3(uv, 0.)-
        vec3(posX[i]*1.2, posY[i]*1.2, .75*posZ[i])
      );
    }

    vec4 colors[] = vec4[](
      vec4(0., 0., 0., 1.),
      vec4(0., 1., 1.5, 1.)
    );
    float cPos[] = float[](0., 1.);
    vec3 color = palette(clamp(tot, 0., 1.), colors, cPos).rgb;

    color = pow(color, vec3(2.));

    fragColor = vec4(color, 1.);
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

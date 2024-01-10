// noprotect

// https://github.com/ZRNOF/Shox
import * as Shox from "https://cdn.jsdelivr.net/npm/shox@1.0.0/src/Shox.js"

const random = (min = 0, max = 1) => {
	return Math.random() * (max - min) + min
}

export const frag = `#version 300 es
  precision mediump float;

  uniform sampler2D tex0;
  uniform vec2 texelSize;
  uniform vec2 canvasSize;
  uniform vec2 mouse;
  uniform float time;

  uniform vec2 iGrid;
  uniform sampler2D iAtlas;
  uniform vec2 iAtlasGrid;
  uniform float iLength;

  ${Shox.noiseMath}
  ${Shox.snoise3D}
  ${Shox.gradient}
  ${Shox.pixelate}
  ${Shox.mapFunc}
  ${Shox.zcPalette(5)}
  ${Shox.iqPalette}

  vec4 sprite(vec2 uv, sampler2D atlas, vec2 atlasGrid, float id) {
    uv /= atlasGrid;
    uv += vec2(mod(id, atlasGrid.x), floor(id / atlasGrid.x))/atlasGrid;
    return texture(atlas, uv);
  }

  in vec2 vTexCoord;
  out vec4 fragColor;
  void main() {
    float t = time*0.1;
    vec2 uv = vTexCoord;
    uv -= 0.5;
    uv.x *= canvasSize.x/canvasSize.y;
    uv.y -= time*0.25;

    vec2 fuv = fract(uv*iGrid);
    vec2 iuv = floor(uv*iGrid);
    vec2 puv = pixelate(uv, iGrid);

    float flow = .5+.5*snoise(vec3(puv, t));

    float id = floor(map(flow, 0., 1., 0., iLength));
    vec4 col = sprite(fuv, iAtlas, iAtlasGrid, id);

    vec3 pal = palette( flow, vec3(.5), vec3(.5), vec3(1.),
      vec3( ${random(0, 1)}, ${random(0, 1)}, ${random(0, 1)} )
    );

    ${random(0, 1) < 0.5 ? "col.rgb *= pal+0.2;" : ""}

    fragColor = col;
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

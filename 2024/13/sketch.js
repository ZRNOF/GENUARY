// 魔 © 2024-01-13 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.1.1/src/p5.flex.min.mjs"
import { vert, frag } from "./shader.js"

mountFlex(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [p.windowWidth, p.windowHeight]
	const PIXEL_DENSITY = 1
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	let gfx, theShader

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex()

		p.pixelDensity(PIXEL_DENSITY)

		gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		theShader = p.createShader(vert, frag)

		p.noStroke()
		gfx.noStroke()
	}

	p.draw = () => {
		p.background(255)
		gfx.background(0)

		gfx.shader(theShader)
		theShader.setUniform("tex0", p._renderer)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("texelSize", TEXEL_SIZE)
		theShader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT])
		theShader.setUniform("time", p.frameCount / 60)
		gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		p.image(gfx, 0, 0)
	}
})

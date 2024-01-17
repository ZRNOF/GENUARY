// Scope © 2024-01-18 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"
import { vert, frag } from "./shader.js"

mountFlex(p5)

new p5((p) => {
	let WIDTH, HEIGHT, PIXEL_DENSITY, CANVAS_SIZE
	let gfx, theShader

	const init = () => {
		;[WIDTH, HEIGHT] = [p.windowWidth, p.windowHeight]
		PIXEL_DENSITY = 1
		CANVAS_SIZE = [WIDTH, HEIGHT]
	}

	p.setup = () => {
		init()
		p.createCanvas(WIDTH, HEIGHT)
		p.flex()

		p.pixelDensity(PIXEL_DENSITY)

		gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		theShader = p.createShader(vert, frag)

		p.noStroke()
		gfx.noStroke()

		p.containerBgColor(51)
		p.parentBgColor(51)
	}

	p.draw = () => {
		p.background(255)
		gfx.background(0)

		gfx.shader(theShader)
		theShader.setUniform("tex0", p._renderer)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("time", p.frameCount / 60)
		gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		p.image(gfx, 0, 0)
	}

	p.windowResized = () => {
		init()
		p.resizeCanvas(WIDTH, HEIGHT)
		p.pixelDensity(PIXEL_DENSITY)
		gfx.resizeCanvas(WIDTH, HEIGHT)
	}
})

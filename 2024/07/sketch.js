// Oh Sh*t. © 2024-01-07 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.1.1/src/p5.flex.min.mjs"
import { vert, frag, broken } from "./shader.js"

mountFlex(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [600, 600]
	const PIXEL_DENSITY = 1
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	const textPos = [WIDTH / 2, (HEIGHT / 5) * 4]
	let gfx, theShader, brokenShader
	let grid
	let count = 0
	let weight = 0

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		// make p5 canvas responsive
		p.flex({ container: { padding: "20px" } })

		p.pixelDensity(PIXEL_DENSITY)

		gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		theShader = p.createShader(vert, frag)
		brokenShader = p.createShader(vert, broken)

		p.noStroke()
		gfx.noStroke()

		p.textAlign(p.CENTER, p.CENTER)
		p.textSize(50)
		p.stroke(0)
		p.strokeWeight(5)
		p.textFont("Courier New")
	}

	p.draw = () => {
		if (count <= 99) {
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
			p.text(`${p.floor(count)}%`, ...textPos)
			if (count === 99) {
				weight = p.random(0.1, 1)
				grid = [p.random(1, 20), p.random(1, 20)]
			}
		} else if (count < 130) {
			p.image(gfx, 0, 0)
			p.text(`99%`, ...textPos)
		} else if (count < 160) {
			gfx.shader(brokenShader)
			brokenShader.setUniform("tex0", gfx)
			brokenShader.setUniform("canvasSize", CANVAS_SIZE)
			brokenShader.setUniform("texelSize", TEXEL_SIZE)
			brokenShader.setUniform("grid", grid)
			brokenShader.setUniform("weight", weight)
			gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)
			p.image(gfx, 0, 0)
		} else {
			count = 0
		}
		count += 0.5
	}
})

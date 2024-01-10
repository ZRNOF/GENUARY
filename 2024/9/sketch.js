// ASCII © 2024-01-09 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.1.1/src/p5.flex.min.mjs"
import { vert, frag } from "./shader.js"

mountFlex(p5)

new p5((p) => {
	// prettier-ignore
	const emojis = [" ", ".", ":", "-", "=", "+", "#", "%", "8", "*", "H", "M", "#", "X"]

	const [WIDTH, HEIGHT] = [2000, 1000]
	const PIXEL_DENSITY = 1
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	let gfx, theShader

	let atlas = { atlas: null, cols: 0, rows: 0 }

	const cols = 16
	const rows = 16

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT, p.WEBGL)
		// make p5 canvas responsive
		p.flex({ container: { padding: "20px" } })

		p.pixelDensity(PIXEL_DENSITY)

		gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		theShader = p.createShader(vert, frag)

		p.noStroke()
		gfx.noStroke()

		p.textFont("Consolas")
		atlas = getAtlas({
			array: emojis,
			cols: 5,
			unitSize: 256,
		})
	}

	p.draw = () => {
		p.background(255)
		gfx.background(0)

		// use shader on gfx
		gfx.shader(theShader)
		theShader.setUniform("tex0", p._renderer)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("texelSize", TEXEL_SIZE)
		theShader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT])
		theShader.setUniform("time", p.frameCount / 60)
		theShader.setUniform("iGrid", [cols, rows])
		theShader.setUniform("iAtlas", atlas.atlas)
		theShader.setUniform("iAtlasGrid", [atlas.cols, atlas.rows])
		theShader.setUniform("iLength", emojis.length)
		gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		// paste gfx to canvas
		// p.image(gfx, 0, 0)

		const t = p.frameCount * 0.01
		p.background(0)
		p.rotateZ(p.sin(t) + p.cos(t))
		p.rotateY(p.map(p.sin(t), -1, 1, -0.35, 0.35))
		p.rotateX(p.map(p.cos(t), -1, 1, -0.35, 0.35))
		p.texture(gfx)
		
		const size = p.max(WIDTH, HEIGHT)
		p.box(size, size, size * 4)
	}

	const getAtlas = ({ array, cols, unitSize, unitScale = 0.8 }) => {
		const rows = p.ceil(emojis.length / cols)
		const gfx = p.createGraphics(unitSize * cols, unitSize * rows)
		gfx.fill(255)
		gfx.stroke(255)
		gfx.textAlign(p.CENTER, p.CENTER)
		gfx.textSize(unitSize * unitScale)
		array.forEach((value, index) => {
			gfx.text(
				value,
				unitSize / 2 + unitSize * (index % cols),
				unitSize / 2 + unitSize * gfx.floor(index / cols)
			)
		})
		return { atlas: gfx, cols: cols, rows: rows }
	}
})

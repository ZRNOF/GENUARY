// 融 © 2024-01-12 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.1.1/src/p5.flex.min.mjs"
import { createNoise2D } from "https://cdn.skypack.dev/simplex-noise@4.0.0"
import { vert, frag } from "./shader.js"

mountFlex(p5)

new p5((p) => {
	const simplexNoiseSeed = p.random()
	const noise2D = createNoise2D(() => simplexNoiseSeed)
	const noise = (t, xOff, yOff) => noise2D(p.cos(t) + xOff, p.sin(t) + yOff)

	const loopFrames = 4500
	let WIDTH, HEIGHT
	let PIXEL_DENSITY, CANVAS_SIZE, TEXEL_SIZE

	let cnv, gfx, theShader
	const pos = {
		x: [],
		y: [],
		z: [],
	}

	p.setup = () => {
		init(p.windowWidth, p.windowHeight, 1)

		p.createCanvas(WIDTH, HEIGHT)
		p.flex()

		cnv = p.getCanvas()

		p.pixelDensity(PIXEL_DENSITY)

		gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		theShader = p.createShader(vert, frag)

		p.noStroke()
		gfx.noStroke()

		for (let i = 0; i < 15; i++) {
			pos.x.push([p.random(1000), p.random(1000)])
			pos.y.push([p.random(1000), p.random(1000)])
			pos.z.push([p.random(1000), p.random(1000)])
		}
	}

	p.draw = () => {
		const t = (p.frameCount - 1) / loopFrames
		p.background(255)
		gfx.background(0)

		gfx.shader(theShader)
		theShader.setUniform("tex0", p._renderer)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("texelSize", TEXEL_SIZE)
		theShader.setUniform("posX", getPos(p.TWO_PI * t, pos.x))
		theShader.setUniform("posY", getPos(p.TWO_PI * t, pos.y))
		theShader.setUniform("posZ", getPos(p.TWO_PI * t, pos.z))
		gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		p.image(gfx, 0, 0)
	}

	p.windowResized = () => {
		init(p.windowWidth, p.windowHeight)
		p.resizeCanvas(WIDTH, HEIGHT, 1)
		gfx.resizeCanvas(WIDTH, HEIGHT, p.WEBGL)
	}

	const init = (width, height, density) => {
		;[WIDTH, HEIGHT] = [width, height]
		PIXEL_DENSITY = density
		CANVAS_SIZE = [WIDTH, HEIGHT]
		TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	}

	const getPos = (t, arr) => arr.map((off) => noise(t, off[0], off[1]))
})

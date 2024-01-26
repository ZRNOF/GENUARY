// 般若波羅蜜多心經 © 2024-01-26 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.min.mjs"
import { mountControl } from "./Control.js"
import { vert, frag } from "./shader.js"
import HeartSutra from "./HeartSutra.js"

mountFlex(p5)
mountControl(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [1200, 600]
	const PIXEL_DENSITY = 1
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	let gfx, theShader

	const charSize = HEIGHT * 0.75
	let isBorder = true
	let index = 0
	let [pStatus, status] = [0, 0]

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex({ container: { width: "90%", height: "75%" } })
		p.pixelDensity(PIXEL_DENSITY)

		gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		theShader = p.createShader(vert, frag)

		p.noStroke()
		gfx.noStroke()
		p.containerBgColor(51)
		p.parentBgColor(51)

		p.PressDo("s", () => p.save("Naraka.png"))
		p.PressDo("b", () => (isBorder = !isBorder))
		p.PressLoopToggle(" ")
	}

	p.draw = () => {
		p.background(255, 10)
		gfx.background(0)

		const t = p.frameCount / 60
		const st = slideTrans(0.2 * t)
		const color = 255 * p.lerp(0, 1.5, st)
		;[pStatus, status] = [status, st]
		status < pStatus && (index += 1)

		char(WIDTH / 2, HEIGHT / 2, charSize, color, 2)
		isBorder && Border("#FFF", 45)

		gfx.shader(theShader)
		theShader.setUniform("tex0", p._renderer)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("texelSize", TEXEL_SIZE)
		theShader.setUniform("mouse", [p.mouseX / WIDTH, p.mouseY / HEIGHT])
		theShader.setUniform("time", t)
		gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		p.image(gfx, 0, 0)
	}

	const char = (w, h, size, color, thickness) => {
		p.push()
		p.stroke(color, color)
		p.noFill()
		p.strokeWeight(thickness)
		p.textSize(size)
		p.textAlign(p.CENTER, p.CENTER)
		p.textFont("標楷體")
		p.text(HeartSutra[index], w, h)
		p.pop()
	}

	const slideTrans = (t) =>
		p.floor(t % 2)
			? 0.5 + 0.5 * p.cos(p.PI * t)
			: 0.5 + 0.5 * p.cos(p.PI * t + p.PI)

	const Border = (color, weight) => {
		p.push()
		p.noFill()
		p.stroke(color)
		p.strokeWeight(weight * 2)
		p.rectMode(p.CENTER)
		p.rect(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT)
		p.pop()
	}
})

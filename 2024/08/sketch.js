// 域 © 2024-01-08 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
//
// Inspired by Daniel Shiffman
// References: https://youtu.be/uWzPe_S-RVE?si=ygblFkwXWJfDkm9P
//             https://www.myphysicslab.com/pendulum/double-pendulum-en.html

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.1.1/src/p5.flex.min.mjs"
import mountShadow from "./Shadow.js"
import mountSubDivide from "./subDivide.js"
import { rod, DoublePendulum } from "./DoublePendulum.js"

mountFlex(p5)
mountShadow(p5)
mountSubDivide(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [2000, 1000]
	const bg = p.random(["#fff", "#000"])
	const fg = p.random(["#0ff", "#f00", "#ff0"])
	const blocks = []
	const dps = []

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex({ container: { padding: "20px" } })
		p.background(0)
		p.subDivide(blocks, 0, 0, p.width, p.height)

		blocks.forEach((block) => {
			const side = p.max(block.w, block.h)
			const scale = side / WIDTH

			const pos = [block.x + block.w / 2, block.y + block.h / 2]
			const len = side / 4
			const g = p.random(-1, 1) * scale
			const angle = p.random(
				block.w > block.h ? [0, p.PI] : [-p.PI / 2, p.PI / 2]
			)

			const r1 = rod(len, 10, p.random(-p.PI / 2, p.PI / 2))
			const r2 = rod(len, 10, p.random(-p.PI / 2, p.PI / 2))
			dps.push(DoublePendulum(r1, r2, pos, g, angle))
		})
	}

	p.draw = () => {
		dps.forEach((dp) => {
			p.push()
			p.translate(...dp.pos)
			p.rotate(dp.angle)
			p.shadow(fg, p.random(50))
			p.stroke(255, p.random(127, 255))
			p.strokeWeight(p.random(2))
			const d = dp.calc()
			if (p.random() < 0.5) p.point(d.x2, d.y2)
			p.pop()
		})
		if (p.frameCount === 3000) p.noLoop()
	}
})

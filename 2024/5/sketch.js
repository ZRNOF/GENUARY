// Contour © 2024-01-05 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/
// Inspired by Vera Molnár

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.1.1/src/p5.flex.min.mjs"
import mountGrid from "./Grid.js"
import mountShadow from "./Shadow.js"

mountFlex(p5)
mountGrid(p5)
mountShadow(p5)

new p5((p) => {
	const [white, black, cyan] = ["#e2e2e2", "#070707", "#00ffff"]
	const gap = 20
	let gs
	let t

	p.setup = () => {
		p.createCanvas(800, 400)
		// make p5 canvas responsive
		p.flex({ container: { padding: "20px" } })

		p.noStroke()
		p.frameRate(30)
		gs = p.Grid({ cols: 1, rows: 20 })
	}

	p.draw = () => {
		t = ease(p.frameCount * 0.02)
		p.background(white)
		gs.generate(content)
	}

	const content = (cell) => {
		p.push()
		p.randomSeed(cell.id * 1000)
		p.fill(black)
		p.shadow(p.random([white, black, cyan]), 10)

		p.beginShape()
		p.vertex(0, 0) // top-left
		// TOP
		for (let x = gap; x < cell.w; x += gap) {
			const posX = p.lerp(x, x + p.random(-25, 25), t)
			const posY = p.lerp(0, p.random(-5, 10), t)
			p.vertex(posX, posY)
		}
		p.vertex(cell.w, 0) // top-right
		p.vertex(cell.w, cell.h) // bottom-right
		// BOTTOM
		for (let x = cell.w - gap; x > 0; x -= gap) {
			const posX = p.lerp(x, x + p.random(-25, 25), t)
			const posY = p.lerp(cell.h, cell.h + p.random(-10, 5), t)
			p.vertex(posX, posY)
		}
		p.vertex(0, cell.h) // bottom-left
		p.endShape(p.CLOSE)
		p.pop()
	}

	// ease by ChatGPT
	const ease = (t) => {
		if (t === 0 || t === 1) return t
		return Math.pow(2, -10 * t) * p.sin((t * 8 * p.TWO_PI) / 2.5) + 1
	}
})

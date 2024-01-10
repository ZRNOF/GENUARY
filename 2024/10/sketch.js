// Cu6e © 2024-01-10 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.1.1/src/p5.flex.min.mjs"

mountFlex(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [400, 400]

	const bg = [p.random(255), p.random(255), p.random(255)]
	const ambLight = [bg[0] + 50, bg[1] + 50, bg[2] + 50]
	const dirLight = [255, 255, 255]

	const a54 = p.PI / 3.333333333
	const a45 = p.PI / 4
	const size = 95
	let seed = p.random(2024)

	const oddr = 5
	const evenr = 6
	const oddc = 9
	const evenc = 10

	let cardioidParam = [-1, -1, true]
	const loopFrames = 250

	const pos = Array.from({ length: oddr + evenr })

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT, p.WEBGL)
		p.pixelDensity(4)
		p.flex({ container: { padding: "20px" } })

		// prettier-ignore
		p.ortho(-WIDTH * 2, WIDTH * 2, -HEIGHT * 2, HEIGHT * 2, 0.001, 10000)

		let id = 0 // Odd
		for (let j = -(oddr - 1) / 2; j <= (oddr - 1) / 2; j++) {
			for (let i = -(oddc - 1) / 2; i <= (oddc - 1) / 2; i++) {
				pos[id] = [size * (i + j), size * (-i + j), size * 2 * -j]
				id += 2
			}
		}

		id = 1 // Even
		for (let j = -evenr / 2; j < evenr / 2; j++) {
			for (let i = -evenc / 2 + 1; i <= evenc / 2; i++) {
				// prettier-ignore
				pos[id] = [size * (i + j), size * (-i + j + 1), -j * (size * 2) - size]
				id += 2
			}
		}
	}

	p.draw = () => {
		const t = (p.frameCount - 1) / loopFrames

		p.background(...bg)
		p.noStroke()

		const lp = cardioid(t, ...cardioidParam)
		p.ambientLight(...ambLight)
		p.directionalLight(...dirLight, lp.x, lp.y, -1)
		p.orbitControl(1, 1, 1, { freeRotation: true })

		const rx = p.map(p.cos(p.TWO_PI * t), -1, 1, 0.001, a54)
		const rz = p.map(p.cos(p.TWO_PI * t), -1, 1, 0.001, a45)

		p.randomSeed(seed)
		pos.forEach((po, index) => {
			p.push()
			translate(...po)
			p.rotateX(rx * p.random([-1, 1]))
			p.rotateZ(rz * p.random([-1, 1]))
			const n = p.noise(
				index,
				index + 100,
				p.cos(p.TWO_PI * t) * 0.5,
				p.sin(p.TWO_PI * t) * 0.5
			)
			p.box(size * p.min(p.map(n, 0, 1, 0.1, 1.5), 1) * 0.95)
			p.pop()
		})

		if (p.frameCount % loopFrames === 0) {
			seed = getSeed()
			cardioidParam = getCardioidParam()
		}
	}

	const getSeed = () => {
		return p.random(2024)
	}

	const getCardioidParam = () => {
		return [p.random([-1, 1]), p.random([-1, 1]), p.random([false, true])]
	}

	const translate = (x, y, z) => {
		p.rotateX(a54)
		p.rotateZ(a45)
		p.translate(x, y, z)
		p.rotateZ(-a45)
		p.rotateX(-a54)
	}

	// prettier-ignore
	const cardioid = (t, v, h, q) => ({
		x: h * 2 * (1 - p.cos(p.TWO_PI * t)) * (q ? p.sin(p.TWO_PI * t) : p.cos(p.TWO_PI * t)),
		y: v * 2 * (1 - p.cos(p.TWO_PI * t)) * (q ? p.cos(p.TWO_PI * t) : p.sin(p.TWO_PI * t)),
	})
})

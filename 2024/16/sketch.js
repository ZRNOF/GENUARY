// 跡 © 2024-01-16 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { createNoise4D } from "https://cdn.skypack.dev/simplex-noise@4.0.0"
import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.2.0/src/p5.flex.mjs"
import mountSpaceDivide from "./spaceDivide.js"
import colorURLs from "./colorChart.js"
import PaletteFrom from "./PaletteFrom.js"

mountFlex(p5)
mountSpaceDivide(p5)

new p5((p) => {
	const simplexNoiseSeed = p.random()
	const noise4D = createNoise4D(() => simplexNoiseSeed)
	const PHI = 1.6180339887

	// total = nodeNum * novaNum = 10000
	const nodeNum = p.random([10, 100, 1000])
	const novaNum = 10000 / nodeNum
	const novas = []

	const minSpace = p.random([50, 100, 150])
	const strokeWeight = p.floor(minSpace / 5)
	const randomStrokeWeight = p.random([true, false])
	const palette = PaletteFrom(p.random(colorURLs))
	const bg = p.random(["#000000", "#ffffff", p.random(palette)])
	const useDivide = p.random() < 0.33333 ? false : true
	const HALF = p.random([true, false])
	const [WIDTH, HEIGHT] =
		p.windowWidth < p.windowHeight
			? [600, p.floor(600 * PHI)]
			: [p.floor(600 * PHI), 600]

	const blocks = []

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex({ container: { padding: "20px" } })

		p.background(bg)
		p.containerBgColor(bg)
		p.parentBgColor(bg)

		p.rectMode(p.CENTER)

		for (let i = 0; i < novaNum; i++) {
			novas.push({
				pos: [p.random(WIDTH), p.random(HEIGHT)],
				rot: p.random(p.TWO_PI),
				off: p.random(100),
				rad: p.random([25, 50, 75, 100]),
			})
		}

		if (useDivide) {
			p.rectDivide(
				blocks,
				strokeWeight / 2,
				strokeWeight / 2,
				WIDTH - strokeWeight,
				HEIGHT - strokeWeight,
				minSpace,
				HALF
			)
		}
	}

	p.draw = () => {
		const t = p.frameCount * 0.02

		novas.forEach((nova) =>
			Nova(...nova.pos, nova.rad, t * 0.1 + nova.off, nova.rot + t * 0.001)
		)

		if (blocks.length) showSpaceDivide()
	}

	const showSpaceDivide = () => {
		p.push()
		p.noFill()
		p.stroke(bg)

		blocks.forEach((block, index) => {
			p.randomSeed(index * 100)
			const w = randomStrokeWeight ? p.random(1, strokeWeight) : strokeWeight
			p.strokeWeight(w)
			p.rect(
				block.x + block.w / 2,
				block.y + block.h / 2,
				randomStrokeWeight ? block.w - w : block.w,
				randomStrokeWeight ? block.h - w : block.h
			)
		})
		if (randomStrokeWeight) {
			p.strokeWeight(strokeWeight)
			p.rect(WIDTH / 2, HEIGHT / 2, WIDTH - strokeWeight, HEIGHT - strokeWeight)
		}
		p.pop()
	}

	const Nova = (posX, posY, rad, t, rot) => {
		p.push()
		p.translate(posX, posY)
		p.rotate(rot)
		p.noStroke()

		const max = (p.TWO_PI / nodeNum) * nodeNum
		const step = p.TWO_PI / nodeNum
		for (let i = 0; i < max; i += step) {
			const x = p.cos(i) * rad
			const y = p.sin(i) * rad

			const wei = (0.5 + 0.5 * p.cos(t)) * 200
			const nx = noise4D(x + 100, y + 200, p.cos(t), p.sin(t)) * wei
			const ny = noise4D(x + 300, y + 400, p.cos(t), p.sin(t)) * wei

			p.randomSeed(x * 100 + y * 100)
			const c = p.color(p.random(palette))
			c.setAlpha(p.map(p.noise(t + p.random(1000)), 0, 1, 200, 255))
			p.fill(c)

			const d = p.sqrt((x + nx) * (x + nx) + (y + ny) * (y + ny))
			p.push()
			p.translate(x + nx, y + ny)
			p.rotate(i + p.map(d, 0, WIDTH, -90, 90))
			const w = p.map(d, 0, WIDTH, 0, 5)
			const h = p.map(d, 0, WIDTH, 0, 55)
			p.rect(0, 0, w, h)
			p.pop()
		}

		p.pop()
	}
})

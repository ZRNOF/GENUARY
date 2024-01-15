// The Crowded Paradise © 2024-01-15 by Zaron Chen is licensed under CC BY-NC-SA 3.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/

import { createNoise4D } from "https://cdn.skypack.dev/simplex-noise@4.0.0"
import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.0.0/src/p5.flex.mjs"

mountFlex(p5)

new p5((p) => {
	const MAX_DENSITY = 150
	const MAX_THICKNESS = 50

	const sprites = new Map()
	const walls = {}
	let started, idCount

	const Engine = Matter.Engine
	const Runner = Matter.Runner
	const Bodies = Matter.Bodies
	const Composite = Matter.Composite

	const engine = Engine.create()
	const world = engine.world
	const runner = Runner.create()

	const simplexNoiseSeed = p.random()
	const noise4D = createNoise4D(() => simplexNoiseSeed)

	const isOut = (body, off) => {
		const pos = body.position
		return (
			pos.x < -off ||
			pos.x > p.width + off ||
			pos.y < -off ||
			pos.y > p.height + off
		)
	}

	const mouseOut = (off) => {
		return (
			p.mouseX < off ||
			p.mouseX > p.width - off ||
			p.mouseY < off ||
			p.mouseY > p.height - off
		)
	}

	const addBody = (body) => Composite.add(world, body)

	const Wall = (x, y, w, h, dir, opt) => {
		const body = Bodies.rectangle(x, y, w, h, opt)
		let thickness = 0
		addBody(body)
		return {
			body,
			show: () => {
				p.push()
				p.translate(body.position.x, body.position.y)
				p.rotate(body.angle)
				p.rectMode(p.CENTER)
				p.noStroke()
				if (dir === "hor") p.rect(0, 0, p.min((thickness += 5), w), h)
				if (dir === "ver") p.rect(0, 0, w, p.min((thickness += 5), h))
				p.pop()
			},
			remove: () => Composite.remove(world, body),
		}
	}

	const buildWall = (w, h) => {
		const opt = { isStatic: true }
		walls.t = Wall(w / 2, 0, w, MAX_THICKNESS, "ver", opt)
		walls.b = Wall(w / 2, h, w, MAX_THICKNESS, "ver", opt)
		walls.r = Wall(w, h / 2, MAX_THICKNESS, h, "hor", opt)
		walls.l = Wall(0, h / 2, MAX_THICKNESS, h, "hor", opt)
	}

	const showWall = () => {
		walls.t.show()
		walls.b.show()
		walls.r.show()
		walls.l.show()
	}

	const removeWall = () => {
		walls.t.remove()
		walls.b.remove()
		walls.r.remove()
		walls.l.remove()
	}

	const drawSprite = (radius, noiseWeight, amount, t, nxOff, nyOff) => {
		p.push()
		p.beginShape()
		for (
			let i = 0;
			i < (p.TWO_PI / amount) * (amount + 3);
			i += p.TWO_PI / amount
		) {
			const x = p.cos(i) * radius
			const y = p.sin(i) * radius
			const nx = noise4D(x + nxOff.x, y + nxOff.y, p.cos(t), p.sin(t))
			const ny = noise4D(x + nyOff.x, y + nyOff.y, p.cos(t), p.sin(t))
			p.curveVertex(x + nx * noiseWeight, y + ny * noiseWeight)
		}
		p.endShape()
		p.pop()
	}

	const Sprite = (x, y, r, color, fill, opt) => {
		const body = Bodies.circle(x, y, r, opt)
		const nxOff = { x: p.random(1000), y: p.random(1000) }
		const nyOff = { x: p.random(1000), y: p.random(1000) }
		addBody(body)
		return {
			body,
			show: () => {
				p.push()
				p.stroke(color)
				if (fill) p.fill(color)
				else p.noFill()
				p.translate(body.position.x, body.position.y)
				p.rotate(body.angle)
				drawSprite(r * 0.75, 5, 5, p.frameCount * 0.01, nxOff, nyOff)
				p.pop()
			},
			remove: () => Composite.remove(world, body),
		}
	}

	const addSprite = () => {
		idCount++
		const pos = [p.mouseX, p.mouseY]
		const nodeNum = p.random([10, 20, 30])
		const color = p.random([127, 255, "#00647f"])
		const isFill = p.random([false, true])
		const opt = { angle: p.random(p.TWO_PI), restitution: 0.5 }
		sprites.set(idCount, Sprite(...pos, nodeNum, color, isFill, opt))
	}

	const mouseEvent = () => {
		if (mouseOut(MAX_THICKNESS / 2)) return
		started = true
		if (idCount < MAX_DENSITY) addSprite()
	}

	const init = () => {
		started = false
		idCount = 0
		buildWall(p.width, p.height)
	}

	p.setup = () => {
		p.createCanvas(400, 400)
		p.flex({ container: { padding: "20px" } })
		init()
		Runner.run(runner, engine)
	}

	p.draw = () => {
		p.background(0)

		sprites.forEach((sprite, k) => {
			p.push()
			p.fill(255)
			sprite.show()
			p.pop()
			if (isOut(sprite.body, 50)) {
				sprite.remove()
				sprites.delete(k)
			}
		})

		if (idCount < MAX_DENSITY) showWall()
		if (idCount === MAX_DENSITY) removeWall()
		if (started && !sprites.size) init()
	}

	p.mouseDragged = () => mouseEvent()
	p.mousePressed = () => mouseEvent()
})

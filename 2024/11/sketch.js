// In the style of Anni Albers (1899-1994).
// References: https://en.wikipedia.org/wiki/Maze_generation_algorithm

import { mountFlex } from "https://cdn.jsdelivr.net/npm/p5.flex@0.1.1/src/p5.flex.min.mjs"
import mountGrid from "./Grid.js"
import { vert, frag } from "./shader.js"

mountFlex(p5)
mountGrid(p5)

new p5((p) => {
	const [WIDTH, HEIGHT] = [600, 600]
	const PIXEL_DENSITY = 2
	const CANVAS_SIZE = [WIDTH, HEIGHT]
	const TEXEL_SIZE = [1 / (WIDTH * PIXEL_DENSITY), 1 / (HEIGHT * PIXEL_DENSITY)]
	const color = p.random([
		[1, 1, 0],
		[0, 0.8, 1],
		[1, 0.3, 0.3],
		[1, 0.5, 0],
	])

	const [cols, rows] = [15, 15]
	const stack = []

	let cnv, gfx, theShader, gs, curr

	p.setup = () => {
		p.createCanvas(WIDTH, HEIGHT)
		p.flex({ container: { padding: "20px" } })

		p.pixelDensity(PIXEL_DENSITY)

		cnv = p.createGraphics(WIDTH, HEIGHT)
		gfx = p.createGraphics(WIDTH, HEIGHT, p.WEBGL)
		theShader = p.createShader(vert, frag)

		p.noStroke()
		cnv.noStroke()

		gs = cnv.Grid({ cols, rows, order: p.LRTB })

		const calcID = (col, row) => {
			if (col < 0 || row < 0 || col >= gs._cols || row >= gs._rows) return -1
			return col + row * gs._cols
		}

		for (let cell of gs._cells) {
			cell.visited = false
			cell.walls = [true, true, true, true]
			cell.neighbors = []
			cell.chooseNeighbor = () => p.random(cell.neighbors)
			cell.hasUnvisitedNeighbors = () => {
				cell.neighbors = []
				const t = gs._cells[calcID(cell.col, cell.row - 1)]
				const r = gs._cells[calcID(cell.col + 1, cell.row)]
				const b = gs._cells[calcID(cell.col, cell.row + 1)]
				const l = gs._cells[calcID(cell.col - 1, cell.row)]
				if (t && !t.visited) cell.neighbors.push(t)
				if (r && !r.visited) cell.neighbors.push(r)
				if (b && !b.visited) cell.neighbors.push(b)
				if (l && !l.visited) cell.neighbors.push(l)
				return cell.neighbors.length > 0
			}
		}

		curr = gs._cells[p.floor(p.random(cols * rows))]
		curr.visited = true
		stack.push(curr)
	}

	p.draw = () => {
		p.background(255)
		cnv.background(255)
		gfx.background(255)

		gs.generate(content)
		if (stack.length) {
			curr = stack.pop()
			if (curr.hasUnvisitedNeighbors()) {
				stack.push(curr)
				const next = curr.chooseNeighbor()
				removeWalls(curr, next)
				next.visited = true
				stack.push(next)
			}
		}

		gfx.shader(theShader)
		theShader.setUniform("tex0", cnv)
		theShader.setUniform("canvasSize", CANVAS_SIZE)
		theShader.setUniform("texelSize", TEXEL_SIZE)
		theShader.setUniform("color", color)
		gfx.quad(-1, 1, 1, 1, 1, -1, -1, -1)

		p.image(gfx, 0, 0)
	}

	const content = (cell) => {
		cnv.stroke(0)
		cnv.strokeCap(cnv.PROJECT)
		cnv.strokeWeight(cell.w / 2)
		const visited = gs._cells[cell.id].visited
		const walls = gs._cells[cell.id].walls
		if (walls[0]) cnv.line(0, 0, cell.w, 0)
		if (walls[1]) cnv.line(cell.w, 0, cell.w, cell.h)
		if (walls[2]) cnv.line(0, cell.h, cell.w, cell.h)
		if (walls[3]) cnv.line(0, 0, 0, cell.h)
		if (!visited) {
			cnv.translate(cell.w / 2, cell.h / 2)
			cnv.rectMode(cnv.CENTER)
			cnv.fill(0)
			cnv.noStroke()
			cnv.square(0, 0, cell.w)
		}
	}

	const removeWalls = (curr, next) => {
		const hor = curr.col - next.col
		if (hor === +1) [curr.walls[3], next.walls[1]] = [false, false]
		if (hor === -1) [curr.walls[1], next.walls[3]] = [false, false]
		const ver = curr.row - next.row
		if (ver === +1) [curr.walls[0], next.walls[2]] = [false, false]
		if (ver === -1) [curr.walls[2], next.walls[0]] = [false, false]
	}
})

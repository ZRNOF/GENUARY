// MIT License
// Copyright © 2024 Zaron
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

class Grid {
	constructor({ p, cols, rows, grid_w, grid_h, order }) {
		this._init(p, cols, rows, grid_w, grid_h, order)
	}

	_init(p, cols, rows, grid_w, grid_h, order) {
		this.p = p
		this._cols = Math.floor(cols)
		this._rows = Math.floor(rows)
		this._gridW = grid_w
		this._gridH = grid_h
		this._cellW = this._gridW / cols
		this._cellH = this._gridH / rows
		this._cells = []
		this._isReset = true
		this._order = order
		this.order(this._order)
	}

	generate(content) {
		for (let cell of this._cells) {
			this.p.push()
			this.p.translate(cell.col * this._cellW, cell.row * this._cellH)
			content({
				id: cell.id,
				col: cell.col,
				row: cell.row,
				w: this._cellW,
				h: this._cellH,
			})
			this.p.pop()
		}
	}

	config(
		{
			cols = this._cols,
			rows = this._rows,
			grid_w = this._gridW,
			grid_h = this._gridH,
			order = this._order,
		},
		reset = false
	) {
		let isSame =
			this._cols == cols &&
			this._rows == rows &&
			this._gridW == grid_w &&
			this._gridH == grid_h &&
			this._order == order
		if (!(isSame && !reset)) {
			this._init(this.p, cols, rows, grid_w, grid_h, order)
		} else {
			this._isReset = false
		}
	}

	order(order) {
		this._order = order
		if (this._order === this.p.SHUFFLE) {
			this._shuffleOrder()
		} else {
			this._orderBy(this._order)
		}
	}

	_shuffleOrder() {
		let numbers = Array.from({ length: this._cols * this._rows }, (_, i) => i)
		this.p.shuffle(numbers, true)
		for (let x = 0; x < this._cols; x++) {
			for (let y = 0; y < this._rows; y++) {
				this._setCell(x, y, numbers[x * this._rows + y])
			}
		}
	}

	_orderBy(order) {
		let fst_order = order.slice(0, 2)
		let sec_order = order.slice(2, 4)
		for (let x = 0; x < this._cols; x++) {
			for (let y = 0; y < this._rows; y++) {
				let fst = {
					TB: y,
					BT: this._rows - y - 1,
					LR: x,
					RL: this._cols - x - 1,
				}
				let sec = {
					TB: y * this._cols,
					BT: (this._rows - y - 1) * this._cols,
					LR: x * this._rows,
					RL: (this._cols - x - 1) * this._rows,
				}
				this._setCell(x, y, fst[fst_order] + sec[sec_order])
			}
		}
	}

	_setCell(x, y, id) {
		if (this._cells[id] != undefined) {
			this._updateCell(x, y, id)
		} else {
			this._initCell(x, y, id)
		}
	}

	_initCell(x, y, id) {
		this._cells[id] = {
			col: x,
			row: y,
			id: id,
		}
	}

	_updateCell(x, y, id) {
		this._cells[id].col = x
		this._cells[id].row = y
		this._cells[id].id = id
	}
}

const mountGrid = (p5) => {
	p5.prototype.Grid = function ({
		cols,
		rows,
		grid_w = this._renderer.width,
		grid_h = this._renderer.height,
		order = this.SHUFFLE,
	}) {
		return new Grid({
			p: this,
			cols,
			rows,
			grid_w,
			grid_h,
			order,
		})
	}
	p5.prototype.TBRL = "TBRL"
	p5.prototype.TBLR = "TBLR"
	p5.prototype.BTRL = "BTRL"
	p5.prototype.BTLR = "BTLR"
	p5.prototype.RLTB = "RLTB"
	p5.prototype.RLBT = "RLBT"
	p5.prototype.LRTB = "LRTB"
	p5.prototype.LRBT = "LRBT"
	p5.prototype.SHUFFLE = "SHUFFLE"
}

export default mountGrid

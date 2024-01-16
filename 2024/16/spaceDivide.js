const rectDivide = (p, arr, x, y, w, h, min, HALF) => {
	const block1 = { x, y, w, h }
	const block2 = { x, y, w, h }

	if (w < min || h < min) {
		arr.push({ x, y, w, h })
		return
	}
	if (p.random() < 0.5) {
		if (HALF) block1.w = p.floor(block1.w / 2)
		else block1.w = p.floor(p.random(block1.w / 4, (block1.w / 4) * 3))
		block2.x += block1.w
		block2.w -= block1.w
	} else {
		if (HALF) block1.h = p.floor(block1.h / 2)
		else block1.h = p.floor(p.random(block1.h / 4, (block1.h / 4) * 3))
		block2.y += block1.h
		block2.h -= block1.h
	}
	rectDivide(p, arr, block1.x, block1.y, block1.w, block1.h, min, HALF)
	rectDivide(p, arr, block2.x, block2.y, block2.w, block2.h, min, HALF)
}

const mountSpaceDivide = () => {
	p5.prototype.rectDivide = function (arr, x, y, w, h, min, HALF) {
		rectDivide(this, arr, x, y, w, h, min, HALF)
	}
}

export default mountSpaceDivide

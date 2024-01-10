const subDivide = (p, arr, x, y, w, h) => {
	const block1 = { x, y, w, h }
	const block2 = { x, y, w, h }

	if (w < 50 || h < 50) {
		arr.push({ x, y, w, h })
		return
	}
	if (p.random() < 0.5) {
		block1.w = p.floor(p.random(block1.w / 4, (block1.w / 4) * 3))
		block2.x += block1.w
		block2.w -= block1.w
	} else {
		block1.h = p.floor(p.random(block1.h / 4, (block1.h / 4) * 3))
		block2.y += block1.h
		block2.h -= block1.h
	}
	subDivide(p, arr, block1.x, block1.y, block1.w, block1.h)
	subDivide(p, arr, block2.x, block2.y, block2.w, block2.h)
}

const mountSubDivide = () => {
	p5.prototype.subDivide = function (arr, x, y, w, h) {
		subDivide(this, arr, x, y, w, h)
	}
}

export default mountSubDivide

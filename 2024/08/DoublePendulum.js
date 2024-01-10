export const rod = (l, m, a) => {
	return { l, m, a, av: 0, aa: 0, px: 0, py: 0, ppx: 0, ppy: 0 }
}

export const DoublePendulum = (r1, r2, pos, g, angle) => {
	const sin = (t) => Math.sin(t)
	const cos = (t) => Math.cos(t)
	const calc = () => {
		const [sa, ca] = [sin(r1.a - r2.a), cos(r1.a - r2.a)]
		const [sa1, ca1] = [sin(r1.a), cos(r1.a)]
		const [lv1, lv2] = [r1.av * r1.av * r1.l, r2.av * r2.av * r2.l]
		const m = r1.m + r2.m
		const lm = 2 * r1.m + r2.m - r2.m * cos(2 * r1.a - 2 * r2.a)

		// prettier-ignore
		r1.aa = -g * (2 * r1.m + r2.m) * sa1 - r2.m * g * sin(r1.a - 2 * r2.a) - 2 * sa * r2.m * (lv2 + lv1 * ca)
		r2.aa = 2 * sa * (lv1 * m + g * m * ca1 + lv2 * r2.m * ca)
		r1.aa /= r1.l * lm
		r2.aa /= r2.l * lm
		;[r2.ppx, r2.ppy] = [r2.px, r2.py]
		;[r1.px, r1.py] = [r1.l * sa1, r1.l * ca1]
		;[r2.px, r2.py] = [r1.px + r2.l * sin(r2.a), r1.py + r2.l * cos(r2.a)]

		r1.av += r1.aa
		r2.av += r2.aa
		r1.a += r1.av
		r2.a += r2.av

		return {
			x1: r1.px,
			y1: r1.py,
			x2: r2.px,
			y2: r2.py,
			ppx: r2.ppx,
			ppy: r2.ppy,
		}
	}
	return { r1, r2, pos, g, angle, calc }
}

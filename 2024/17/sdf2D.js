export const sdf2D = `
	// The MIT License
	// Copyright © Inigo Quilez
	// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	// https://www.youtube.com/c/InigoQuilez
	// https://iquilezles.org
	//
	// https://iquilezles.org/articles/distfunctions2d/

	// The MIT License
	// Copyright © 2020 Inigo Quilez
	//
	// - r: radius
	float sdCircle(vec2 p, float r) {
		return length(p)-r;
	}

	// The MIT License
	// Copyright © Inigo Quilez
	//
	// - b: vec2(width, height)
	float sdBox(in vec2 p, in vec2 b) {
		vec2 d = abs(p)-b;
		return length(max(d, 0.0))+min(max(d.x, d.y), 0.0);
	}

	// The MIT License
	// Copyright © 2015 Inigo Quilez
	//
	// - b: vec2(width, height)
	// - r: vec4(top-right, boottom-right, top-left, bottom-left)
	float sdRoundedBox(in vec2 p, in vec2 b, in vec4 r) {
		r.xy = (p.x>0.0) ? r.xy : r.zw;
		r.x = (p.y>0.0) ? r.x : r.y;
		vec2 q = abs(p)-b+r.x;
		return min(max(q.x, q.y), 0.0)+length(max(q, 0.0))-r.x;
	}

	// The MIT License
	// Copyright © 2020 Inigo Quilez
	//
	// - a: point a
	// - b: point b
	float sdSegment(in vec2 p, in vec2 a, in vec2 b) {
		vec2 pa = p-a, ba = b-a;
		float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
		return length(pa-ba*h);
	}

	// The MIT License
	// Copyright © 2019 Inigo Quilez
	//
	// - r: radius
	float sdHexagram( in vec2 p, in float r ) {
		const vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
		p = abs(p);
		p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
		p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;
		p -= vec2(clamp(p.x,r*k.z,r*k.w),r);
		return length(p)*sign(p.y);
	}
`

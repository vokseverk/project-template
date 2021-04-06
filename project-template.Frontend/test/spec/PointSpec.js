import Point from '../../src/js/modules/point.js'

describe("Point", () => {
	it("defaults to x and y being 0", () => {
		const p = new Point()
		expect(p.x).toBe(0)
		expect(p.y).toBe(0)
	})
	
	it("can set x and y when created", () => {
		const p = new Point(3, 14)
		expect(p.x).toBe(3)
		expect(p.y).toBe(14)
	})
	
	it("can set x and/or y after creation", () => {
		const p = new Point()
		p.x = 78
		p.y = 99
		expect(p.x).toBe(78)
		expect(p.y).toBe(99)
	})
	
	describe("draw", () => {
		const d = new Point()
		const p = new Point(3, 14)
		it("reports x and y as a coordinate set", () => {
			expect(d.draw()).toBe("[0, 0]")
			expect(p.draw()).toBe("[3, 14]")
		})
	})
})

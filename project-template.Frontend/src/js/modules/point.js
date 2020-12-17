//
// A demo Point to test the build setup
//

class Point {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}
	
	draw() {
		return `[${this.x}, ${this.y}]`
	}
}

export default Point

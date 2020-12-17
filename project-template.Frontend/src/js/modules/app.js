//
//	This is the app's main JS file.
//	
//	It must export a single `default function` that gets imported and
//	executed by the two wrapper files in the parent `js` folder.
//

import Point from './point.js'

export default function() {
	const pointTest = new Point(5, 10)
	console.log(pointTest.draw())
}

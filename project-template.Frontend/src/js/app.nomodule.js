//
//	This is the "nomodule" version of the app's main JS file.
//	This file should be transpiled and bundled by CodeKit as a
//	fallback file for browsers that don't support JS modules.
//
//	It's purely a wrapper file — code your app in the app.js file
//	referenced below along with various modules beside it.
//

import initialize from './modules/app.js'

document.addEventListener('DOMContentLoaded', initialize)

// DOM
export {setDefaultView} from './src/default-view' //document, window

// NODES
export {cloneNode} from './src/clone-node'
export {
	createElement,
	createElementNS,
	createElementSVG,
	createComment,
	createTextNode,
	createDocumentFragment
} from './src/create-node'

// MODIFY
export {setAttribute, setText, setProperty, addChild} from './src/patch'
export {setChildren} from './src/set-children'
export {updateNode} from './src/update-node'

// DYNAMIC
export {createLens} from './src/constructors/lens'
export {createList} from './src/create-list'
export {extras} from './src/extras'

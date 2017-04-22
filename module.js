// DOM
export {setDefaultView} from './default-view' //document, window
export {namespaces} from './namespaces'

// MODIFY
export {setAttribute, setText, setProperty, addChild} from './patch'
export {replaceChildren} from './replace-children'

// DYNAMIC
export {updateNode} from './update-node'
export {createList} from './create-list'
export {createLens} from './constructors/lens'



// Nodes
export {createElement, createComment, createTextNode, createDocumentFragment, createEl} from './create-node'
// Edits
export {cloneNode} from './clone-node'
// Component Items
export {getNode, getExtra} from './extras'

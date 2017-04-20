// DOM
export {setDefaultView} from './default-view' //document, window
export {namespaces} from './namespaces'

// Nodes
export {createElement, createComment, createTextNode, createDocumentFragment} from './create-node'

// Edits
export {replaceChildren} from './replace-children'
export {setAttribute, setProperty} from './util/reducers'
export {cloneNode} from './clone-node'

// Component Items
export {getNode, getExtra} from './extras'
export {createComponent} from './create-component'
export {createList} from './create-list'
export {createLens} from './constructors/lens'
export {updateNode} from './update-node'

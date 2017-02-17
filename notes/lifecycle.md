# LIFECYCLE

<!-- markdownlint-disable MD022 MD032 -->

## REDOM

* all **this** && **new Constructors**
* `View(initData, v, i, a) => Co`
* `update(v,i,a) => void`
* `mount() => void` mounting&&!isMounted
* `mounted() => void` mounting&&!isMounted&&mount
* `remount() => void` mounting&&isMounted
* `remounted() => void` mounting&&isMounted&&remount
* `unmount() => void` mounted


## NANOCOMPONENTS

* no **this** `el` is passed on every lifecycle methods
* `render(...args)=>Element` (required) Render DOM elements
* `onupdate(el, ...renderArgs)` change DOM with new data, same args as `render`
* `onenter` called when the element comes into view, relies on window.IntersectionObserver
* `onexit` Called when the element goes out of view, relies on window.IntersectionObserver
* `onload(el)` Called when the element is appended onto the DOM
* `onunload(el)` Called when the element is removed from the DOM
* `onresize` Called when the element changes ️ size


## SNABBDOM

* `init(vnode) => void`
* `create((vnode,vnode) => void`
* `insert(vnode) => void`
* `prepatch(vnode,vnode) => void`
* `update(vnode,vnode) => void`
* `postpatch(vnode,vnode) => void`
* `destroy(vnode) => void`
* `remove(vnode, cb) => void`


## MITHRIL

* `view(vnode) => vdom`
* `oninit(vnode)` before mounting, parent before children
* `oncreate(vnode)` after mounting
* `onupdate(vnode)` after update if already mounted
* `onbeforeremove(vnode) => Promise|void` before unmount, wait if promise, head of fragment only
* `onremove(vnode)` after onbeforeremove, all children
* `onbeforeupdate(vnode,old) => Boolean` false:prevent diff self and children


PICO
* oninit(cfg) => void
* ondata(v,i,a) => void
* ?onview
* ?ondrop
* ?ante
* ?post


## CUSTOMELEMENT

* element === **this**
* `connectedCallback() => void` inserted into a document, including into a shadow tree
* `disconnectedCallback() => void` clean up code (removing event listeners, etc.).
* `attributeChangedCallback(name, oldValue, newValue, namespace)`
* `adoptedCallback(oldDocument, newDocument)` //old !== new


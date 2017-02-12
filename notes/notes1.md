<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 -->

TODO
* on mounting, set.childIndex
* manual update => this.update(...) this.updateChildren(...) this.updateTree(...) this.children(...) this.content(...)
* default ondata passthrough
* content ALWAYS ovewrite element children
	* element => cloneNode(true)
	* component => cloneNode(false)
* el(co); co(co)

ISSUES
* AUTUPDATE => automount(last) ...parent gives pointer to each
* ManualUpdate =>







BEFORE
`el(sel, cfg, cnt)(opt)` => `HTML`
`el.svg(sel, cfg, cnt)(opt)` => `svg`
cfg: `{attrs, props}`

AFTER
`el(sel, cfg, cnt)` => `HTML`
`el.svg(sel, cfg, cnt)` => `SVG`
cfg: **???**
* just decorate with `el(refEL, cfg, cnt)` => `newEL`

BEFORE
`co(sel, cfg, cnt)(opt)(val, idx)` => `HTML`
`co.svg(sel, cfg, cnt)(opt)(val, idx)` => `svg`
cfg: `{on, ondata, oninit, key, datakey, attrs, props}`

AFTER-A
`co(el(sel, att), cfg, cnt).update(val, idx)` => `HTML`
`co(co(sel, att, cnt), cfg, cnt).update(val, idx)` => `HTML`
* split el and component options
* components are exposed and can be cloned
* mixing props and attrs is tricky

AFTER-B
`co(sel, cfg, cnt)(val, idx)` => `HTML`
`co(el(sel, att), cfg, cnt)(val, idx)` => `HTML`
`co(co(sel, att, cnt), cfg, cnt)(val, idx)` => `HTML`
* flexible
* need a handle on the function to access component `this.view.component`


```javascript
co('tbody',
  li('tr',
    co('td', el.svg('svg', svgIcon)),
    li('td', {edit: function(val, pos) { this.el.textContent = val }})
  )
)
```

```javascript
co(el('tbody'),
  li('tr',
    co('td', el.svg('svg', svgIcon)),
    li('td', {edit: function(val, pos) { this.el.textContent = val }})
  )
)
```




```javascript
//custom creators for shared scope
var li = pico.Li(defaults)
var tableCo = co('table', [
  el('caption', 'data-matrix')
  co('tbody',
    li('tr',
      co('td', el.svg('svg', svgIcon)),
      li('td', {edit: function(val, pos) { this.el.textContent = val }})
    )
  ),
])
var tableFn = tableCo(options)
var tableEl = tableFn(data)
document.body.appendChild(tableEl)
```

# lifecycle

co(...) => create component factory
ff(opt) => (new Component).view
* create & decorate parent element


* functional
* tiny API
* view only
* node require

lifecycle
* init() || oninit()
* view() ||
* edit() || ondata()
* drop()

events
* on: {}


mount: =>
	onparent: (oldParentNode, newParentNode)









oninit(opt) => void, this:component, this.el:element
ondata(val, idx) => val' => child(val', idx, after)




Co(def) => co
co(sel, opt, cnt) => factory function
ff(opt) => view
	* clone OR create parent element // getElement(elm, opt)
	* decorate parent element // getElement(elm, opt)
	* clone OR create child elements OR view Function // getContent(cnt) & getChild(src[i])
	* oninit()
view(val, idx, after) => element
	* mount child elements and run view functions

lifecycle
	* create & decorate Element
	* create Component
	* create child Elements & child Components
	* >> init() || oninit()
	* mount children
	* mount self
	* >> onmount
	* >> onview
	* >> unmount

Node.rootNode === topmost
Node.parentNode === parent

same parent, new rootNode ==> parent was mounted, self unchanged
same rootNode, newParent ===> self mounted, parent


Read only
Returns a Node object representing the topmost node in the tree, or the current node if it's the topmost node in the tree. This is found by walking backward along Node.parentNode until the top is reached


	Co(def) => co
co(sel, opt, cnt) => factory function
ff(opt) => view
	* clone OR create parent element // getElement(elm, opt)
	* decorate parent element // getElement(elm, opt)
	* clone OR create child elements OR view Function // getContent(cnt) & getChild(src[i])
	* >>> component.oninit(opt) => void
view(val, idx, after) => element
	* >>> component.ondata(opt) => data'
	* mount child elements and run view functions
	* >>> onview()


READONLY
	E.localName
	E.namespaceURI
	E.prefix
	E.tagName
	N.nodeName
	N.nodeType E:1, T:3, C:8, D:9, F:11
	I.list

SWITCHAROO
	class => E.className

SPECIAL
	Element.attributes ==> NamedNodeMap
	Element.classList ==> DOMTokenList
	I.files ==> FileList
	I.labels ==> NodeList
	H.dataset ==> DOMStringMap
	H.properties ==>  HTMLPropertiesCollection

{sel:{tag, ns, pre}, att:{...}, cnt:[txt|num|fcn|el|co]} [sel, att, cnt]


COMPONENT:
Mithril: {
* oninit: vnode => void, // before mounting, parent before children
* oncreate: vnode => void, // after mounting
* onupdate: vnode => void, // after update if already mounted
  * onbeforeremove: vnode => void||Promise, // before unmount, wait if promise, head of fragment only
  * onremove: vnode => void, //after onbeforeremove, all children
  * onbeforeupdate: (vnode,old) => Boolean, //false:prevent diff self and children
* view: vnode => vdom

	}
	redom: {
		update: (v,i,a)=>void
		View: (initData, v, i, a) => Co
		key: ''
		initData: {}
		views: []
		el: Element
		mount: ()=>void, //mounting&&!isMounted
		mounted: ()=>void, //mounting&&!isMounted&&mount
		remount: ()=>void, //mounting&&isMounted
		remounted: ()=>void, //mounting&&isMounted&&remount
		unmount: ()=>void, //mounted
	}
	snabbdomCO: {
* init: vnode => void
  * create: (vnode,vnode) => void
* insert: vnode => void
  * prepatch: (vnode,vnode) => void
* update: (vnode,vnode) => void
		postpatch: (vnode,vnode) => void
		destroy: vnode => void
		remove: (vnode, cb) => void
	}
	CustomElement: this === element
		constructor: function() {super(); this.something=somevalue} //created or upgraded
		connectedCallback() //inserted into a document, including into a shadow tree
		disconnectedCallback() //clean up code (removing event listeners, etc.).
		attributeChangedCallback(name, oldValue, newValue, namespace) //attributes are changed, appended, removed, or replaced, its attributeChangedCallback is run
		adoptedCallback(oldDocument, newDocument) //old !== new
		observedAttributes: ['disabled', 'open']
	}

		createdCallback: () => void //	 an instance of the element is created
		attachedCallback: () => void //	an instance was inserted into the document
		detachedCallback: () => void //	an instance was removed from the document
		attributeChangedCallback: (attrName, oldVal, newVal) => void	an attribute was added, removed, or updated
	pico
		oninit: cfg => void
		onview: (v,i,a) => void //mount, load, hire
		ondata: (v,i,a) => void
		ondrop: () => void //drop, wipe, shed, sack, fire, lose, oust, unmount, part
picoMODULE
?	ante === pre
?	post

visibility changes when rootNode changes....
root===

Node.ownerDocument Read only
Returns the Document that this node belongs to. If no document is associated with it, returns null.
Node.parentNode Read only
Returns a Node that is the parent of this node. If there is no such node, like if this node is the top of the tree or if doesn't participate in a tree, this property returns null.
Node.parentElement Read only
Returns an Element that is the parent of this node. If the node has no parent, or if that parent is not an Element, this property returns null.
Node.prefix Read only
Is a DOMString representing the namespace prefix of the node, or null if no prefix is specified.
Node.previousSibling Read only
Returns a Node representing the previous node in the tree, or null if there isn't such node.
Node.rootNode Read only
Returns a Node object representing the topmost node in the tree, or the current node if it's the topmost node in the tree. This is found by walking backward along Node.parentNode until the top is reached.

* TODO
* rawElement: `.xmlns`, `.prefix`, `.tag`
* ??????????: `.element`
* decorated: rawElement + `.dataset`, `.attributes|.attrs`, `.properties|.props`, `.style`
* component: decorated & `.content`, `.key`, `.edit`, `.on`, `.init`
* list: component & `.datakey`

PARSESEL
* parse('ss') => {attributes, xmlns, tag, prefix}
CREATE ELEMENT
* create-element({element || xmlns, prefix, tag}) ==> Node
* decorate(el, {dataset, attributes, properties, style})
* factory(cfg)(sel, cfg, cnt)(cfg) ==> {element || xmlns, prefix, tag, content} ==> Node
	* parseArgs: {element:Node||Function} || {content:[string||number||Node||Function]} || {attributes, xmlns, tag, prefix}



GRAND MASTER CHANGE: [
	element || {tag, xmlns, prefix} || factory,
	{attrs, props, style},
	children
]

NOTES
* YUK - parse arguments uses the weird .element and .content props instead of just creating|decorating
	* allows for late element creation
	* possible conflicts. split definition(xmlns,tag,prefix), decoration(attrs, props, data, style), content([])
	* consider merging in parseSel and parseArg to reduce object creations
* ALTERNATIVE {el:obj|elm|fcn, dec, cnt}
	elm: node || factory || {tag, prefix, xmlns}
* be more explicit about the properties at each steps:
	* DEFAULTS:
	* SELECTOR: Elm|Fcn({attrs, props, style, })


INTENT
el(tag|elm|fac [, cfg] [, cnt]) => fac(cfg) => Node
* error if tag|xmlns on existing element

BEFORE
CENS: 3.96kbm
PICO: 6.29kbm
REDO: 3.76kbm

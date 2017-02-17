<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 -->

Co(def) => co
co(sel, opt, cnt) => factory function
ff(opt) => view
	* clone OR create parent element // getElement(elm, opt)
	* decorate parent element // getElement(elm, opt)
	* clone OR create child elements OR view Function // getContent(cnt) & getChild(src[i])
	* oninit()
view(val, idx, after) => element
	* mount child elements and run view functions

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


https://www.npmjs.com/package/nanocomponent
render = nanocomponent(HtmlOrFunctionOrObject)
Create an object with different methods attached. Cached until new arguments are passed in or when it's removed from the DOM. Availble methods are:

.
placeholder(..args)
* Render DOM elements and delegate the render call to the next requestIdleCallback tick. This is useful to spread CPU intensive work over more time and not block the render loop. When executed on the server placeholder will always be rendered in favor of render. This makes it easier for client-side JS to pick up where the server left off (rehydration).

TOOLS
`Node.ownerDocument` Read only, Returns the Document that this node belongs to. If no document is associated with it, returns null.
`Node.parentNode` Read only
`Node.parentElement` Read only
`Node.rootNode` Read only

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

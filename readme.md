<!-- markdownlint-disable MD004 MD007 MD010 MD012 MD041 MD022 MD024 MD032 -->

# pico-dom

*minimalist hyperscript-based DOM tree **element**, **component** and **list** functions with svg, namespace and W3 selector support, all in 2kb gzip, no dependencies*

• [Example](#example) • [Features](#features) • [API](#api) • [License](#license)

## Example

```javascript
var pico = require('pico-dom')
var co = pico.component,
    li = pico.list,
    el = pico.element

var table = co('table', [
  el('caption', 'data-matrix')
  co('tbody',
    li('tr',
      co('td', el.svg('svg', svgIcon)),
      li('td', {
        co('input', {update: function(val, pos) { this.node.value = val }}
      })
    )
  ),
])
table.update([['Jane', 'Roe'], ['John', 'Doe']])
table.moveto(document.body)
```

## Features

* dynamic list and nested lists
* namespaced tag and namespaced attribute support
* svg namespace and utility functions pre-defined
* w3 string selector API, including attributes
* element decorators for element properties and attributes
* ability to inject a `document API` for server and/or testing (e.g. `jsdom`)
* factories with preset defaults to facilitate the creation of components
* All ES5 and HTML5 to avoid transpiling and facilitate compatibility
* no virtual DOM, all operations are done on actual nodes
* under 3kb gzip, no dependencies
* all text injections and manipulations done through the secure `textContent` and `nodeValue` DOM API

### Limitations

* still in early trial phase. proof of concept only
* currently only available as a common JS module (i.e. `require('pico-dom')`)


### Inspiration and Design Goals

* strictly DOM element creation and manipulation (no router or store)
* minimal intermediate object. Structure is held by the DOM itself
* Some ideas taken from `snabbdom` (configurable decorators), `redom` (no virtual dom, lists).


## API

* hyperscript functions
  * `element`: Hyperscript function to generate HTMLElements, SVGElements or other namespaced Elements
  * `text`: Hyperscript function to generate TextNodes
  * `comment`: Hyperscript function to generate commentNodes
  * `component`: Hyperscript function to generate a component with custom behavious and lifecycle events
* dynamic list helpers
  * `list`: dynamic repeats and reshuffles of components to match an array of values
  * `fragment`: creates a document fragment
* testing and configuration helpers
  * `namespaces`: Configurable prefix-URL Object of namespaces. Defaults to `html` and `svg`
  * `window`: Getter-Setter to optionally set a custom `window` object for testing or server use

### Hyperscript Functions

* Element `pico.element(selector[, ...elConfig])`
  * example: `el('p', {style: {color:'blue'}}, '1'))`
* TextNode `pico.text(text)`
* CommentNode `pico.comment(text)`
* Component `pico.component(selector[, ...coConfig])`
  * example: `co('p', {update: setText}))`

only the selector is required, remaining arguments can be in any order

The `element` and `component` *hyperscript* functions have 2 additional properties:
* `.preset` to create a new function with preset defaults
  * example: `createSpecial = element.preset({xmlns: specialNamespace})`
* `.svg` same *hyperscript* function with the svg namespace preset
  * internaly: `element.svg = element.preset({xmlns: ns.svg})`
  * internaly: `component.svg = component.preset({xmlns: ns.svg})`


for example, the following are equivalent:
* `el.svg('circle')` (Internally, `el.svg = el.preset({xmlns: ns.svg})`)
* `el('svg:circle')`
* `el('circle', {xmlns: ns.svg})`
* `el.preset({xmlns: ns.svg})('circle')`
* the same logic applies for `component` (`co.svg`, ...)


#### Element Factory

* `var element = el(selector[, ...options][, ...children])`
* element is a normal `DOM Node` (Element or Text)
* String|Element `selector`
  * If an Element is provided, it is simply decorated with new attributes, properties and children
  * string example: `svg:circle[style=font-size:150%;color:blue]`
* Object `options` {attrs, props, xmlns}
  * xmlns: custom namespace for new elements
  * props & attrs: key:val pairs to add attributes and properties to a new or existing element
* String|Node|Array|Component|List `children`
  * adds children to the new or existing element

Other decorators can be added manually (eg. style, class, dataSet, ...)

#### Component Factory

* `var component = co(selector[, ...options][, ...children])`
* a component as an element and associated behaviours
  * `.node` the associated node
  * `.update(...) => this` the function to trigger changes based on external data
  * `.moveto(parentNode|null[, before])` to move the component.
  * `.setText(text)` helper efficiently and safely change the node text
  * `.updateChildren(..)` to pass down data down the tree. By default, all new components have `update` property set to `updateChildren`. If `update` is specified, children updates must be manually called.
  * `.clone() => new instance`

arguments
* String|Node `selector`: same as for `element`
* Object `options`: same as for `element` with additional optinos:
  * void `.init()`
    * example: `{init: function() { this.moveto(document.body) }}`
  * element `.update(...any)`
    * example `{update: function(v) { this.node.textContent = v }}`
  * element `.onmove(oldParent, newParent)`
    * example: `function(o,n) { if (!n) console.log('dismounted') }`
  * Object `.on` any eventName:eventListener pairs
    * example: `{on: {click: function() { this.node.textContent = 'clicked' }}}`


#### Lists

* a list is just a component or component factory that gets repeated on update to match a given array of values
  * `.header` the associated positionning header commentNode
  * `.header` the associated positionning footer commentNode
  * `.update(array) => this` triggers multiple components `component.update(value, index, array`
  * `.moveto(parentNode|null[, before])` to move the list and all content
  * `.clear([after])`
  * `.clone() => new instance`
* lists can be nested or stacked
* list takes on additional `dataKey` argument
  * if omitted, list items are never swapped but just updated with the new value
  * if a `string` or a `function` is provided list items will be swapped to match the new data ordering
    * string example: `list(myfactory, 'uid')`
    * funtion example: `list(myfactory, function(v,i) { return v.uid })`


### Additional utilities

* Object `.namespaces`: name:url list of available namespaces
  * example `namespaces.svg = 'http://www.w3.org/2000/svg'}`
* Object `.window`: configurable global `window` for testing or server use
  * example `pico.window = jsdom.jsdom().defaultView`


## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)

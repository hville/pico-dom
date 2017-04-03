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
* All in ES5 with a bare-bone WeakMaps get/set replacement for browsers below IE11 and Android 5.0. Should work on all browsers but not tested.

### Inspiration and Design Goals

* strictly DOM element creation and manipulation (no router or store)
* minimal intermediate object. Structure is held by the DOM itself


## API

### Elements
* `element(selector[, ...elConfig])`: Hyperscript function to generate HTMLElements, SVGElements or other namespaced Elements
  * example: `pico.element('p', {attrs: {style: 'color:blue'}}, '1'))`

If an Element is provided as a selector, it is simply decorated as-is with additional attributes, properties and/or children.

Only the selector is required, remaining arguments can be in any order. Objects are grouped to apply configurations, all other argument types are added to the children list
* Object `options` {attrs, props, xmlns}
  * xmlns: custom namespace for new elements
  * props & attrs: key:val pairs to add attributes and properties to a new or existing element
* String|Node|Array|Component|List `children`
  * adds children to the new or existing element

The function has 2 additional properties:
* `.preset` to create a new function with preset defaults
  * example: `createSpecial = element.preset({xmlns: specialNamespace})`
* `.svg` same *hyperscript* function with the svg namespace preset
  * internaly: `element.svg = element.preset({xmlns: ns.svg})`

#### Component Factory
* `component(selector[, ...coConfig])`: Hyperscript function to generate a component with custom behavious and lifecycle events
  * example: `pico.component('p', {update: setText}))`

A component is an Element wrapped in a container object with additional properties and methods:
* `.node` the associated node
* `.key` optional key for identification or list sorting
* `.update(...) => this` the function to trigger changes based on external data
* `.moveto(parentNode|null[, before])` to move|mount|unmount the component
* `.setText(text)` helper efficiently and safely change the node text
* `.updateChildren(..)` to pass down data down the tree. By default, all new components have `update` property set to `updateChildren`. If `update` is specified, children updates must be manually called.
* `.clone([cfg]) => new instance` to clone a component and underlying tree with optional additional configuration

The arguments are the same as when creating elements but with the following additional configuration options:
* `.init()`
  * example: `{init: function() { this.moveto(document.body) }}`
* `.update(...any)`
  * example `{update: function(v) { this.node.textContent = v }}`
* `.onmove(oldParent, newParent)`
  * example: `{onmove: function(o,n) { if (!n) console.log('dismounted') }`
* `.on` any eventName:eventListener pairs
  * example: `{on: {click: function() { this.node.textContent = 'clicked' }}}`


### DOM helpers
* `text(string)` => TextNode
* `comment(string)` => commentNodes
* `fragment()` => documentFragment


#### Lists

`list(component|componentFactory, dataKey)`

A list is a component or component factory that gets repeated on update to match a given array of values.

* `.header` the associated positionning header commentNode
* `.header` the associated positionning footer commentNode
* `.update(array) => this` triggers multiple components `component.update(value, index, array)`
* `.moveto(parentNode|null[, before])` to move the list and all content
* `.clear([after])`
* `.clone() => new instance`

* lists can be nested or stacked
* list takes on additional `dataKey` argument
  * if omitted, list items are never swapped but just updated with the new value
  * if a `string` or a `function` is provided list items will be swapped to match the new data ordering
    * string example: `list(myfactory, 'uid')`
    * funtion example: `list(myfactory, function(v,i) { return v.uid })`

### Namespaces

SVG and/or other namespaces are supported. For example, the following are equivalent:

* `el.svg('circle')` (Internally, `el.svg = el.preset({xmlns: ns.svg})`)
* `el('svg:circle')`
* `el('circle', {xmlns: ns.svg})`
* `el.preset({xmlns: ns.svg})('circle')`
* the same logic applies for `component` (`co.svg`, ...)


### testing and configuration helpers
* `namespaces`: Configurable prefix-URL Object of namespaces. Defaults to `html` and `svg`
  * example `namespaces.svg = 'http://www.w3.org/2000/svg'}`
* `window`: Getter-Setter to optionally set a custom `window` object for testing or server use
  * example `pico.window = jsdom.jsdom().defaultView`



## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
